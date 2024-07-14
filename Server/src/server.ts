import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as TwitterStrategy } from "passport-twitter";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import db from "../database/db";
import User from "../database/models/user";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
  registerUser,
  updateProfiles,
  updateTime,
  updatePodcastFile,
  findUser,
  updatePassword,
  performAuth,
  flagNewUser,
  isNewUser,
} from "../database/services/userServices";

env.config();
const app = express();
const port = process.env.PORT;
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

declare module "express-session" {
  interface Session {
    signup?: boolean;
  }
}

// Passport strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await findUser(email);
        const result = await performAuth(email, password);
        if (result === 1) {
          return done(null, false, { message: "Incorrect email" });
        } else if (result === 2) {
          return done(null, false, { message: "Incorrect password" });
        } else if (!user) {
          return done(null, false, { message: "User not found" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Passport Twitter strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY!,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
      callbackURL: "http://localhost:3001/x/oauth/callback",
      includeEmail: true,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        if (!email) {
          return done(new Error("No email found"));
        }

        const isSignUp = req.session.signup;
        delete req.session.signup;

        const firstName =
          profile?.name?.givenName || profile?.displayName?.split(" ")[0] || "";
        const lastName =
          profile?.name?.familyName ||
          profile?.displayName?.split(" ")[1] ||
          "";

        if (isSignUp) {
          // Handle sign-up
          const existingUser = await findUser(email);
          if (existingUser) {
            req.flash("error", "User already exists");
            return done(null, false);
          }
          let connection = await db;
          await registerUser(firstName, lastName, email, "");
          const newUser = await findUser(email);
          return done(null, newUser);
        } else {
          // Handle sign-in
          const user = await findUser(email);
          if (!user) {
            req.flash("error", "User not found");
            return done(null, false);
          }
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Twitter OAuth routes for sign-in
app.get("/x/oauth/signin", passport.authenticate("twitter"));

// Twitter OAuth callback route for sign-in
app.get("/x/oauth/callback", (req, res, next) => {
  passport.authenticate("twitter", (err: Error | null, user: any) => {
    if (err) return next(err);
    if (!user) {
      const message = req.flash("error")[0] || "Authentication failed";
      return res.redirect(`http://localhost:3000/login?code=1&message=${message}`);
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect(`http://localhost:3000/login?code=0&message=Successful%20login&email=${user.email}`);
    });
  })(req, res, next);
});

// Twitter OAuth routes for sign-up
app.get("/x/oauth/signup", (req, res, next) => {
  req.session.signup = true;
  passport.authenticate("twitter")(req, res, next);
});

// Twitter OAuth callback route for sign-up
app.get("/x/oauth/signup/callback", (req, res, next) => {
  passport.authenticate("twitter", async (err: Error | null, user: any) => {
    if (err) return next(err);
    if (!user) {
      const message = req.flash("error")[0] || "Authentication failed";
      return res.redirect(`http://localhost:3000/signup?code=1&message=${message}`);
    }
    const email = user?.email;
    return res.redirect(`http://localhost:3000/signup?code=0&email=${email}&message=Successful%20signup`);
  })(req, res, next);
});


// POST Route for login
app.post("/login", (req, res, next) => {
  console.log("Directed to POST Route -> /login");
  passport.authenticate("local", (err: Error | null, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(200).json({ code: 1, message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ code: 0, message: "Login successful" });
    });
  })(req, res, next);
});

// POST Route for logout
app.post("/logout", (req, res) => {
  console.log("Directed to POST Route -> /logout");
  req.logout((err) => {
    if (err) {
      return res.status(200).json({ code: 1, message: "Error logging out" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(200)
          .json({ code: 1, message: "Error destroying session" });
      }
      res.status(200).json({ code: 0, message: "Logout successful" });
    });
  });
});

// POST Route for registering user
app.post("/register", async (req, res) => {
  console.log("Directed to POST Route -> /register");
  let connection = await db;
  const firstName: string = req.body.firstName;
  const lastName: string = req.body.lastName;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const user = await findUser(email);
  if (user) {
    res.status(200).json({ code: 1, message: "User already exist" });
  } else {
    try {
      await registerUser(firstName, lastName, email, password);
      res.status(200).json({ code: 1, message: "User added successfully" });
    } catch (err) {
      console.log("Error registering user on /register route");
    }
  }
});

// POST Route for updating profiles
app.post("/updateProfile", async (req, res) => {
  console.log("Directed to POST Route -> /updateProfile");
  let connection = await db;
  const email: string = req.body.email;
  const profiles: [string] = req.body.profiles;
  const user = await findUser(email);
  if (!user) {
    res.status(400).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updateProfiles(email, profiles);
      res.status(200).json({ code: 0 });
    } catch (err) {
      console.log("Error updating profiles on /updateProfile route");
    }
  }
});

// POST Route for updating time
app.post("/updateTime", async (req, res) => {
  console.log("Directed to POST Route -> /updateTime");
  let connection = await db;
  const email: string = req.body.email;
  const time: string = req.body.time;
  const user = await findUser(email);
  if (!user) {
    res.status(400).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updateTime(email, time);
      res.status(200).json({ code: 0 });
    } catch (err) {
      console.log("Error updating time on /updateTime route");
    }
  }
});

// POST Route for updating podcast file
app.post("/updatePodcast", async (req, res) => {
  console.log("Directed to POST Route -> /updatePodcast");
  let connection = await db;
  const email: string = req.body.email;
  const podcast: string = req.body.podcast;
  const user = await findUser(email);
  if (!user) {
    res.status(200).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updatePodcastFile(email, podcast);
    } catch (err) {
      console.log("Error updating podcast on /updatePodcast route");
    }
  }
});

// POST Route for sending OTP
app.post("/sentOTP", async (req, res) => {
  console.log("Directed to POST Route -> /sentOTP");
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const msg = {
    to: email,
    from: "tweetipyinquires@gmail.com",
    subject: "Your Tweetipy OTP Code is here",
    text: `Your OTP code is ${otp}`,
    html: `<strong> Welcome to Tweetipy. Your OTP code is ${otp}</strong>`,
  };
  await sgMail
    .send(msg)
    .then(async () => {
      console.log("OTP successfully sent");
      res.status(200).send({ code: 0, otp: otp });
    })
    .catch((error) => {
      console.log("Error sending OTP email on /sentOTP route");
      res.status(200).send({ code: 1 });
    });
});

// POST Route for reseting password
app.post("/resetPassword", async (req, res) => {
  console.log("Directed to POST Route -> /resetPassword");
  const { email, newPassword } = req.body;
  let connection = await db;
  const user = await findUser(email);
  if (!user) {
    res.status(200).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updatePassword(email, newPassword);
      res.status(200).json({ code: 0 });
    } catch (err) {
      console.log("Error updating password on /resetPassword route");
    }
  }
});

// GET route for validating email
app.get("/validateEmail", async (req, res) => {
  console.log("Directed to GET Route -> /validateEmail");
  const email: string = req.query.email as string;
  let connection = await db;
  const user = await findUser(email);
  if (!user) {
    res.status(200).json({ code: 1 });
  } else {
    res.status(200).json({ code: 0 });
  }
});

// POST route for updating new user flag
app.post("/updateNewUser", async (req, res) => {
  console.log("Directed to POST Route -> /updateNewUser");
  let connection = await db;
  const email: string = req.body.email;
  const bool: boolean = req.body.bool;
  const user = await findUser(email);
  if (!user) {
    res.status(400).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await flagNewUser(email, bool);
      res.status(200).json({ code: 0, message: "Success" });
    } catch (err) {
      console.log("Error updating new user flag on /updateNewUser route");
    }
  }
});

// POST route for knowing new user
app.get("/isNewUser", async (req, res) => {
  console.log("Directed to GET Route -> /isNewUser");
  let connection = await db;
  const email: string = req.query.email as string;
  const user = await findUser(email);
  if (!user) {
    res.status(400).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      const result = await isNewUser(email);
      res.status(200).json({ code: 0, bool: result });
    } catch (err) {
      console.log("Error knowing new user on /isNewUser route");
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
