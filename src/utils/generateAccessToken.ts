import jwt from "jsonwebtoken";
import { Username } from "./types";

function generateAccessToken(username: Username): string {
  const authSecret = process.env.AUTHENTICATION_SECRET!;
  const expiry = process.env.ACCESS_TOKEN_MAX_AGE!;

  const accessToken: string = jwt.sign({ user: username }, authSecret, {
    algorithm: "HS512",
    expiresIn: expiry,
  });

  return accessToken;
}

export default generateAccessToken;
