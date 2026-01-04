import bcrypt from "bcrypt";
import knex from "../db/knex.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOTP(mobileNumber, isResend = false) {
  const existing = await knex("otp_verifications")
    .where({ mobile_number: mobileNumber })
    .first();

  if (existing && isResend) {
    const diff =
      (Date.now() - new Date(existing.last_sent_at).getTime()) / 1000;

    if (diff < 60) {
      throw new Error("Please wait before resending OTP");
    }
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);

  await knex("otp_verifications")
    .where({ mobile_number: mobileNumber })
    .del();

  await knex("otp_verifications").insert({
    mobile_number: mobileNumber,
    otp_hash: otpHash,
    expires_at: knex.raw("NOW() + INTERVAL '5 minutes'"),
    attempts: 0,
    last_sent_at: knex.fn.now(),
  });

  console.log(`OTP for ${mobileNumber}: ${otp}`);
}
