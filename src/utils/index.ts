import dotenv from "dotenv";

import { UserCredentials, Username } from "./types";
import generateRefreshToken from "./generateRefreshToken";
import generateAccessToken from "./generateAccessToken";

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

export { hasValidCredentials, generateRefreshToken, generateAccessToken };
