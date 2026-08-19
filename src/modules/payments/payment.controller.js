import * as service from "./payment.service.js";
import { renderReceiptHtml } from "./receipt-template.js";
import { renderProcurementReceiptHtml } from "./procurement-receipt-template.js";

const respondError = (res, error) => res.status(error.statusCode || 400).json({
  success: false,
  error: error.message,
  ...(error.details ? { data: error.details } : {}),
});

export const completeHarvestController = async (req, res) => { try { res.json({ success: true, data: await service.completeHarvest(req.params.harvestId, req.body, req.user) }); } catch (e) { respondError(res, e); } };
export const getHarvestCompletionProgressController = async (req, res) => { try { res.json({ success: true, data: await service.getHarvestCompletionProgress(req.params.harvestId, req.query.trader_id, req.user) }); } catch (e) { respondError(res, e); } };
export const createProcurementController = async (req, res) => { try { res.status(201).json({ success: true, data: await service.createProcurement(req.body, req.user) }); } catch (e) { respondError(res, e); } };
export const getProcurementController = async (req, res) => { try { res.json({ success: true, data: await service.getProcurement(req.params.procurementId, req.user) }); } catch (e) { respondError(res, e); } };
export const getProcurementReceiptHtmlController = async (req, res) => { try { const procurement = await service.getProcurement(req.params.procurementId, req.user); res.type("html").send(renderProcurementReceiptHtml(procurement, `${req.protocol}://${req.get("host")}`)); } catch (e) { respondError(res, e); } };
export const listProcurementsController = async (req, res) => { try { res.json({ success: true, data: await service.listProcurements(req.query, req.user) }); } catch (e) { respondError(res, e); } };
export const createPaymentController = async (req, res) => { try { res.status(201).json({ success: true, data: await service.createPayment(req.params.procurementId, req.body, req.user, req.get("Idempotency-Key")) }); } catch (e) { respondError(res, e); } };
export const listReceiptsController = async (req, res) => { try { res.json({ success: true, data: await service.listReceipts(req.query, req.user) }); } catch (e) { respondError(res, e); } };
export const getReceiptController = async (req, res) => { try { res.json({ success: true, data: await service.getReceipt(req.params.receiptId, req.user) }); } catch (e) { respondError(res, e); } };
export const getReceiptHtmlController = async (req, res) => { try { const receipt = await service.getReceipt(req.params.receiptId, req.user); res.type("html").send(renderReceiptHtml(receipt, `${req.protocol}://${req.get("host")}`)); } catch (e) { respondError(res, e); } };
export const verifyReceiptController = async (req, res) => { try { res.json({ success: true, data: await service.verifyReceipt(req.params.token) }); } catch (e) { respondError(res, e); } };
export const verifyProcurementController = async (req, res) => { try { res.json({ success: true, data: await service.verifyProcurement(req.params.procurementNo) }); } catch (e) { respondError(res, e); } };
