import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function handleRefreshTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

  next();
}

export default handleRefreshTokenMiddleware;
