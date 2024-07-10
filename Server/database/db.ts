import mongoose from "mongoose";
import env from "dotenv";

env.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const MONGO_URL = `mongodb+srv://${username}:${password}@user.wfkfe7i.mongodb.net/?retryWrites=true&w=majority&appName=User`;

mongoose.connect(MONGO_URL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

db.on("error", () => {
  console.log("Error connecting to data base");
});

export default db;
