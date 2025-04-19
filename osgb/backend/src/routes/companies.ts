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
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         tax_number:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         contact_person:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: "Arel OSGB"
 *         tax_number: "1234567890"
 *         address: "İstanbul, Türkiye"
 *         phone: "+90 212 123 45 67"
 *         email: "info@arel.com"
 *         contact_person: "Mehmet Yılmaz"
 *         is_active: true
 *         created_at: "2025-04-19T18:00:00.000Z"
 *         updated_at: "2025-04-19T18:00:00.000Z"
 *     CompanyUnit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         company_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         company:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *       example:
 *         id: 1
 *         name: "Merkez Şube"
 *         address: "İstanbul, Türkiye"
 *         phone: "+90 212 555 55 55"
 *         company_id: 1
 *         created_at: "2025-04-19T18:00:00.000Z"
 *         updated_at: "2025-04-19T18:00:00.000Z"
 *         company:
 *           id: 1
 *           name: "Arel OSGB"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *             example:
 *               - id: 1
 *                 name: "Arel OSGB"
 *                 tax_number: "1234567890"
 *                 address: "İstanbul, Türkiye"
 *                 phone: "+90 212 123 45 67"
 *                 email: "info@arel.com"
 *                 contact_person: "Mehmet Yılmaz"
 *                 is_active: true
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *             example:
 *               id: 1
 *               name: "Arel OSGB"
 *               tax_number: "1234567890"
 *               address: "İstanbul, Türkiye"
 *               phone: "+90 212 123 45 67"
 *               email: "info@arel.com"
 *               contact_person: "Mehmet Yılmaz"
 *               is_active: true
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
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
 *             $ref: '#/components/schemas/Company'
 *           example:
 *             name: "Arel OSGB"
 *             tax_number: "1234567890"
 *             address: "İstanbul, Türkiye"
 *             phone: "+90 212 123 45 67"
 *             email: "info@arel.com"
 *             contact_person: "Mehmet Yılmaz"
 *             is_active: true
 *     responses:
 *       201:
 *         description: Firma oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *             example:
 *               id: 1
 *               name: "Arel OSGB"
 *               tax_number: "1234567890"
 *               address: "İstanbul, Türkiye"
 *               phone: "+90 212 123 45 67"
 *               email: "info@arel.com"
 *               contact_person: "Mehmet Yılmaz"
 *               is_active: true
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
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
 *             $ref: '#/components/schemas/Company'
 *           example:
 *             name: "Arel OSGB"
 *             tax_number: "1234567890"
 *             address: "İstanbul, Türkiye"
 *             phone: "+90 212 123 45 67"
 *             email: "info@arel.com"
 *             contact_person: "Mehmet Yılmaz"
 *             is_active: true
 *     responses:
 *       200:
 *         description: Firma güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *             example:
 *               id: 1
 *               name: "Arel OSGB"
 *               tax_number: "1234567890"
 *               address: "İstanbul, Türkiye"
 *               phone: "+90 212 123 45 67"
 *               email: "info@arel.com"
 *               contact_person: "Mehmet Yılmaz"
 *               is_active: true
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyUnit'
 *             example:
 *               - id: 1
 *                 name: "Merkez Şube"
 *                 address: "İstanbul, Türkiye"
 *                 phone: "+90 212 555 55 55"
 *                 company_id: 1
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:00:00.000Z"
 *                 company:
 *                   id: 1
 *                   name: "Arel OSGB"
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
 *             $ref: '#/components/schemas/CompanyUnit'
 *           example:
 *             name: "Merkez Şube"
 *             address: "İstanbul, Türkiye"
 *             phone: "+90 212 555 55 55"
 *     responses:
 *       201:
 *         description: Birim oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyUnit'
 *             example:
 *               id: 1
 *               name: "Merkez Şube"
 *               address: "İstanbul, Türkiye"
 *               phone: "+90 212 555 55 55"
 *               company_id: 1
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
 */
router.post('/:companyId/units', asyncHandler(CompanyController.createCompanyUnit));

export default router;
