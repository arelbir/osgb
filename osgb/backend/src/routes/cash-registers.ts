import { Router } from 'express';
import { CashRegisterController } from '../controllers/CashRegisterController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: CashRegisters
 *   description: Kasa işlemleri
 */

/**
 * @swagger
 * /cash-registers:
 *   get:
 *     summary: Tüm kasaları getir
 *     tags: [CashRegisters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kasa listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashRegister'
 *             example:
 *               - id: 1
 *                 name: "Ana Kasa"
 *                 description: "Merkez kasa"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(CashRegisterController.getAll));

/**
 * @swagger
 * /cash-registers:
 *   post:
 *     summary: Yeni kasa oluştur
 *     tags: [CashRegisters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashRegister'
 *           example:
 *             name: "Ana Kasa"
 *             description: "Merkez kasa"
 *     responses:
 *       201:
 *         description: Kasa oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashRegister'
 *             example:
 *               id: 1
 *               name: "Ana Kasa"
 *               description: "Merkez kasa"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(CashRegisterController.create));

export default router;
