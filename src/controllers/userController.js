import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import multer from "multer";
import { MulterError } from "multer";

//----------------------------------------------------------------------------------------------------- JOIN
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, passwordConfirm, name, location } =
    req.body;
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This email aready used",
    });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username aready used",
    });
  }
  if (password !== passwordConfirm) {
    return res.status(418).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match",
    });
  }
  try {
    await User.create({
      email,
      avatarUrl: "images/anonymous.png",
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
//----------------------------------------------------------------------------------------------------- LOGIN
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const usernameFindOne = await User.findOne({ username, socialOnly: false });
  if (!usernameFindOne) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "This username does not exist",
    });
  }
  const match = await bcrypt.compare(password, usernameFindOne.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = usernameFindOne;
  // ⭐️Initialize session
  return res.redirect("/");
};
//----------------------------------------------------------------------------------------------------- Github
//1️⃣ 1. Request a user's GitHub identity
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  // Configuration object
  const params = new URLSearchParams(config).toString();
  // utility
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
//2️⃣ 2. Users are redirected back to your site by GitHub
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // You can also receive the response in different formats if you provide the format in the Accept header.
      },
    })
  ).json();
  // Send POST request to finalUrl
  // <fetch> gives us data first, and then we have to extract json from data.
  //3️⃣ 3. Use the access token to access the API
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        password: "",
        name: userData.name,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
//----------------------------------------------------------------------------------------------------- LOGOUT
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
//----------------------------------------------------------------------------------------------------- EDIT PROFILE
export const getEdit = (_, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  //-----------------------------------------------------------------------------------------------------🔥🔥🔥 Challenge!! #8.3
  if (email !== req.session.user.email) {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This email aready used",
      });
    }
  }
  if (username !== req.session.user.username) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This username aready used",
      });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        email,
        avatarUrl: file ? file.path : avatarUrl,
        username,
        name,
        location,
      },
      { new: true }
      // ⭐️ Option of findByIdAndUpdate, If you set <new: true>, findOneAndUpdate will instead give you the object after update was applied.
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  } catch (error) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: error._message,
    });
  }
};
//----------------------------------------------------------------------------------------------------- CHANGE PASSWORD
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const match = await bcrypt.compare(oldPassword, password);
  if (!match) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "Wrong password",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "New password confirmation does not match",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  // For using pre-save(hashing) middleware.
  req.session.user.password = user.password;
  // Update session
  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
