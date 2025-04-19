import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & User Management
 */

/**
 * @swagger
 * /auth/init-admin:
 *   post:
 *     summary: Sisteme ilk admin kullanıcısı oluştur (tek seferlik, güvenlik için sonra kaldırılmalı)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin kullanıcı oluşturuldu
 *       400:
 *         description: Eksik bilgi veya zaten admin var
 */
router.post('/init-admin', asyncHandler(AuthController.initAdmin));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarılı giriş
 *       401:
 *         description: Hatalı kimlik bilgisi
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı (sadece admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 *       403:
 *         description: Yetkisiz
 */
router.post('/register', authMiddleware, checkRole(['admin']), asyncHandler(AuthController.register));

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Kullanıcı profil bilgisi (giriş gerekli)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgisi
 *       401:
 *         description: Kimlik doğrulama gerekli
 */
router.get('/profile', authMiddleware, asyncHandler(AuthController.getProfile));

export default router;
