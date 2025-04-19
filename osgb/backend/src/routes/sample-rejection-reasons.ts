import { Router } from 'express';
import { SampleRejectionReasonController } from '../controllers/SampleRejectionReasonController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: SampleRejectionReasons
 *   description: Numune reddetme nedeni işlemleri
 */

/**
 * @swagger
 * /sample-rejection-reasons:
 *   get:
 *     summary: Tüm reddetme nedenlerini getir
 *     tags: [SampleRejectionReasons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reddetme nedeni listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SampleRejectionReason'
 *             example:
 *               - id: 1
 *                 name: "Numune uygun değil"
 *                 description: "Numune bütünlüğü bozulmuş"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(SampleRejectionReasonController.getAll));

/**
 * @swagger
 * /sample-rejection-reasons:
 *   post:
 *     summary: Yeni reddetme nedeni oluştur
 *     tags: [SampleRejectionReasons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SampleRejectionReason'
 *           example:
 *             name: "Numune uygun değil"
 *             description: "Numune bütünlüğü bozulmuş"
 *     responses:
 *       201:
 *         description: Reddetme nedeni oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SampleRejectionReason'
 *             example:
 *               id: 1
 *               name: "Numune uygun değil"
 *               description: "Numune bütünlüğü bozulmuş"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(SampleRejectionReasonController.create));

export default router;
