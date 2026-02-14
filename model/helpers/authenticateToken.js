import MESSAGES from "./messagehelper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
// console.log("authHeader=======",authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(MESSAGES.rescode.HTTP_UNAUTHORIZED)
        .json({ message: MESSAGES.apiErrorStrings.INVALID_TOKEN });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.auth = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    // console.log(req.auth,"req.auth=====");
    

    next();
  } catch (err) {
    return res
      .status(MESSAGES.rescode.HTTP_UNAUTHORIZED)
      .json({ message: MESSAGES.apiErrorStrings.INVALID_TOKEN });
  }
};
