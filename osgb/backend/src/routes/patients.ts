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
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tc_identity_number:
 *           type: string
 *         registration_number:
 *           type: string
 *         passport_number:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         mother_name:
 *           type: string
 *         father_name:
 *           type: string
 *         mobile_phone:
 *           type: string
 *         home_phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         notes:
 *           type: string
 *         photo_url:
 *           type: string
 *         company_id:
 *           type: integer
 *         company_unit_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         tc_identity_number: "12345678901"
 *         registration_number: "REG-001"
 *         passport_number: "P1234567"
 *         first_name: "Ayşe"
 *         last_name: "Yılmaz"
 *         birth_date: "1990-01-01"
 *         gender: "Kadın"
 *         mother_name: "Fatma"
 *         father_name: "Mehmet"
 *         mobile_phone: "+90 555 111 22 33"
 *         home_phone: "+90 212 333 44 55"
 *         email: "ayse.yilmaz@example.com"
 *         address: "İstanbul, Türkiye"
 *         notes: "Alerji yok"
 *         photo_url: "https://example.com/photo.jpg"
 *         company_id: 1
 *         company_unit_id: 2
 *         created_at: "2025-04-19T18:00:00.000Z"
 *         updated_at: "2025-04-19T18:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *             example:
 *               - id: 1
 *                 tc_identity_number: "12345678901"
 *                 registration_number: "REG-001"
 *                 passport_number: "P1234567"
 *                 first_name: "Ayşe"
 *                 last_name: "Yılmaz"
 *                 birth_date: "1990-01-01"
 *                 gender: "Kadın"
 *                 mother_name: "Fatma"
 *                 father_name: "Mehmet"
 *                 mobile_phone: "+90 555 111 22 33"
 *                 home_phone: "+90 212 333 44 55"
 *                 email: "ayse.yilmaz@example.com"
 *                 address: "İstanbul, Türkiye"
 *                 notes: "Alerji yok"
 *                 photo_url: "https://example.com/photo.jpg"
 *                 company_id: 1
 *                 company_unit_id: 2
 *                 created_at: "2025-04-19T18:00:00.000Z"
 *                 updated_at: "2025-04-19T18:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *             example:
 *               id: 1
 *               tc_identity_number: "12345678901"
 *               registration_number: "REG-001"
 *               passport_number: "P1234567"
 *               first_name: "Ayşe"
 *               last_name: "Yılmaz"
 *               birth_date: "1990-01-01"
 *               gender: "Kadın"
 *               mother_name: "Fatma"
 *               father_name: "Mehmet"
 *               mobile_phone: "+90 555 111 22 33"
 *               home_phone: "+90 212 333 44 55"
 *               email: "ayse.yilmaz@example.com"
 *               address: "İstanbul, Türkiye"
 *               notes: "Alerji yok"
 *               photo_url: "https://example.com/photo.jpg"
 *               company_id: 1
 *               company_unit_id: 2
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
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
 *             $ref: '#/components/schemas/Patient'
 *           example:
 *             tc_identity_number: "12345678901"
 *             registration_number: "REG-001"
 *             passport_number: "P1234567"
 *             first_name: "Ayşe"
 *             last_name: "Yılmaz"
 *             birth_date: "1990-01-01"
 *             gender: "Kadın"
 *             mother_name: "Fatma"
 *             father_name: "Mehmet"
 *             mobile_phone: "+90 555 111 22 33"
 *             home_phone: "+90 212 333 44 55"
 *             email: "ayse.yilmaz@example.com"
 *             address: "İstanbul, Türkiye"
 *             notes: "Alerji yok"
 *             photo_url: "https://example.com/photo.jpg"
 *             company_id: 1
 *             company_unit_id: 2
 *     responses:
 *       201:
 *         description: Hasta oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *             example:
 *               id: 1
 *               tc_identity_number: "12345678901"
 *               registration_number: "REG-001"
 *               passport_number: "P1234567"
 *               first_name: "Ayşe"
 *               last_name: "Yılmaz"
 *               birth_date: "1990-01-01"
 *               gender: "Kadın"
 *               mother_name: "Fatma"
 *               father_name: "Mehmet"
 *               mobile_phone: "+90 555 111 22 33"
 *               home_phone: "+90 212 333 44 55"
 *               email: "ayse.yilmaz@example.com"
 *               address: "İstanbul, Türkiye"
 *               notes: "Alerji yok"
 *               photo_url: "https://example.com/photo.jpg"
 *               company_id: 1
 *               company_unit_id: 2
 *               created_at: "2025-04-19T18:00:00.000Z"
 *               updated_at: "2025-04-19T18:00:00.000Z"
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
 *             $ref: '#/components/schemas/Patient'
 *           example:
 *             first_name: "Ayşe"
 *             last_name: "Yılmaz"
 *             gender: "Kadın"
 *             mobile_phone: "+90 555 111 22 33"
 *             address: "İstanbul, Türkiye"
 *     responses:
 *       200:
 *         description: Hasta güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *             example:
 *               id: 1
 *               first_name: "Ayşe"
 *               last_name: "Yılmaz"
 *               gender: "Kadın"
 *               mobile_phone: "+90 555 111 22 33"
 *               address: "İstanbul, Türkiye"
 *               updated_at: "2025-04-19T19:00:00.000Z"
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
