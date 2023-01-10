import express from "express";

const router = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";

import CourseController from "../controllers/course.js";

// get all course
router.get("/", CourseController.courses);

router.get("/user-courses", authenticateToken, CourseController.userCourses);

// get course by id
router.get("/course/:slug", CourseController.read);

// get course by id
router.get("/:slug", authenticateToken, CourseController.getCourseById);

// create course
router.post("/", authenticateToken, CourseController.create);

// get lesson
router.get("/lessons/:slug", authenticateToken, CourseController.getLesson);

// add lesson
router.post(
  "/add-lesson/:slug/:instructorId",
  authenticateToken,
  CourseController.addLesson
);

// delete lesson
router.delete(
  "/lessons/:slug/:lessonId",
  authenticateToken,
  CourseController.removeLesson
);

// update lesson
router.put(
  "/lessons/:slug/:lessonId",
  authenticateToken,
  CourseController.updateLessons
);

// update course
router.put("/:slug/", authenticateToken, CourseController.updateCourse);

// free course
router.post(
  "/free-enrollment/:courseId",
  authenticateToken,
  CourseController.freeEnrollment
);

export default router;
