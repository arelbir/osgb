import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Firma işlemleri ve birimleri
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Tüm firmaları getir
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Firma listesi
 */
router.get('/', asyncHandler(CompanyController.getAll));

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Firma detayı getir
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Firma ID
 *     responses:
 *       200:
 *         description: Firma detayı
 */
router.get('/:id', asyncHandler(CompanyController.getById));

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Yeni firma oluştur
 *     tags: [Companies]
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
 *         description: Firma oluşturuldu
 */
router.post('/', asyncHandler(CompanyController.create));

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Firmayı güncelle
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Firma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Firma güncellendi
 */
router.put('/:id', asyncHandler(CompanyController.update));

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Firmayı sil (sadece admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Firma ID
 *     responses:
 *       204:
 *         description: Firma silindi
 */
router.delete('/:id', checkRole(['admin']), asyncHandler(CompanyController.delete));

/**
 * @swagger
 * /companies/{companyId}/units:
 *   get:
 *     summary: Firmanın birimlerini getir
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Firma ID
 *     responses:
 *       200:
 *         description: Firma birimleri listesi
 */
router.get('/:companyId/units', asyncHandler(CompanyController.getCompanyUnits));

/**
 * @swagger
 * /companies/{companyId}/units:
 *   post:
 *     summary: Firmaya birim ekle
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Firma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Birim oluşturuldu
 */
router.post('/:companyId/units', asyncHandler(CompanyController.createCompanyUnit));

export default router;
