import { registerFishingMethod, getAllFishingMethods, updateFishingMethodService, deleteFishingMethodService} from "./fishing_methods_service.js";


export async function createFishingMethodController(req, res) {
    try {
        // Merge multipart form fields with optional JSON `data` field.
        let payload = {};
        const body = req.body || {};
        // start with top-level fields (typical for form-data)
        payload = { ...body };
        if (body && typeof body.data === 'string') {
            try {
                const parsed = JSON.parse(body.data);
                payload = { ...payload, ...parsed };
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON in data field' });
            }
        } else if (body && typeof body.data === 'object' && body.data !== null) {
            payload = { ...payload, ...body.data };
        }
        // remove `data` wrapper if present
        if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) delete payload.data;

        // Validate required fields
        let method_name = (payload && (payload.method_name ?? payload.methodName ?? payload.name)) || null;
        let method_code = (payload && (payload.method_code ?? payload.methodCode ?? payload.code)) || null;
        // If nested under `method` object
        if ((!method_name || !method_code) && payload && typeof payload.method === 'object') {
            method_name = method_name || payload.method.method_name || payload.method.methodName || payload.method.name || null;
            method_code = method_code || payload.method.method_code || payload.method.methodCode || payload.method.code || null;
        }
        // Trim strings
        if (typeof method_name === 'string') method_name = method_name.trim();
        if (typeof method_code === 'string') method_code = method_code.trim();
        if (!method_name || !method_code) {
            return res.status(400).json({ error: 'method_name and method_code are required and must be non-empty strings' });
        }

        const imageFile = req.file;
        const fishingMethod = await registerFishingMethod(payload, imageFile);
        const response = fishingMethod.map((item, index) => ({ idx: index, ...item }));
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function getAllFishingMethodsController(req, res) {
    try {
        const fishingMethods = await getAllFishingMethods();
        res.json(fishingMethods);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function updateFishingMethodController(req, res) {
    try {
        const { id } = req.params;
        const payload = req.body;
        const imageFile = req.file;
        const updatedMethod = await updateFishingMethodService(id, payload, imageFile);
        if (updatedMethod.length === 0) {
            return res.status(404).json({ error: 'Fishing method not found' });
        }
        res.json(updatedMethod[0]);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function deleteFishingMethodController(req, res) {
    try {
        const { id } = req.params;
        await deleteFishingMethodService(id);
        res.json({ message: 'Fishing method deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


