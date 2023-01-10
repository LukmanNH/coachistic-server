import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: ObjectId,
      ref: "Course",
      required: true,
    },
    nama: String,
    price: String,
    status: {
      type: String,
      enum: ["Pending", "Success"],
    },
    payment_picture: String,
    cloudinary_id: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
