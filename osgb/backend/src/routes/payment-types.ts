import { Router } from 'express';
import { PaymentTypeController } from '../controllers/PaymentTypeController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: PaymentTypes
 *   description: Ödeme tipi işlemleri
 */

/**
 * @swagger
 * /payment-types:
 *   get:
 *     summary: Tüm ödeme tiplerini getir
 *     tags: [PaymentTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentType'
 *             example:
 *               - id: 1
 *                 name: "Nakit"
 *                 description: "Nakit ödeme"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(PaymentTypeController.getAll));

/**
 * @swagger
 * /payment-types:
 *   post:
 *     summary: Yeni ödeme tipi oluştur
 *     tags: [PaymentTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentType'
 *           example:
 *             name: "Nakit"
 *             description: "Nakit ödeme"
 *     responses:
 *       201:
 *         description: Ödeme tipi oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 *             example:
 *               id: 1
 *               name: "Nakit"
 *               description: "Nakit ödeme"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(PaymentTypeController.create));

export default router;
