import { Router } from 'express';
import { ExternalLabController } from '../controllers/ExternalLabController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: ExternalLabs
 *   description: Dış laboratuvar işlemleri
 */

/**
 * @swagger
 * /external-labs:
 *   get:
 *     summary: Tüm dış laboratuvarları getir
 *     tags: [ExternalLabs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dış laboratuvar listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExternalLab'
 *             example:
 *               - id: 1
 *                 name: "Acme Lab"
 *                 description: "Dış laboratuvar açıklaması"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ExternalLabController.getAll));

/**
 * @swagger
 * /external-labs:
 *   post:
 *     summary: Yeni dış laboratuvar oluştur
 *     tags: [ExternalLabs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExternalLab'
 *           example:
 *             name: "Acme Lab"
 *             description: "Dış laboratuvar açıklaması"
 *     responses:
 *       201:
 *         description: Dış laboratuvar oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExternalLab'
 *             example:
 *               id: 1
 *               name: "Acme Lab"
 *               description: "Dış laboratuvar açıklaması"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ExternalLabController.create));

export default router;
