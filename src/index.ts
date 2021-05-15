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
import { authMiddleware, handleRefreshTokenMiddleware } from "./middlewares";
import { AccessTokenResponse } from "./types";

const logger = require("./log/config");

const app = express();
app.use(cookieParser());

app.use(logger.successHandler);
app.use(logger.errorHandler);
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT!;
const maxAge = process.env.MAX_AGE!;

app.post(
  "/login",
  (
    req: Request<{}, {}, UserCredentials>,
    res: Response<AccessTokenResponse | { message: string }>
  ) => {
    const username = req.body.username;

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

    const refreshToken = generateRefreshToken(username);

    const decodedRefreshToken = jwt.decode(refreshToken);

    if (!decodedRefreshToken) {
      return res.status(401).json({
        message: "Invalid Refresh token",
      });
    }

    const accessToken = generateAccessToken(username);

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
  }
);

app.post(
  "/refresh_token",
  handleRefreshTokenMiddleware,
  (req: Request, res: Response<AccessTokenResponse | { message: string }>) => {
    const refreshToken = req.cookies.session;

    // Not-null assertion is claimed due to the refresh token middleware that is being utilized beforehand
    const decodedRefreshToken = jwt.decode(refreshToken, { complete: true })!;

    const { user } = decodedRefreshToken;

    const accessToken = generateAccessToken(user);

    // TODO error handling
    const decodedAccessToken = jwt.decode(accessToken, { complete: true })!;

    return res.json({
      jwtToken: accessToken,
      jwtExpiryDate: decodedAccessToken.payload.exp,
    });
  }
);

app.use(authMiddleware);

app.post("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
