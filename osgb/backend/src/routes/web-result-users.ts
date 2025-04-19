import { Router } from 'express';
import { WebResultUserController } from '../controllers/WebResultUserController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: WebResultUsers
 *   description: Web Sonuç Kullanıcıları işlemleri
 */

/**
 * @swagger
 * /web-result-users:
 *   get:
 *     summary: Tüm web sonuç kullanıcılarını getir
 *     tags: [WebResultUsers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Web sonuç kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WebResultUser'
 *             example:
 *               - id: 1
 *                 username: "webuser1"
 *                 password: "hashed_password"
 *                 patient_id: 2
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:30:00.000Z"
 */
router.get('/', asyncHandler(WebResultUserController.getAll));

/**
 * @swagger
 * /web-result-users:
 *   post:
 *     summary: Yeni web sonuç kullanıcısı oluştur
 *     tags: [WebResultUsers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebResultUser'
 *           example:
 *             username: "webuser1"
 *             password: "hashed_password"
 *             patient_id: 2
 *     responses:
 *       201:
 *         description: Web sonuç kullanıcısı oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebResultUser'
 *             example:
 *               id: 1
 *               username: "webuser1"
 *               password: "hashed_password"
 *               patient_id: 2
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:30:00.000Z"
 */
router.post('/', asyncHandler(WebResultUserController.create));

export default router;
