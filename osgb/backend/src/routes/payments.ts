import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Ödeme işlemleri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         protocol_id:
 *           type: integer
 *         payment_date:
 *           type: string
 *           format: date-time
 *         receipt_number:
 *           type: string
 *         cash_register_id:
 *           type: integer
 *         payment_type_id:
 *           type: integer
 *         amount:
 *           type: number
 *           format: float
 *         description:
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
 *         id: 7
 *         protocol_id: 10
 *         payment_date: "2025-04-19T18:00:00.000Z"
 *         receipt_number: "RCPT-2025001"
 *         cash_register_id: 2
 *         payment_type_id: 1
 *         amount: 600.00
 *         description: "Nakit ödeme"
 *         created_by: 1
 *         created_at: "2025-04-19T18:00:00.000Z"
 *         updated_at: "2025-04-19T18:30:00.000Z"
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Tüm ödemeleri getir
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *             example:
 *               - id: 7
 *                 protocol_id: 10
 *                 payment_date: "2025-04-19T18:00:00.000Z"
 *                 receipt_number: "RCPT-2025001"
 *                 cash_register_id: 2
 *                 payment_type_id: 1
 *                 amount: 600.00
 *                 description: "Nakit ödeme"
 *                 created_by: 1
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Ödeme detayı getir
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     responses:
 *       200:
 *         description: Ödeme detayı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *             example:
 *               id: 7
 *               protocol_id: 10
 *               payment_date: "2025-04-19T18:00:00.000Z"
 *               receipt_number: "RCPT-2025001"
 *               cash_register_id: 2
 *               payment_type_id: 1
 *               amount: 600.00
 *               description: "Nakit ödeme"
 *               created_by: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Yeni ödeme oluştur
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *           example:
 *             protocol_id: 10
 *             payment_date: "2025-04-19T18:00:00.000Z"
 *             receipt_number: "RCPT-2025001"
 *             cash_register_id: 2
 *             payment_type_id: 1
 *             amount: 600.00
 *             description: "Nakit ödeme"
 *             created_by: 1
 *     responses:
 *       201:
 *         description: Ödeme oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *             example:
 *               id: 7
 *               protocol_id: 10
 *               payment_date: "2025-04-19T18:00:00.000Z"
 *               receipt_number: "RCPT-2025001"
 *               cash_register_id: 2
 *               payment_type_id: 1
 *               amount: 600.00
 *               description: "Nakit ödeme"
 *               created_by: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Ödemeyi güncelle
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *           example:
 *             amount: 700.00
 *             description: "Kredi kartı ile ödeme"
 *     responses:
 *       200:
 *         description: Ödeme güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *             example:
 *               id: 7
 *               amount: 700.00
 *               description: "Kredi kartı ile ödeme"
 *               updated_at: "2025-04-19T19:00:00.000Z"
 */

// Get all payments
router.get('/', asyncHandler(PaymentController.getAll));

// Get payment by ID
router.get('/:id', asyncHandler(PaymentController.getById));

// Create new payment
router.post('/', asyncHandler(PaymentController.create));

// Update payment
router.put('/:id', asyncHandler(PaymentController.update));

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Ödemeyi sil (sadece admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     responses:
 *       204:
 *         description: Ödeme silindi
 */
// Delete payment
router.delete('/:id', checkRole(['admin']), asyncHandler(PaymentController.delete));

export default router;
