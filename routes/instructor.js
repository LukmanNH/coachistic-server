import express from "express";
import upload from "../utils/multer.js";

const router = express.Router();
import InstructorController from "../controllers/instructor.js";
import { authenticateToken } from "../middlewares/verifyToken.js";

// update user to instructor
router.post(
  "/make-instructor",
  authenticateToken,
  InstructorController.makeInstructor
);

router.get(
  "/instructor-courses",
  authenticateToken,
  InstructorController.instructorCourses
);

// update profile instructor
router.put(
  "/update",
  upload.single("picture"),
  authenticateToken,
  InstructorController.updateProfile
);

export default router;
