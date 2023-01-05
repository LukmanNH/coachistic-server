import express from "express";

const router = express.Router();

import { makeInstructor } from "../controllers/instructor.js";
import { requireSignin } from "../middlewares/verifyToken.js";

router.post("/make-instructor", requireSignin, makeInstructor);

export default router;
