import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Ödeme işlemleri
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Tüm ödemeleri getir
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme listesi
 */
// Get all payments
router.get('/', asyncHandler(PaymentController.getAll));

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Ödeme detayı getir
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     responses:
 *       200:
 *         description: Ödeme detayı
 */
// Get payment by ID
router.get('/:id', asyncHandler(PaymentController.getById));

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Yeni ödeme oluştur
 *     tags: [Payments]
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
 *         description: Ödeme oluşturuldu
 */
// Create new payment
router.post('/', asyncHandler(PaymentController.create));

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Ödemeyi güncelle
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ödeme güncellendi
 */
// Update payment
router.put('/:id', asyncHandler(PaymentController.update));

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Ödemeyi sil (sadece admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ödeme ID
 *     responses:
 *       204:
 *         description: Ödeme silindi
 */
// Delete payment
router.delete('/:id', checkRole(['admin']), asyncHandler(PaymentController.delete));

export default router;
