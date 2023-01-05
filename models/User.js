import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const userSchema = mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  no_telp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requried: true,
  },
  picture: {
    type: String,
    default: "",
  },
  role: {
    type: [String],
    default: ["Gamers"],
    enum: ["Gamers", "Instructor", "Admin"],
  },
  passwordResetCode: {
    data: String,
    default: "",
  },
  expertise: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  discord: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  courses: [{ type: ObjectId, ref: "Course" }],
});

export default mongoose.model("User", userSchema);
