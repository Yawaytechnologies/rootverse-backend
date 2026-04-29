import { uploadAquacultureImageService, getAquaculturebyCultureCycleIdService } from "./imageUpload_service.js";


export async function uploadAquacultureImageController(req, res) {
    try {
        const { cultureCycleId } = req.params;
        const { description } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const result = await uploadAquacultureImageService(cultureCycleId, file, description);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
}

export async function getAquacultureImagesController(req, res) {
    try {
        const { cultureCycleId } = req.params;
        const images = await getAquaculturebyCultureCycleIdService(cultureCycleId);
        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
}
