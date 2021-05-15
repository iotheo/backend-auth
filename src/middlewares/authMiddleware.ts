import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const refreshToken: string = req.cookies.session;
  // Not-null assertion is claimed due to the refresh token middleware that is being utilized beforehand
  const decodedRefreshToken = jwt.decode(refreshToken, { complete: true })!;

  const accessToken = req.body.jwt;
  // Not-null assertion is claimed due to the refresh token middleware that is being utilized beforehand
  const decodedAccessToken = jwt.decode(accessToken, { complete: true })!;

  if (decodedRefreshToken.payload.user !== decodedAccessToken.payload.user) {
    return res.status(401).json({
      message: "Unauthorized. Tokens do not match",
    });
  }

  next();
}

export default authMiddleware;
