import { Router } from 'express';
import { ProtocolController } from '../controllers/ProtocolController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Protocols
 *   description: Protokol işlemleri
 */

/**
 * @swagger
 * /protocols:
 *   get:
 *     summary: Tüm protokolleri getir
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protokol listesi
 */
router.get('/', asyncHandler(ProtocolController.getAll));

/**
 * @swagger
 * /protocols/{id}:
 *   get:
 *     summary: Protokol detayı getir
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     responses:
 *       200:
 *         description: Protokol detayı
 */
router.get('/:id', asyncHandler(ProtocolController.getById));

/**
 * @swagger
 * /protocols:
 *   post:
 *     summary: Yeni protokol oluştur
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Protokol oluşturuldu
 */
router.post('/', asyncHandler(ProtocolController.create));

/**
 * @swagger
 * /protocols/{id}:
 *   put:
 *     summary: Protokolü güncelle
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Protokol güncellendi
 */
router.put('/:id', asyncHandler(ProtocolController.update));

/**
 * @swagger
 * /protocols/{id}:
 *   delete:
 *     summary: Protokolü sil (sadece admin)
 *     tags: [Protocols]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Protokol ID
 *     responses:
 *       204:
 *         description: Protokol silindi
 */
router.delete('/:id', checkRole(['admin']), asyncHandler(ProtocolController.delete));

export default router;
