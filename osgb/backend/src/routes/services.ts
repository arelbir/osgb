import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Hizmet işlemleri
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Tüm hizmetleri getir
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hizmet listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *             example:
 *               - id: 1
 *                 name: "Hemogram"
 *                 description: "Tam kan sayımı"
 *                 service_group_id: 1
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ServiceController.getAll));

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Yeni hizmet oluştur
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *           example:
 *             name: "Hemogram"
 *             description: "Tam kan sayımı"
 *             service_group_id: 1
 *     responses:
 *       201:
 *         description: Hizmet oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *             example:
 *               id: 1
 *               name: "Hemogram"
 *               description: "Tam kan sayımı"
 *               service_group_id: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ServiceController.create));

export default router;
