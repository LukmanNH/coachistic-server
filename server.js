import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import instructor from "./routes/instructor.js";
import transaction from "./routes/transaction.js";
import course from "./routes/course.js";
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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// routes
app.use("/api", authRoutes);
app.use("/api/instructor", instructor);
app.use("/api/course", course);
app.use("/api/transaction", transaction);

app.listen(port, () => {
  console.log("Server Connected");
});
