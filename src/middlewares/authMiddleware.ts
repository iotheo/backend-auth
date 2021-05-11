import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.session) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  const sessionToken: string = req.cookies.session;

  // const isVerifiedToken = jwt.verify(sessionToken);
}

export default authMiddleware;
