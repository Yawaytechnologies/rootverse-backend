import { createFishTypesService, getallfishTypesService, getbyfishTypesIdService, updateFishTypesByIdService, deleteFishTypesByIdService } from "./fish_types_service.js";


export async function createFishTypesController(req, res){
    try{
        const payload = req.body;
        const fishTypes = await createFishTypesService(payload);
        res.status(201).json(fishTypes)
    }
    catch(error){
        res.status(400).json({error: error.message
        })
    }
}


export async function  getallfishTypesController(req, res){
    try{
        const fishTypes = await getallfishTypesService()
        res.status(201).json(fishTypes)
    }
    catch (error){
        res.status(400).json({error: error.message})
    }
}


export async function getbyfishTypesIdController(req, res){
    try {
        const {id} = req.params;
        const fishTypes = await getbyfishTypesIdService(id);
        res.status(201).json(fishTypes)
    }
    catch (error){
        res.status(400).json({error:error.message})
    }
}


export async function updateFishTypesByIdController(req, res){
    try{
    const {id} = req.params;
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({error: 'Updates must be a valid object'});
    }
    const fishTypes = await updateFishTypesByIdService(id , updates);
    res.status(201).json(fishTypes)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}


export async function deleteFishTypesByIdController(req , res){
    try{
        const {id}= req.params;
        const fishTypes = await deleteFishTypesByIdService(id);
        res.status(201).json(fishTypes);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}
