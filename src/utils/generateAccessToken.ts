import jwt from "jsonwebtoken";

function generateAccessToken(): string {
  const authSecret = process.env.AUTHENTICATION_SECRET!;
  const expiry = process.env.ACCESS_TOKEN_MAX_AGE!;

  const accessToken: string = jwt.sign({}, authSecret, {
    algorithm: "HS512",
    expiresIn: expiry,
  });

  return accessToken;
}

export default generateAccessToken;
