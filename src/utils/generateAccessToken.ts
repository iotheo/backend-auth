import { Username } from "./types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authSecret = process.env.AUTHENTICATION_SECRET!;
const expiry = process.env.ACCESS_TOKEN_MAX_AGE!;

function generateAccessToken(): string {
  const accessToken: string = jwt.sign({}, authSecret, {
    algorithm: "HS512",
    expiresIn: expiry,
  });

  return accessToken;
}

export default generateAccessToken;
