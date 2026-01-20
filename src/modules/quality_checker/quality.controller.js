import { createQualityCheckerService, getAllQualityCheckersService, getQualityCheckerByCodeService, updateQualityCheckerByIdService, deleteQualityCheckerByIdService } from "./quality.service.js";


export async function createQualityCheckerController(req, res){
    try{
        const qualityChecker =  await createQualityCheckerService(req.body);
        res.status(201).json(qualityChecker);
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

export async function getAllQualityCheckersController(req, res) {
    try {
        const qualityCheckers = await getAllQualityCheckersService();
        res.json(qualityCheckers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getQualityCheckerByCodeController(req, res) {
    try {
        const qualityChecker = await getQualityCheckerByCodeService(req.params.checker_code);
        if (!qualityChecker) return res.status(404).json({ error: "Not found" });
        res.json(qualityChecker);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function updateQualityCheckerByIdController(req, res){
    try{
    const {id} = req.params;
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({error: 'Updates must be a valid object'});
    }
    const qualityChecker = await updateQualityCheckerByIdService(id , updates);
    res.status(201).json(qualityChecker)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

export async function deleteQualityCheckerByIdController(req , res){
    try{
        const {id}= req.params;
        const qualityChecker = await deleteQualityCheckerByIdService(id);
        res.status(201).json(qualityChecker);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

