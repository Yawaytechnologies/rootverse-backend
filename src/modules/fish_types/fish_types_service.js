import { createFishTypes, getallfishTypes, getbyfishTypesId, updateFishTypesById, deleteFishTypesById } from "./fish_types_model.js";


export async function createFishTypesService(payload){
    const [fishTypes ]= await createFishTypes(payload);
    return fishTypes

}

export async function getallfishTypesService(){
    const fishtypes = getallfishTypes();
    return fishtypes;
}

export async function getbyfishTypesIdService(id){
    const fishTypes = await getbyfishTypesId(id);
    return fishTypes
}

export async function updateFishTypesByIdService(id, updates){
    const fishTypes = await updateFishTypesById(id, updates);
    return fishTypes
}

export async function deleteFishTypesByIdService(id){
    const fishTypes = await deleteFishTypesById(id);
    return fishTypes
}