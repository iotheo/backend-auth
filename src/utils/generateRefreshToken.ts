import jwt from "jsonwebtoken";
import { Username } from "./types";

function generateRefreshToken(username: Username): string {
  const authSecret = process.env.AUTHENTICATION_SECRET!;
  const maxAge = process.env.MAX_AGE!;

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
