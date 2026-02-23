import { createState, getAllStates, getStateById, deleteState, updateState, getStatesByCountryId } from "./state.model.js";

export async function registerState(payload) {
    const state = await createState(payload);
    return state;
}

export async function listStates() {
    const states = await getAllStates();
    return states;
}

export async function getState(id) {
    const state = await getStateById(id);
    return state;
}

export async function modifyState(id, updates) {
    const [state] = await updateState(id, updates);
    return state;
}

export async function removeState(id) {
    await deleteState(id);
    return;
}

export async function listStatesByCountryId(country_id) {
    const states = await getStatesByCountryId(country_id);
    return states;
}
