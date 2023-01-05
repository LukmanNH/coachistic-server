import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import instructor from "./routes/instructor.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

// db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

// middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api", authRoutes);
app.use("/api/instructor", instructor);

app.listen(port, () => {
  console.log("Server Connected");
});
