import * as userService from "./user.service.js";
export const getUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserByIdService(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};