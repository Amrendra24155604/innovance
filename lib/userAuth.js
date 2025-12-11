import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signUserToken(payload = {}) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
  const expiresIn = Number(EXPIRES_IN) || EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyUserToken(token) {
  if (!token) return null;
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
