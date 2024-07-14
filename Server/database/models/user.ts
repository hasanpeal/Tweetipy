import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twitterProfiles: { type: [String], default: [] },
  emailTime: { type: String },
  podcastFile: { type: String },
  newUser: { type: Boolean, default: true },
  twitterUser: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
