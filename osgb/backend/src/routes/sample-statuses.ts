import { Router } from 'express';
import { SampleStatusController } from '../controllers/SampleStatusController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: SampleStatuses
 *   description: Numune durumu işlemleri
 */

/**
 * @swagger
 * /sample-statuses:
 *   get:
 *     summary: Tüm numune durumlarını getir
 *     tags: [SampleStatuses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Numune durumu listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SampleStatus'
 *             example:
 *               - id: 1
 *                 name: "Beklemede"
 *                 description: "Numune henüz işleme alınmadı"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(SampleStatusController.getAll));

/**
 * @swagger
 * /sample-statuses:
 *   post:
 *     summary: Yeni numune durumu oluştur
 *     tags: [SampleStatuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SampleStatus'
 *           example:
 *             name: "Beklemede"
 *             description: "Numune henüz işleme alınmadı"
 *     responses:
 *       201:
 *         description: Numune durumu oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SampleStatus'
 *             example:
 *               id: 1
 *               name: "Beklemede"
 *               description: "Numune henüz işleme alınmadı"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(SampleStatusController.create));

export default router;
