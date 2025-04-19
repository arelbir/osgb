import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Hasta işlemleri
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Tüm hastaları getir
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hasta listesi
 */
router.get('/', asyncHandler(PatientController.getAll));

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Hasta detayı getir
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hasta ID
 *     responses:
 *       200:
 *         description: Hasta detayı
 */
router.get('/:id', asyncHandler(PatientController.getById));

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Yeni hasta oluştur
 *     tags: [Patients]
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
 *         description: Hasta oluşturuldu
 */
router.post('/', asyncHandler(PatientController.create));

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Hastayı güncelle
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hasta ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hasta güncellendi
 */
router.put('/:id', asyncHandler(PatientController.update));

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Hastayı sil (sadece admin)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hasta ID
 *     responses:
 *       204:
 *         description: Hasta silindi
 */
router.delete('/:id', checkRole(['admin']), asyncHandler(PatientController.delete));

export default router;
