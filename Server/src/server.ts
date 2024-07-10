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

env.config();

const app = express();
const port = 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  })
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});