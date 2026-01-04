import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 5, // max 5 OTP requests
  message: "Too many OTP requests, try later",
});

export default otpLimiter;