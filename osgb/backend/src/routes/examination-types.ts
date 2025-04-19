import { Router } from 'express';
import { ExaminationTypeController } from '../controllers/ExaminationTypeController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: ExaminationTypes
 *   description: Muayene tipi işlemleri
 */

/**
 * @swagger
 * /examination-types:
 *   get:
 *     summary: Tüm muayene tiplerini getir
 *     tags: [ExaminationTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muayene tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExaminationType'
 *             example:
 *               - id: 1
 *                 name: "Hemogram"
 *                 description: "Tam kan sayımı"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ExaminationTypeController.getAll));

/**
 * @swagger
 * /examination-types:
 *   post:
 *     summary: Yeni muayene tipi oluştur
 *     tags: [ExaminationTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExaminationType'
 *           example:
 *             name: "Hemogram"
 *             description: "Tam kan sayımı"
 *     responses:
 *       201:
 *         description: Muayene tipi oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExaminationType'
 *             example:
 *               id: 1
 *               name: "Hemogram"
 *               description: "Tam kan sayımı"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ExaminationTypeController.create));

export default router;
