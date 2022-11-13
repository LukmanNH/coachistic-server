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
  const { email, password } = req.body;
};
