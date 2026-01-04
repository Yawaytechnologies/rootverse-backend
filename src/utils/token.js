import crypto from "crypto";

function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}
