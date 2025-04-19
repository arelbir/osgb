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
 *           example:
 *             username: "admin"
 *             password: "Admin123!"
 *             full_name: "Admin Kullanıcı"
 *             email: "admin@arel.com"
 *     responses:
 *       201:
 *         description: Admin kullanıcı oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *             example:
 *               id: 1
 *               username: "admin"
 *               full_name: "Admin Kullanıcı"
 *               email: "admin@arel.com"
 *               role: "admin"
 *       400:
 *         description: Eksik bilgi veya zaten admin var
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Sistemde zaten kullanıcı var. Bu endpoint sadece ilk kullanıcı için kullanılabilir."
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
 *           example:
 *             username: "admin"
 *             password: "Admin123!"
 *     responses:
 *       200:
 *         description: Giriş başarılı, token döner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *             example:
 *               user:
 *                 id: 1
 *                 username: "admin"
 *                 full_name: "Admin Kullanıcı"
 *                 role: "admin"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Kullanıcı adı veya şifre eksik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Username and password are required"
 *       401:
 *         description: Hatalı kullanıcı adı veya şifre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Invalid credentials"
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
