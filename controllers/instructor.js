import User from "../models/User.js";
import Course from "../models/Course.js";
import cloudinary from "../utils/cloudinary.js";
import Validator from "../utils/instructorValidator.js";
// import upload from "../utils/multer.js";

class InstructorController {
  static async makeInstructor(req, res) {
    const { discord, instagram, expertise, summary } = req.body;
    try {
      if (
        Validator.checkMakeInstructor(discord, instagram, expertise, summary)
      ) {
        const user = await User.findById(req.user.userLogin._id).exec();
        console.log(user);
        if (user) {
          const statusUpdated = await User.findByIdAndUpdate(
            user._id,
            {
              role: "Instructor",
              discord: discord,
              instagram: instagram,
              expertise: expertise,
              summary: summary,
            },
            { new: true }
          )
            .select("-password")
            .exec();
          console.log(statusUpdated);
          return res.status(200).send({ ok: true, statusUpdated });
        }
        return res.status(400).send({ ok: false });
      } else {
        return res.status(400).send({ ok: false });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ ok: false });
    }
  }

  static async instructorCourses(req, res) {
    try {
      const courses = await Course.find({ instructor: req.user.userLogin._id })
        .sort({ createdAt: -1 })
        .exec();
      res.json(courses);
    } catch (err) {
      console.log(err);
    }
  }

  static async updateProfile(req, res) {
    console.log("hit");
    const {
      nama,
      no_telp,
      umur,
      jenis_kelamin,
      expertise,
      instagram,
      discord,
      summary,
    } = req.body;
    try {
      const user = await User.findById(req.user.userLogin._id).exec();

      const result = await cloudinary.uploader.upload(req.file.path);
      if (user) {
        const statusUpdated = await User.findByIdAndUpdate(
          user._id,
          {
            nama,
            no_telp,
            umur,
            jenis_kelamin,
            expertise,
            instagram,
            discord,
            summary,
            picture: result.secure_url,
            cloudinary_id: result.public_id,
          },
          { new: true }
        )
          .select("-password")
          .exec();
        console.log(statusUpdated);
        return res.status(200).send({ ok: true, statusUpdated });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default InstructorController;
