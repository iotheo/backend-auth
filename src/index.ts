import express, { Request, Response } from "express";
const logger = require("./log/config");
import jwt from "jsonwebtoken";

const app = express();
const PORT = 8000;

// will be moved to the env variable
const maxAge = 60 * 60 * 24 * 365;

function generateRefreshToken(): string {
  return "magic-value";
}

function generateAccessToken(): string {
  return "magic-magic-value";
}

app.use(logger.successHandler);
app.use(logger.errorHandler);

app.post("/login", async (req: Request, res: Response) => {
  res.cookie("session", generateRefreshToken(), {
    httpOnly: true,
    maxAge: maxAge,
  });

  const token: string = await jwt.sign(
    {
      user: "john",
    },
    "secret-not-safe-at-all",
    {
      algorithm: "HS512",
      expiresIn: maxAge,
    }
  );

  const decodedToken = await jwt.decode(token, { complete: true });

  if (!decodedToken) {
    return res.status(422).json({
      message: "Invalid JWT token",
    });
  }

  res.json({
    jwtToken: decodedToken,
    jwtExpiryDate: decodedToken.payload.exp,
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
