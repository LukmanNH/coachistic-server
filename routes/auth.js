import express from "express";
// import { signIn, signUp, logout, currentUser } from "../controllers/auth.js";
import UserController from "../controllers/auth.js";

const router = express.Router();

router.post("/login", UserController.signIn);
router.post("/register", UserController.signUp);
router.get("/current-user", UserController.currentUser);
router.get("/logout", UserController.logout);

export default router;
