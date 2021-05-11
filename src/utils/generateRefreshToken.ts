import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Username } from "./types";

dotenv.config();

const authSecret = process.env.AUTHENTICATION_SECRET!;
const maxAge = process.env.MAX_AGE!;

function generateRefreshToken(username: Username): string {
  const refreshToken: string = jwt.sign(
    {
      user: username,
    },
    authSecret,
    {
      algorithm: "HS512",
      expiresIn: maxAge,
    }
  );

  return refreshToken;
}

export default generateRefreshToken;
