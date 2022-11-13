import mongoose from "mongoose";

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
});

export default mongoose.model("User", userSchema);
