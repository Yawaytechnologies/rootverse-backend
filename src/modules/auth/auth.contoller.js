import * as otpService from "./otp.service.js";
import * as authService from "./auth.service.js";

export async function requestOtpController(req, res) {
  try {
    const { mobile_number } = req.body;

    if (!mobile_number) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    await otpService.requestOTP(mobile_number);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function verifyOtpController(req, res) {
  try {
    const { mobile_number, otp } = req.body;

    if (!mobile_number || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP required" });
    }

    await otpService.verifyOTP(mobile_number, otp);

    const result = await authService.loginOrCreateUser(mobile_number);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
