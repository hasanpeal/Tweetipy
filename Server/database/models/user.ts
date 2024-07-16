import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twitterProfiles: { type: [String], default: [] },
  emailTime: { type: String },
  podcastFile: {
    type: String,
    default:
      "https://s3.us-east-1.amazonaws.com/invideo-uploads-us-east-1/speechen-US-Neural2-I17211555499690.mp3",
  },
  newUser: { type: Boolean, default: true },
  twitterUser: { type: Boolean, default: false },
  twitterUsername: { type: String },
  newsletter: {
    type: String,
    default: "Thank you for signing up. Please wait for your first newsletter",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
