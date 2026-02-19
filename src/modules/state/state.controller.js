import { registerState, listStates, getState, modifyState, removeState, listStatesByCountryId  } from "./state.service.js";

export async function createStateController(req, res) {
    try {
        const payload = req.body;
        const state = await registerState(payload);
        res.status(201).json(state);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function listStatesController(req, res) {
    try {
        const states = await listStates();
        res.status(200).json(states);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getStateController(req, res) {
    try {
        const { id } = req.params;
        const state = await getState(id);
        res.status(200).json(state);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateStateController(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const state = await modifyState(id, updates);
        res.status(200).json(state);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteStateController(req, res) {
    try {
        const { id } = req.params;
        await removeState(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function listStatesByCountryIdController(req, res) {
    try {
        const { country_id } = req.params;
        const states = await listStatesByCountryId(country_id);
        res.status(200).json(states);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}