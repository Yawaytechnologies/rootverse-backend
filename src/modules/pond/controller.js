import * as services from './service.js';

export const registerPond = async (req, res) => {
    try {
        const pond = await services.createPond(req.body, req.file);
        res.status(201).json(pond);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getPondById = async (req, res) => {
    try {
        const pond = await services.getPondById(req.params.id);
        res.status(200).json(pond);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getAllPonds = async (req, res) => {
    try {
        const ponds = await services.getAllPonds(req.query);
        res.status(200).json(ponds);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPondsByCode = async (req, res) => {
    try {
        const pond = await services.getPondsByCode(req.params.code);
        res.status(200).json(pond);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}
export const updatePond = async (req, res) => {
    try {
        const pond = await services.updatePond(req.params.id, req.body);
        res.status(200).json(pond);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletePond = async (req, res) => {
    try {
        await services.deletePond(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

