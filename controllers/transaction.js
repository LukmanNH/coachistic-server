import Course from "../models/Course.js";
import slugify from "slugify";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import cloudinary from "../utils/cloudinary.js";

class TransactionController {
  static async paidEnrollment(req, res) {
    try {
      // cek course berbayar
      const course = await Course.findById(req.params.courseId).exec();
      const result = await cloudinary.uploader.upload(req.file.path);

      const transaction = await Transaction({
        user: req.user.userLogin._id,
        nama: course.name,
        price: course.price,
        course: course._id,
        status: "Pending",
        payment_picture: result.secure_url,
        cloudinary_id: result.public_id,
      });
      console.log(transaction);
      transaction.save();
      res.status(200).json({ transaction });
    } catch (err) {
      console.log("free enrollment err", err);
      return res.status(400).send("Enrollment create failed");
    }
  }

  static async getTransactionByUserId(req, res) {
    try {
      const transaction = await Transaction.find({
        user: req.user.userLogin._id,
      });
      res.status(200).json({ transaction });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  static async getAllTransaction(req, res) {
    try {
      const transaction = await Transaction.find();
      res.status(200).json({ transaction });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  static async confirmPayment(req, res) {
    const { transactionId } = req.params;
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        { _id: transactionId },
        { status: "Success" },
        { new: true }
      );

      const course = await Course.findById(transaction.course).exec();

      const result = await User.findByIdAndUpdate(
        transaction.user,
        {
          $addToSet: { courses: course._id },
        },
        { new: true }
      ).exec();
      console.log(transaction);
      res.status(200).json({ transaction });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}

export default TransactionController;
