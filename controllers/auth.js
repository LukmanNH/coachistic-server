import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signUp = async (req, res) => {
  try {
    const { nama, no_telp, email, password } = req.body;

    if (!nama) return res.status(400).send("Name is required.");
    if (!no_telp) return res.status(400).send("Telphone number is required.");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is required and must be min 6 character long.");

    const emailExist = await User.findOne({ email }).exec();
    console.log(emailExist);
    if (emailExist) return res.status(400).send("Email is taken.");

    // encrypt password
    var hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User({
      nama,
      no_telp,
      email,
      password: hashedPassword,
    });
    newUser.save();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error register. try again.");
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and password is required");

    const userLogin = await User.findOne({ email }).exec();

    // compare
    const match = await bcrypt.compare(password, userLogin.password);
    if (!match)
      return res.status(400).send("Login failed. Credentials incorrect.");

    userLogin.password = undefined;
    // jwt
    const token = jwt.sign({ userLogin }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res
      .cookie("auth_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userLogin);
  } catch (error) {
    console.log(error);
    res.status(400).send("Login error. Try again!");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("auth_token");
    return res.json({ message: "Signout Success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
