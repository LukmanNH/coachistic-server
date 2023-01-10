import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null)
    return next(createError(401, "Authentication tidak ditemukan"));

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(createError(419, "Authentication Error"));
    req.user = user;
    next();
  });
};
