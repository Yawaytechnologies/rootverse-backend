import { loginService } from "./auth.service.js";

export const loginController = async (req, res) => {
  try {
    const token = await loginService(req);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
