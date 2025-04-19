import { Router } from 'express';
import { ProtocolServiceController } from '../controllers/ProtocolServiceController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: ProtocolServices
 *   description: Protokol hizmet/test işlemleri
 */

/**
 * @swagger
 * /protocol-services:
 *   get:
 *     summary: Tüm protokol hizmetlerini getir
 *     tags: [ProtocolServices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protokol hizmet listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProtocolService'
 *             example:
 *               - id: 1
 *                 protocol_id: 1
 *                 service_id: 2
 *                 quantity: 1
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ProtocolServiceController.getAll));

/**
 * @swagger
 * /protocol-services:
 *   post:
 *     summary: Yeni protokol hizmeti oluştur
 *     tags: [ProtocolServices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProtocolService'
 *           example:
 *             protocol_id: 1
 *             service_id: 2
 *             quantity: 1
 *     responses:
 *       201:
 *         description: Protokol hizmeti oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProtocolService'
 *             example:
 *               id: 1
 *               protocol_id: 1
 *               service_id: 2
 *               quantity: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ProtocolServiceController.create));

export default router;
