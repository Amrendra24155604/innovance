// lib/adminAuth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || "3600";

export function signAdminToken(payload = {}) {
  if (!JWT_SECRET) throw new Error("ADMIN_JWT_SECRET is not set");
  // ensure expiresIn is number or string acceptable by jsonwebtoken
  const expiresIn = Number(EXPIRES_IN) || EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyAdminToken(token) {
  if (!token) return null;
  try {
    if (!JWT_SECRET) throw new Error("ADMIN_JWT_SECRET is not set");
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // invalid token or expired -> return null
    return null;
  }
}
