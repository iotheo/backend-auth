import express, { Request, Response } from "express";
const logger = require("./log/config");

const app = express();
const PORT = 8000;

function generateRefreshToken(): string {
  return "magic-value";
}

function generateAccessToken(): string {
  return "magic-magic-value";
}

app.use(logger.successHandler);
app.use(logger.errorHandler);

app.post("/login", (req: Request, res: Response) => {
  res.cookie("session", generateRefreshToken(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });

  res.json({
    jwtToken: generateAccessToken(),
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
