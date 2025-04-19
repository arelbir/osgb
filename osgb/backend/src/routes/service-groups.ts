import { Router } from 'express';
import { ServiceGroupController } from '../controllers/ServiceGroupController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: ServiceGroups
 *   description: Hizmet grubu işlemleri
 */

/**
 * @swagger
 * /service-groups:
 *   get:
 *     summary: Tüm hizmet gruplarını getir
 *     tags: [ServiceGroups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hizmet grubu listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceGroup'
 *             example:
 *               - id: 1
 *                 name: "Laboratuvar Testleri"
 *                 description: "Kan, idrar vb. laboratuvar testleri"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ServiceGroupController.getAll));

/**
 * @swagger
 * /service-groups:
 *   post:
 *     summary: Yeni hizmet grubu oluştur
 *     tags: [ServiceGroups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceGroup'
 *           example:
 *             name: "Laboratuvar Testleri"
 *             description: "Kan, idrar vb. laboratuvar testleri"
 *     responses:
 *       201:
 *         description: Hizmet grubu oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceGroup'
 *             example:
 *               id: 1
 *               name: "Laboratuvar Testleri"
 *               description: "Kan, idrar vb. laboratuvar testleri"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ServiceGroupController.create));

export default router;
