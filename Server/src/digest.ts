import axios from "axios";
import moment from "moment";
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "dotenv";
import sgMail from "@sendgrid/mail";
import cron from "node-cron";
import { marked } from "marked";
import { htmlToText } from "html-to-text";
import User from "../database/models/user";

env.config();
const genAI = new GoogleGenerativeAI(process.env.GEN_AI || "");
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const options = (screenname: string) => ({
  method: "GET",
  url: "https://twitter-api45.p.rapidapi.com/timeline.php",
  params: { screenname },
  headers: {
    "x-rapidapi-key": process.env.RAPID_API,
    "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
  },
});

async function getRecentTweets(email: string) {
  console.log("Hitting function getRecentTweets");
  const res: { user: string; tweets: any }[] = [];
  const user = await User.findOne({ email }).exec();
  if (!user) console.error("User not found on getRecentTweets");
  else {
    const time = user.emailTime;
    const screennames = user.twitterProfiles;
    if (time) {
      const currentTime = moment().utc().hour(Number(time)).minute(0).second(0);
      const time24HoursAgo = currentTime.clone().subtract(24, "hours");
      try {
        const requests = screennames.map((screenname) =>
          axios.request(options(screenname))
        );
        const responses = await Promise.all(requests);
        responses.forEach((response, index) => {
          const tweets = response.data.timeline;
          const recentTweets = tweets.filter((tweet: any) => {
            const tweetTime = moment(
              tweet.created_at,
              "ddd MMM DD HH:mm:ss Z YYYY"
            );
            return tweetTime.isBetween(time24HoursAgo, currentTime);
          });

          res.push({
            user: screennames[index],
            tweets: recentTweets.map((tweet: any) => tweet.text),
          });
        });
        // Generate the newsletter
        let newsletter = "";
        if(!user.twitterProfiles || user.twitterProfiles.length === 0){
          newsletter = "Not enough followed profiles to generate newsletter"
        } else {
          newsletter = await generateNewsletter(res);
        }
        if (!newsletter) {
          console.error("Error generating newletter");
        }
        // Convert Markdown to plain text for podcast
        const newsletterHtml = await marked(newsletter);
        const plainTextNewsletter = htmlToText(newsletterHtml);
        // Generate podcast
        const podcast = await generatePodcast(plainTextNewsletter);
        user.newsletter = plainTextNewsletter;
        user.podcastFile = podcast;
        await user.save();
        return {
          email: user.email,
          newsletter,
          podcast,
          firstName: user.firstName,
        };
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Time is empty in getRecentTweets");
    }
  }
}

async function generateNewsletter(data: { user: string; tweets: string[] }[]) {
  const prompt = data
    .map((user) => {
      return `User: ${user.user}\nTweets:\n${user.tweets.join("\n")}\n\n`;
    })
    .join("\n");
  const fullPrompt: string = `Create a detailed and engaging newsletter based on the following tweets from different users:\n\n${prompt}. If not enough content, just return a response saying "Not enough content to generate newsletter" thats it nothing else. Please make sure your response is regular text`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([fullPrompt]);
  return result.response.text();
}

async function generatePodcast(newsletter: string) {
  const options = {
    method: "POST",
    url: "https://realistic-text-to-speech.p.rapidapi.com/v3/generate_voice_over_v2",
    headers: {
      "x-rapidapi-key": process.env.PODCAST_API,
      "x-rapidapi-host": "realistic-text-to-speech.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      voice_obj: {
        id: 2021,
        voice_id: "en-US-Neural2-I",
        gender: "Male",
        language_code: "en-US",
        language_name: "US English",
        voice_name: "Maxwell",
        sample_text:
          "Hello, hope you are having a great time making your video.",
        sample_audio_url:
          "https://s3.ap-south-1.amazonaws.com/invideo-uploads-ap-south-1/speechen-US-Neural2-I16831901125770.mp3",
        status: 2,
        rank: 0,
        type: "google_tts",
        isPlaying: false,
      },
      json_data: [
        {
          block_index: 0,
          text: `${newsletter}`,
        },
      ],
    },
  };
  try {
    const response = await axios.request(options);
    const mp3Url = response.data[0].link;
    return mp3Url;
  } catch (error) {
    if (error) {
      console.error("API response error in generatePodcast");
    }
  }
}

// Sent email
async function sendEmail(
  email: string,
  newsletter: string,
  podcast: string,
  firstName: string
) {
  const htmlContent = marked(newsletter);
  const msg = {
    to: email,
    from: "tweetipyinquires@gmail.com",
    subject: `Hey ${firstName} your Tweetipy daily digest is here 👋`,
    text: `${newsletter}\nDaily Tweetipy Podcast 👉 ${podcast}`,
    html: `
      <div>
        ${htmlContent}
        <h2>Tweetipy Podcast 🎧</h2>
        <audio controls>
          <source src="${podcast}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `,
  };
  await sgMail
    .send(msg)
    .then(async () => {
      console.log(`Email sent successful to ${email}`);
    })
    .catch((error) => {
      console.log(`Error sending email to ${email}`);
    });
}

// Automate the email process with cron
const allowedTimes = [9, 12, 15, 18, 21, 24];
allowedTimes.forEach((time) => {
  const cronTime = `0 ${time === 24 ? 0 : time} * * *`;
  cron.schedule(cronTime, async () => {
    console.log(
      `Cron job running at ${new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      })}`
    );
    const users = await User.find({ emailTime: time.toString() }).exec();
    users.forEach(
      async (user) => {
        const result = await getRecentTweets(user.email);
        if (result) {
          const { email, newsletter, podcast, firstName } = result;
          await sendEmail(email, newsletter, podcast, firstName);
        }
      },
      {
        scheduled: true,
        timezone: "America/New_York",
      }
    );
  });
});
