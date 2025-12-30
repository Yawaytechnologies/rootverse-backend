import { reserveQrservice, reserveBulkService, listQrsService} from "./qrs.service.js";

export async function reserveQrsController(req, res) {
    try{
        const {type} = req.body;
        const qr = await reserveQrservice(type||"CRATE");
        res.status(201).json({sucess:true, qr});
    }
    catch(err){
        res.status(400).json({sucess:false, message:err.message});
    }
    
}

export async function reserveBulkController(req, res) {
  try {
    const { type, count } = req.body;
    const qrs = await reserveBulkService(type, count);
    res.status(201).json({ success: true, count: qrs.length, qrs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function listQrsController(req, res) {
  try {
    const { type, status, page, limit } = req.query;
    const data = await listQrsService({ type, status, page, limit });
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}