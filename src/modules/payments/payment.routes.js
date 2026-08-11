import express from "express";
import { requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  completeHarvestController, createPaymentController, createProcurementController, getReceiptController,
  getReceiptHtmlController, listProcurementsController, listReceiptsController, verifyReceiptController,
} from "./payment.controller.js";

const router = express.Router();
const TRADER = requireRole("TRADER_ADMIN", "ADMIN", "SUPER_ADMIN");
const RECEIPT_ACCESS = requireRole("TRADER_ADMIN", "OWNER", "ADMIN", "SUPER_ADMIN");

/**
 * @swagger
 * components:
 *   schemas:
 *     OfflineHarvestCompletionRequest:
 *       type: object
 *       required: [actual_harvest_weight_kg]
 *       properties:
 *         actual_harvest_weight_kg:
 *           type: number
 *           format: double
 *           minimum: 0.001
 *           example: 2782.5
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Defaults to the current server time.
 *           example: 2026-08-16T10:48:00.000Z
 *         trader_id:
 *           type: integer
 *           description: Required for ADMIN/SUPER_ADMIN; ignored for TRADER_ADMIN.
 *           example: 8
 *     OfflineProcurementRequest:
 *       type: object
 *       required: [harvest_id, rate_per_kg]
 *       properties:
 *         harvest_id:
 *           type: integer
 *           example: 123
 *         rate_per_kg:
 *           type: number
 *           format: double
 *           minimum: 0.01
 *           example: 250
 *         adjustment_amount:
 *           type: number
 *           format: double
 *           default: 0
 *           example: 0
 *         tax_amount:
 *           type: number
 *           format: double
 *           default: 0
 *           example: 0
 *         procurement_date:
 *           type: string
 *           format: date-time
 *         payment_terms:
 *           type: string
 *           example: Balance within 30 days
 *         trader_gstin:
 *           type: string
 *           example: 33AAHFA1234A1Z6
 *         authorized_signatory:
 *           type: string
 *           example: Accounts Manager
 *         producer_email:
 *           type: string
 *           format: email
 *           description: Optional snapshot fallback when the farmer profile has no email.
 *         trader_id:
 *           type: integer
 *           description: Required for ADMIN/SUPER_ADMIN; ignored for TRADER_ADMIN.
 *     OfflinePaymentRequest:
 *       type: object
 *       required: [amount, payment_mode]
 *       properties:
 *         amount:
 *           type: number
 *           format: double
 *           minimum: 0.01
 *           example: 75000
 *         payment_mode:
 *           type: string
 *           enum: [NEFT, RTGS, IMPS, UPI, CHEQUE, CASH, OTHER]
 *           example: RTGS
 *         bank_reference:
 *           type: string
 *           description: Manual UTR, transaction, cheque, or other offline reference. Must be unique for the trader when supplied.
 *           example: HDFC26081615873294
 *         bank_name:
 *           type: string
 *           example: HDFC Bank
 *         account_holder_name:
 *           type: string
 *           example: Sakthivel
 *         paid_at:
 *           type: string
 *           format: date-time
 *           description: Defaults to the current server time.
 *           example: 2026-08-16T16:18:00.000Z
 *         remarks:
 *           type: string
 *           example: Payment against completed harvest procurement
 *         idempotency_key:
 *           type: string
 *           description: Body fallback for the preferred Idempotency-Key header.
 *         trader_id:
 *           type: integer
 *           description: Required for ADMIN/SUPER_ADMIN; ignored for TRADER_ADMIN.
 *     OfflinePayment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         payment_no:
 *           type: string
 *           example: PAY-26-000231
 *         procurement_id:
 *           type: integer
 *         amount:
 *           type: string
 *           example: "75000.00"
 *         payment_mode:
 *           type: string
 *           example: RTGS
 *         bank_reference:
 *           type: string
 *         bank_name:
 *           type: string
 *         account_holder_name:
 *           type: string
 *         paid_at:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [CONFIRMED]
 *         remarks:
 *           type: string
 *     OfflineProcurement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         procurement_no:
 *           type: string
 *           example: PROC-26-00124
 *         harvest_id:
 *           type: integer
 *         trader_id:
 *           type: integer
 *         producer_user_id:
 *           type: integer
 *         procurement_date:
 *           type: string
 *           format: date-time
 *         actual_weight_kg:
 *           type: string
 *           example: "2782.500"
 *         rate_per_kg:
 *           type: string
 *           example: "250.00"
 *         gross_amount:
 *           type: string
 *           example: "695625.00"
 *         adjustment_amount:
 *           type: string
 *         tax_amount:
 *           type: string
 *         total_value:
 *           type: string
 *           example: "695625.00"
 *         currency:
 *           type: string
 *           example: INR
 *         status:
 *           type: string
 *           enum: [CONFIRMED, PARTIALLY_PAID, PAID]
 *         total_paid:
 *           type: number
 *           example: 450625
 *         outstanding_balance:
 *           type: number
 *           example: 245000
 *         payments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OfflinePayment'
 *     OfflinePaymentReceipt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         receipt_no:
 *           type: string
 *           example: PAY/PR/26-27/000231
 *         payment_id:
 *           type: integer
 *         procurement_id:
 *           type: integer
 *         verification_token:
 *           type: string
 *           description: Public verification token; treat it as an opaque value.
 *         generated_at:
 *           type: string
 *           format: date-time
 *         snapshot:
 *           type: object
 *           description: Immutable receipt data used by the print template, including trader, producer, payment history, paid totals, and outstanding balance.
 *     OfflinePaymentCreationResult:
 *       type: object
 *       properties:
 *         payment:
 *           $ref: '#/components/schemas/OfflinePayment'
 *         receipt:
 *           $ref: '#/components/schemas/OfflinePaymentReceipt'
 *         idempotent_replay:
 *           type: boolean
 *     OfflineReceiptVerification:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           example: true
 *         receipt_no:
 *           type: string
 *         procurement_no:
 *           type: string
 *         trader_name:
 *           type: string
 *         producer_name:
 *           type: string
 *         amount:
 *           type: string
 *         payment_date:
 *           type: string
 *           format: date-time
 *         payment_mode:
 *           type: string
 *         bank_reference:
 *           type: string
 *         outstanding_balance:
 *           type: number
 */

/**
 * @swagger
 * /api/payment-receipts/verify/{token}:
 *   get:
 *     summary: Verify an offline payment receipt
 *     description: Public endpoint used by the receipt verification link. It does not initiate or verify a bank transfer.
 *     tags: [Offline Payment Receipts]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receipt exists and its stored payment details are returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/OfflineReceiptVerification'
 *       404:
 *         description: Receipt token not found.
 */

/**
 * @swagger
 * /api/payment-receipts/harvests/{harvestId}/complete:
 *   post:
 *     summary: Mark a booked harvest as completed
 *     description: Records the actual harvest weight and makes the harvest eligible for procurement. No online payment is performed.
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: harvestId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfflineHarvestCompletionRequest'
 *     responses:
 *       200:
 *         description: Harvest completed, or the already-completed harvest returned idempotently.
 *       400:
 *         description: Invalid identifier, weight, or date.
 *       403:
 *         description: Harvest is assigned to another trader.
 *       404:
 *         description: Harvest not found.
 *       422:
 *         description: Harvest has not been booked.
 */

/**
 * @swagger
 * /api/payment-receipts/procurements:
 *   post:
 *     summary: Create a procurement for a completed harvest
 *     description: Calculates the procurement value from actual weight and rate. Repeating the request for the same harvest returns the existing procurement.
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfflineProcurementRequest'
 *     responses:
 *       201:
 *         description: Procurement created or existing procurement returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/OfflineProcurement'
 *       403:
 *         description: Harvest is assigned to another trader.
 *       404:
 *         description: Harvest not found.
 *       422:
 *         description: Harvest is not completed or producer data is missing.
 *   get:
 *     summary: List accessible procurements and payment progress
 *     description: TRADER_ADMIN sees its procurements; OWNER sees procurements payable to that producer; admins may optionally filter by trader_id.
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         schema:
 *           type: integer
 *         description: Optional admin filter; ignored for trader and owner roles.
 *     responses:
 *       200:
 *         description: Procurement list with confirmed payment history and outstanding balances.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OfflineProcurement'
 */

/**
 * @swagger
 * /api/payment-receipts/procurements/{procurementId}/payments:
 *   post:
 *     summary: Record a completed offline/manual payment and generate its receipt
 *     description: Records a transfer made outside RootVerse. The API locks the procurement, prevents overpayment, updates payment progress, and creates one immutable receipt. It does not contact a payment gateway.
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: procurementId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Idempotency-Key
 *         required: false
 *         description: Strongly recommended unique key preventing duplicate payment submission.
 *         schema:
 *           type: string
 *           example: 6b684065-8148-45c8-a293-a728446cc9a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfflinePaymentRequest'
 *     responses:
 *       201:
 *         description: Offline payment recorded and receipt generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/OfflinePaymentCreationResult'
 *       403:
 *         description: Procurement belongs to another trader.
 *       404:
 *         description: Procurement not found.
 *       409:
 *         description: Payment exceeds the outstanding balance or a bank reference conflicts.
 *       422:
 *         description: Procurement does not currently accept payments.
 */

/**
 * @swagger
 * /api/payment-receipts/receipts:
 *   get:
 *     summary: List accessible payment receipts
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         schema:
 *           type: integer
 *         description: Optional admin filter; ignored for trader and owner roles.
 *     responses:
 *       200:
 *         description: Receipt list scoped to the authenticated trader or producer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OfflinePaymentReceipt'
 */

/**
 * @swagger
 * /api/payment-receipts/receipts/{receiptId}:
 *   get:
 *     summary: Get an offline payment receipt
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiptId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receipt with its immutable render snapshot.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/OfflinePaymentReceipt'
 *       404:
 *         description: Receipt does not exist or is outside the authenticated user's scope.
 */

/**
 * @swagger
 * /api/payment-receipts/receipts/{receiptId}/print:
 *   get:
 *     summary: Render the OneBlue printable payment receipt
 *     description: Returns print-ready HTML modelled on the supplied OneBlue payment-receipt image. Use the browser Print / Save as PDF action. This is not a payment-gateway receipt.
 *     tags: [Offline Payment Receipts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiptId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Printable payment receipt HTML.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Receipt does not exist or is outside the authenticated user's scope.
 */

router.get("/verify/:token", verifyReceiptController);
router.post("/harvests/:harvestId/complete", TRADER, completeHarvestController);
router.post("/procurements", TRADER, createProcurementController);
router.get("/procurements", RECEIPT_ACCESS, listProcurementsController);
router.post("/procurements/:procurementId/payments", TRADER, createPaymentController);
router.get("/receipts", RECEIPT_ACCESS, listReceiptsController);
router.get("/receipts/:receiptId", RECEIPT_ACCESS, getReceiptController);
router.get("/receipts/:receiptId/print", RECEIPT_ACCESS, getReceiptHtmlController);

export default router;
