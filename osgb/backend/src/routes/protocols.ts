import { Router } from 'express';
import { ProtocolController } from '../controllers/ProtocolController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Protocols
 *   description: Protokol işlemleri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Protocol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         protocol_number:
 *           type: string
 *         patient_id:
 *           type: integer
 *         examination_type_id:
 *           type: integer
 *         company_id:
 *           type: integer
 *         protocol_date:
 *           type: string
 *           format: date-time
 *         receipt_number:
 *           type: string
 *         ledger_number:
 *           type: string
 *         total_amount:
 *           type: number
 *           format: float
 *         discount_amount:
 *           type: number
 *           format: float
 *         paid_amount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *         created_by:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 10
 *         protocol_number: "PR-2025001"
 *         patient_id: 1
 *         examination_type_id: 2
 *         company_id: 1
 *         protocol_date: "2025-04-19T18:00:00.000Z"
 *         receipt_number: "RCPT-1001"
 *         ledger_number: "LDG-2001"
 *         total_amount: 1200.00
 *         discount_amount: 100.00
 *         paid_amount: 1100.00
 *         status: "completed"
 *         created_by: 1
 *         created_at: "2025-04-19T18:00:00.000Z"
 *         updated_at: "2025-04-19T18:30:00.000Z"
 */

/**
 * @swagger
 * /protocols:
 *   get:
 *     summary: Tüm protokolleri getir
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protokol listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Protocol'
 *             example:
 *               - id: 10
 *                 protocol_number: "PR-2025001"
 *                 patient_id: 1
 *                 examination_type_id: 2
 *                 company_id: 1
 *                 protocol_date: "2025-04-19T18:00:00.000Z"
 *                 receipt_number: "RCPT-1001"
 *                 ledger_number: "LDG-2001"
 *                 total_amount: 1200.00
 *                 discount_amount: 100.00
 *                 paid_amount: 1100.00
 *                 status: "completed"
 *                 created_by: 1
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ProtocolController.getAll));

/**
 * @swagger
 * /protocols/{id}:
 *   get:
 *     summary: Protokol detayı getir
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     responses:
 *       200:
 *         description: Protokol detayı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *             example:
 *               id: 10
 *               protocol_number: "PR-2025001"
 *               patient_id: 1
 *               examination_type_id: 2
 *               company_id: 1
 *               protocol_date: "2025-04-19T18:00:00.000Z"
 *               receipt_number: "RCPT-1001"
 *               ledger_number: "LDG-2001"
 *               total_amount: 1200.00
 *               discount_amount: 100.00
 *               paid_amount: 1100.00
 *               status: "completed"
 *               created_by: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/:id', asyncHandler(ProtocolController.getById));

/**
 * @swagger
 * /protocols:
 *   post:
 *     summary: Yeni protokol oluştur
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Protocol'
 *           example:
 *             protocol_number: "PR-2025001"
 *             patient_id: 1
 *             examination_type_id: 2
 *             company_id: 1
 *             protocol_date: "2025-04-19T18:00:00.000Z"
 *             receipt_number: "RCPT-1001"
 *             ledger_number: "LDG-2001"
 *             total_amount: 1200.00
 *             discount_amount: 100.00
 *             paid_amount: 1100.00
 *             status: "completed"
 *             created_by: 1
 *     responses:
 *       201:
 *         description: Protokol oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *             example:
 *               id: 10
 *               protocol_number: "PR-2025001"
 *               patient_id: 1
 *               examination_type_id: 2
 *               company_id: 1
 *               protocol_date: "2025-04-19T18:00:00.000Z"
 *               receipt_number: "RCPT-1001"
 *               ledger_number: "LDG-2001"
 *               total_amount: 1200.00
 *               discount_amount: 100.00
 *               paid_amount: 1100.00
 *               status: "completed"
 *               created_by: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ProtocolController.create));

/**
 * @swagger
 * /protocols/{id}:
 *   put:
 *     summary: Protokolü güncelle
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Protocol'
 *           example:
 *             total_amount: 1200.00
 *             discount_amount: 100.00
 *             paid_amount: 1100.00
 *             status: "completed"
 *     responses:
 *       200:
 *         description: Protokol güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *             example:
 *               id: 10
 *               total_amount: 1200.00
 *               discount_amount: 100.00
 *               paid_amount: 1100.00
 *               status: "completed"
 *               updated_at: "2025-04-19T19:00:00.000Z"
 */
router.put('/:id', asyncHandler(ProtocolController.update));

/**
 * @swagger
 * /protocols/{id}:
 *   delete:
 *     summary: Protokolü sil (sadece admin)
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     responses:
 *       204:
 *         description: Protokol silindi
 */
router.delete('/:id', checkRole(['admin']), asyncHandler(ProtocolController.delete));

export default router;
