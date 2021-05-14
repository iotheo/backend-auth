import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.session) {
    return res.status(401).json({
      message: "Unauthorized. Please login",
    });
  }

  const refreshToken: string = req.cookies.session;

  try {
    jwt.verify(refreshToken, process.env.AUTHENTICATION_SECRET!);
  } catch (e) {
    // TODO check error and send corresponding status code
    return res.status(422).json(e);
  }

  const accessToken = req.body.jwt;
  try {
    jwt.verify(accessToken, process.env.AUTHENTICATION_SECRET!);
  } catch (e) {
    // TODO check error and send corresponding status code
    return res.status(422).json(e);
  }

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
