import User from "../models/user";
import bcrypt from "bcrypt";

// Registers new user
export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    const saltRounds = process.env.SALT_ROUNDS;
    const hashedPass = await bcrypt.hash(password, Number(saltRounds));
    const user = new User({ firstName, lastName, email, hashedPass });
    await user.save();
    return user;
  } catch (err) {
    console.log(
      "Error in registration: registerUser function in userServices.ts"
    );
  }
}

// Update Twitter Profiles
export async function updateProfiles(email: string, newProfiles: [string]) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User not found: updateProfiles function in userServices.ts");
    } else {
      user.twitterProfiles = [...user.twitterProfiles, ...newProfiles];
      await user.save();
      return user;
    }
  } catch (error) {
    console.log(
      "Error updating profiles: updateProfiles function in userService.ts"
    );
  }
}

// Update Time to Sent Email
export async function updateTime(email: string, newTime: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User not found: updateTime function in userServices.ts");
    } else {
      user.emailTime = newTime;
      await user.save();
      return user;
    }
  } catch (eror) {
    console.log("Error updating time: updateTime function in userService.ts");
  }
}

// Update Podcast File
export async function updatePodcastFile(email: string, newPodcastFile: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log(
        "User not found: updatePodcastFile function in userServices.ts"
      );
    } else {
      user.podcastFile = newPodcastFile;
      await user.save();
      return user;
    }
  } catch (error) {
    console.log(
      "Error updating podcast file: updatePoscastFile function in userService.ts"
    );
  }
}

// Validate User by Email
export async function findUser(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.log("Email not found: findUser function in uberServices.ts");
  }
}

// Performing check if .env variables getting retrived
export function jestTest() {
  const saltRounds = process.env.SALT_ROUNDS;
  return Number(saltRounds);
}
