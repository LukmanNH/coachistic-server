import Course from "../models/Course.js";
import slugify from "slugify";
import User from "../models/User.js";
import Validator from "../utils/validatorCourse.js";

class CourseController {
  static async getCourseById(req, res) {
    const { slug } = req.params;
    try {
      if (Validator.checkGetCourseById(slug)) {
        const course = await Course.findOne({ slug });
        res.status(200).json({ course });
      } else {
        res.status(400).send("Error Get Course");
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }

  static async create(req, res) {
    try {
      const alreadyExist = await Course.findOne({
        slug: slugify(req.body.name.toLowerCase()),
      });
      if (alreadyExist) return res.status(400).send("Title is taken");

      const course = await new Course({
        slug: slugify(req.body.name),
        instructor: req.user.userLogin._id,
        ...req.body,
      }).save();

      res.json(course);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Course create failed. Try again.");
    }
  }

  static async read(req, res) {
    try {
      const course = await Course.findOne({ slug: req.params.slug })
        .populate("instructor", "_id name")
        .exec();
      res.json(course);
    } catch (err) {
      console.log(err);
    }
  }

  static async updateCourse(req, res) {
    const { slug } = req.params;
    try {
      const course = await Course.findOne({ slug }).exec();
      if (req.user.userLogin._id != course.instructor) {
        return res.status(400).send("Unauthorized");
      }
      const updated = await Course.findOneAndUpdate({ slug }, req.body, {
        new: true,
      }).exec();
      res.json(updated);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  static async getLesson(req, res) {
    const { slug } = req.params;
    try {
      const { lessons } = await Course.findOne({
        slug,
      });
      console.log(lessons);
      res.status(200).json({ lessons });
    } catch (error) {
      console.log(error);
      return res.status(400).send("get lesson failed");
    }
  }

  static async addLesson(req, res) {
    try {
      const { slug, instructorId } = req.params;
      const { title, description, video } = req.body;

      if (Validator.checkAddLesson(title, description, video)) {
        if (req.user.userLogin._id != instructorId) {
          return res.status(400).send("Unauthorized");
        }

        const updated = await Course.findOneAndUpdate(
          { slug },
          {
            $push: {
              lessons: {
                title,
                description,
                video_url: video,
                slug: slugify(title),
              },
            },
          },
          { new: true }
        )
          .populate("instructor", "_id name")
          .exec();
        res.json(updated);
      } else {
        return res.status(400).send("Add lesson failed");
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("Add lesson failed");
    }
  }

  static async removeLesson(req, res) {
    try {
      const { slug, lessonId } = req.params;
      const course = await Course.findOne({ slug });
      if (req.user.userLogin._id != course.instructor) {
        return res.status(400).send("Unauthorized");
      }

      const deletedCourse = await Course.findByIdAndUpdate(course._id, {
        $pull: { lessons: { _id: lessonId } },
      }).exec();

      res.json({ ok: true });
      res.status(200).json({ ok: true });
    } catch (error) {}
  }

  static async updateLessons(req, res) {
    try {
      const { slug } = req.params;
      const { _id, title, description, video_url, free_preview } = req.body;
      const course = await Course.findOne({ slug }).select("instructor");

      if (Validator.checkUpdateLessons(title, description, video_url)) {
        if (course.instructor._id != req.user.userLogin._id) {
          return res.status(400).send("Unauthorized");
        }

        const updated = await Course.updateOne(
          { "lessons._id": _id },
          {
            $set: {
              "lessons.$.title": title,
              "lessons.$.description": description,
              "lessons.$.video_url": video_url,
              "lessons.$.free_preview": free_preview,
            },
          },
          { new: true }
        ).exec();
        // console.log("updated", updated);
        res.json({ ok: true });
      } else {
        return res.status(400).send("Update lesson failed");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Update lesson failed");
    }
  }

  static async courses(req, res) {
    const all = await Course.find({ published: true })
      .populate("instructor", "_id name")
      .exec();
    res.json(all);
  }

  static async freeEnrollment(req, res) {
    try {
      // cek course berbayar
      const course = await Course.findById(req.params.courseId).exec();
      if (course.paid) return;

      const result = await User.findByIdAndUpdate(
        req.user.userLogin._id,
        {
          $addToSet: { courses: course._id },
        },
        { new: true }
      ).exec();
      console.log(result);
      res.json({
        message: "Congratulations! You have successfully enrolled",
        course,
      });
    } catch (err) {
      console.log("free enrollment err", err);
      return res.status(400).send("Enrollment create failed");
    }
  }

  static async userCourses(req, res) {
    const user = await User.findById(req.user.userLogin._id).exec();
    const courses = await Course.find({ _id: { $in: user.courses } })
      .populate("instructor", "_id name")
      .exec();
    res.json(courses);
  }
}

export default CourseController;
