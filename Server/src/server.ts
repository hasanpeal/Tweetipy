import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";
import db from "../database/db";
import {
  registerUser,
  updateProfiles,
  updateTime,
  updatePodcastFile,
  findUser,
} from "../database/services/userServices";

env.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "process.env.ORIGIN",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

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
    res.status(200).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updateProfiles(email, profiles);
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
    res.status(200).json({ code: 1, message: "User doesn't exist" });
  } else {
    try {
      await updateTime(email, time);
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
