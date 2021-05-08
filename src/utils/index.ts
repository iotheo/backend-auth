import { UserCredentials, Username } from "./types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authSecret = process.env.AUTHENTICATION_SECRET!;
const maxAge = process.env.MAX_AGE!;

// a so called db :)
let users: UserCredentials[] = [
  {
    username: "john",
    password: "1234",
  },
];

function hasValidCredentials(userCredentials: UserCredentials): boolean {
  const { username, password } = userCredentials;
  const userIndex = users.findIndex(
    (user: UserCredentials) => user.username === username
  );

  const userExists = userIndex !== -1;

  if (!userExists) {
    return false;
  }

  if (password !== users[userIndex].password) {
    return false;
  }

  return true;
}

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

function generateAccessToken(): string {
  const accessToken: string = jwt.sign({}, authSecret, {
    algorithm: "HS512",
    expiresIn: 60 * 15,
  });

  return accessToken;
}

export { hasValidCredentials, generateRefreshToken, generateAccessToken };
