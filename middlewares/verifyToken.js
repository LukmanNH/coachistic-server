import { expressjwt } from "express-jwt";

const secret = process.env.SECRET_KEY;

export const requireSignin = expressjwt({
  getToken: (req, res) => req.cookies.auth_token,
  secret: "aliflukmanaryaateng",
  algorithms: ["HS256"],
});
