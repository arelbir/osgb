import { Router } from 'express';
import { ExternalLabSubmissionController } from '../controllers/ExternalLabSubmissionController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: ExternalLabSubmissions
 *   description: Dış laboratuvar başvurusu işlemleri
 */

/**
 * @swagger
 * /external-lab-submissions:
 *   get:
 *     summary: Tüm dış laboratuvar başvurularını getir
 *     tags: [ExternalLabSubmissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dış laboratuvar başvurusu listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExternalLabSubmission'
 *             example:
 *               - id: 1
 *                 external_lab_id: 1
 *                 protocol_id: 2
 *                 status: "Beklemede"
 *                 result_url: "https://lab.com/sonuc/123"
 *                 sent_at: "2025-04-19T18:00:00.000Z"
 *                 received_at: "2025-04-19T18:30:00.000Z"
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(ExternalLabSubmissionController.getAll));

/**
 * @swagger
 * /external-lab-submissions:
 *   post:
 *     summary: Yeni dış laboratuvar başvurusu oluştur
 *     tags: [ExternalLabSubmissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExternalLabSubmission'
 *           example:
 *             external_lab_id: 1
 *             protocol_id: 2
 *             status: "Beklemede"
 *             result_url: "https://lab.com/sonuc/123"
 *             sent_at: "2025-04-19T18:00:00.000Z"
 *             received_at: "2025-04-19T18:30:00.000Z"
 *     responses:
 *       201:
 *         description: Dış laboratuvar başvurusu oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExternalLabSubmission'
 *             example:
 *               id: 1
 *               external_lab_id: 1
 *               protocol_id: 2
 *               status: "Beklemede"
 *               result_url: "https://lab.com/sonuc/123"
 *               sent_at: "2025-04-19T18:00:00.000Z"
 *               received_at: "2025-04-19T18:30:00.000Z"
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(ExternalLabSubmissionController.create));

export default router;
