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

app.use("/", async () => {
  console.log("Route / has been directed");
  let connection = await db;
  console.log(connection);
  const user = await registerUser("Peal", "Hasan", "pealh0320@gmail.com", "245810");
  if(user) console.log("User Added");
  else console.log("Error adding user")
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
