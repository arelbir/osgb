import { Router } from 'express';
import { LabResultController } from '../controllers/LabResultController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: LabResults
 *   description: Laboratuvar Sonuçları işlemleri
 */

/**
 * @swagger
 * /lab-results:
 *   get:
 *     summary: Tüm laboratuvar sonuçlarını getir
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sonuç listesi
 */
router.get('/', asyncHandler(LabResultController.getAll));

/**
 * @swagger
 * /lab-results/{id}:
 *   get:
 *     summary: Sonuç detayı getir
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sonuç ID
 *     responses:
 *       200:
 *         description: Sonuç detayı
 */
router.get('/:id', asyncHandler(LabResultController.getById));

/**
 * @swagger
 * /lab-results:
 *   post:
 *     summary: Yeni laboratuvar sonucu oluştur
 *     tags: [LabResults]
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
 *         description: Sonuç oluşturuldu
 */
router.post('/', asyncHandler(LabResultController.create));

/**
 * @swagger
 * /lab-results/{id}:
 *   put:
 *     summary: Sonucu güncelle
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sonuç ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sonuç güncellendi
 */
router.put('/:id', asyncHandler(LabResultController.update));

/**
 * @swagger
 * /lab-results/{id}:
 *   delete:
 *     summary: Sonucu sil (sadece admin)
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sonuç ID
 *     responses:
 *       204:
 *         description: Sonuç silindi
 */
router.delete('/:id', checkRole(['admin']), asyncHandler(LabResultController.delete));

/**
 * @swagger
 * /lab-results/{id}/accept:
 *   post:
 *     summary: Numuneyi kabul et
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sonuç ID
 *     responses:
 *       200:
 *         description: Numune kabul edildi
 */
router.post('/:id/accept', asyncHandler(LabResultController.acceptSample));

/**
 * @swagger
 * /lab-results/{id}/approve:
 *   post:
 *     summary: Sonucu onayla
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sonuç ID
 *     responses:
 *       200:
 *         description: Sonuç onaylandı
 */
router.post('/:id/approve', asyncHandler(LabResultController.approveSample));

export default router;
