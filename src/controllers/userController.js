import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

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
      errorMessage: "This email aready used.",
    });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username aready used.",
    });
  }
  if (password !== passwordConfirm) {
    return res.status(418).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }
  try {
    await User.create({
      email,
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
      errorMessage: "This username does not exist.",
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

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = (req, res) => res.send("Post");

export const see = (req, res) => res.send("See User");
