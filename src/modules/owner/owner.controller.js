import { registerOwner } from "./owner.service.js";

export async function createOwner(req, res) {
    try {
        let payload = req.body;
        if (typeof req.body.data === 'string') {
            payload = JSON.parse(req.body.data);
        }
        const profileImage = req.files ? req.files.find(file => file.fieldname === 'profile_image') : null;
        const owner = await registerOwner(payload, profileImage);
        res.status(201).json(owner);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
