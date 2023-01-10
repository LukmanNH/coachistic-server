import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Validator from "../utils/validatorAuth.js";

class UserController {
  static async signUp(req, res) {
    const { nama, no_telp, email, password } = req.body;
    try {
      if (Validator.checkSignUp(nama, no_telp, email, password)) {
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
      } else {
        res.status(400).send("Error register. try again.");
      }
      // if (!nama) return res.status(400).send("Name is required.");
      // if (!no_telp) return res.status(400).send("Telphone number is required.");
      // if (!password || password.length < 6)
      //   return res
      //     .status(400)
      //     .send("Password is required and must be min 6 character long.");
    } catch (err) {
      console.log(err);
      res.status(400).send("Error register. try again.");
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    try {
      if (Validator.checkSignIn(email, password)) {
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

        res.status(200).json({
          expretise: userLogin.expretise,
          instagram: userLogin.instagram,
          discord: userLogin.discord,
          summary: userLogin.summary,
          _id: userLogin._id,
          nama: userLogin.nama,
          no_telp: userLogin.no_telp,
          email: userLogin.email,
          picture: userLogin.picture,
          role: userLogin.role,
          courses: userLogin.courses,
          token,
        });
      } else {
        res.status(400).send("Login error. Try again!");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Login error. Try again!");
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("auth_token");
      return res.json({ message: "Signout Success" });
    } catch (err) {
      console.log(err);
    }
  }

  static async currentUser(req, res) {
    try {
      const user = await User.findById(req.user.userLogin._id)
        .select("-password")
        .exec();
      console.log("CURRENT_USER", user);
      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
    }
  }
}

export default UserController;
