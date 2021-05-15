import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { handleRefreshTokenMiddleware, handleAccessTokenMiddleware } from "./";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  handleRefreshTokenMiddleware(req, res, next);

  const refreshToken: string = req.cookies.session;

  handleAccessTokenMiddleware(req, res, next);

  const accessToken = req.body.jwt;

  const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });

  if (!decodedRefreshToken) {
    return res.status(401).json({
      message: "Invalid Access token",
    });
  }

  const decodedAccessToken = jwt.decode(accessToken, { complete: true });

  if (!decodedAccessToken) {
    return res.status(401).json({
      message: "Invalid Access token",
    });
  }

  if (decodedRefreshToken.payload.user !== decodedAccessToken.payload.user) {
    return res.status(401).json({
      message: "Unauthorized. Tokens do not match",
    });
  }

  next();
}

export default authMiddleware;
