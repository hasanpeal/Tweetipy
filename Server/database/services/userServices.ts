import User from "../models/user";
import db from "../db";
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
    const user = new User({ firstName, lastName, email, password: hashedPass });
    await user.save();
    return user;
  } catch (err) {
    console.log(
      "Error in registration: registerUser function in userServices.ts",
      err
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
      // const uniqueProfiles = newProfiles.filter(
      //   (profile) => !user.twitterProfiles.includes(profile)
      // );
      // user.twitterProfiles = [...user.twitterProfiles, ...uniqueProfiles];
      user.twitterProfiles = [];
      user.twitterProfiles.push(...newProfiles);
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

// Update users password
export async function updatePassword(email: string, newPassword: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User not found: updatePassword function in userServices.ts");
    } else {
      const saltRounds = process.env.SALT_ROUNDS;
      const hashedPass = await bcrypt.hash(newPassword, Number(saltRounds));
      user.password = hashedPass;
      await user.save();
      return user;
    }
  } catch (error) {
    console.log(
      "Error updating users password: updatePassword function in userService.ts"
    );
  }
}

// Know if user is new
export async function isNewUser(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log("User not found in isNewUser function of UserServices.ts");
    else {
      const res = user.newUser;
      return res;
    }
  } catch (err) {
    console.log(
      "Error knowing whether user is new: isNewUser function in userService.ts"
    );
  }
}

// Flag new user or not
export async function flagNewUser(email: string, bool: boolean) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log("User not found in flagNewUser function of UserServices.ts");
    else {
      user.newUser = bool;
      await user.save();
    }
  } catch (err) {
    console.log(
      "Error flagging new user: flagNewUser function in userServices.ts"
    );
  }
}

// Know if user is Twitter authenticated
export async function isTwitterUser(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log(
        "User not found in isTwitterUser function of UserServices.ts"
      );
    else {
      const res = user.twitterUser;
      return res;
    }
  } catch (err) {
    console.log(
      "Error knowing whether user is twitter use: isTwitterUser function in userService.ts"
    );
  }
}

// Flag twitter users
export async function flagTwitterUser(email: string, bool: boolean) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log(
        "User not found in flagTwitterUser function of UserServices.ts"
      );
    else {
      user.twitterUser = bool;
      await user.save();
    }
  } catch (err) {
    console.log(
      "Error flagging twitterUser: flagTwitterUser function in uberServices.ts"
    );
  }
}

// Authenticate login
export async function performAuth(email: string, password: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return 1;
    }
    const passMatched = await bcrypt.compare(password, user.password);
    if (!passMatched) {
      return 2;
    }
    return 0;
  } catch (err) {
    console.log(
      "Error authenticate login: performAuth function in userService.ts"
    );
  }
}

// Add twitter username
export async function addTwitterUsername(email: string, username: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User doesn't exist at addTwitterUsername");
    } else {
      user.twitterUsername = username;
      await user.save();
    }
  } catch (err) {
    console.log(
      "Error adding twitter username: addTwitterUsername function in userService.ts"
    );
  }
}

// Know users twitter username
export async function getTwitterUsername(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log(
        "User not found in getTwitterUsername function of UserServices.ts"
      );
    else {
      const res = user.twitterUsername;
      return res;
    }
  } catch (err) {
    console.log(
      "Error knowing whether twitter username: getTwitterUsername function in userService.ts"
    );
  }
}

// Get user followed profiles
export async function getFollowedProfiles(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log(
        "User not found in getFollowedProfiles function of UserServices.ts"
      );
    else {
      const res = user.twitterProfiles;
      return res;
    }
  } catch (err) {
    console.log(
      "Error retriving followed profiles: getFollowedProfiles function in userService.ts"
    );
  }
}

// Get user preferred time
export async function getTime(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log("User not found in getTime function of UserServices.ts");
    else {
      const res = user.emailTime;
      return res;
    }
  } catch (err) {
    console.log("Error retriving time: getTime function in userService.ts");
  }
}

// Get users firstname, lastname, email
export async function getInfo(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user)
      console.log("User not found in getInfo function of UserServices.ts");
    else {
      const res = {
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return res;
    }
  } catch (err) {
    console.log("Error getting info: getInfo function in uberServices.ts");
  }
}

// Update users info
export async function updateInfo(
  email: string,
  newfirstName: string,
  newlastName: string
) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User doesn't exist at updateInfo");
    } else {
      user.firstName = newfirstName;
      user.lastName = newlastName;
      await user.save();
    }
  } catch (err) {
    console.log("Error updating info: updateInfo function in userService.ts");
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
