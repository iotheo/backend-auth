import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import {
  generateRefreshToken,
  generateAccessToken,
  hasValidCredentials,
} from "./utils";

import { UserCredentials } from "./utils/types";
import { authMiddleware } from "./middlewares";

const logger = require("./log/config");

const app = express();
app.use(cookieParser());

app.use(logger.successHandler);
app.use(logger.errorHandler);
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT!;
const maxAge = process.env.MAX_AGE!;

app.post("/login", (req: Request<{}, {}, UserCredentials>, res: Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Empty request body",
    });
  }

  if (!req.body.username || !req.body.password) {
    return res.status(422).json({
      message: "Request body fields are invalid",
    });
  }

  if (!hasValidCredentials(req.body)) {
    return res.status(401).json({
      message: "Wrong credentials. Please try again",
    });
  }

  const refreshToken = generateRefreshToken(req.body.username);

  const decodedRefreshToken = jwt.decode(refreshToken);

  if (!decodedRefreshToken) {
    return res.status(401).json({
      message: "Invalid Refresh token",
    });
  }

  const accessToken = generateAccessToken();

  const decodedAccessToken = jwt.decode(accessToken, { complete: true });

  if (!decodedAccessToken) {
    return res.status(401).json({
      message: "Invalid Access token",
    });
  }

  res.cookie("session", refreshToken, {
    httpOnly: true,
    maxAge: Number(maxAge),
  });

  res.json({
    jwtToken: accessToken,
    jwtExpiryDate: decodedAccessToken.payload.exp,
  });
});

// app.use(authMiddleware);

app.post("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
