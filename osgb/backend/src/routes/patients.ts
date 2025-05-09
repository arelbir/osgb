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
 *           enum: ["Erkek", "Kadın", "Diğer"]
 *           description: Cinsiyet ("Erkek", "Kadın", "Diğer")
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
 * /patients/exists:
 *   get:
 *     summary: TC kimlik numarasına göre hasta var mı?
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: tc_identity_number
 *         schema:
 *           type: string
 *         required: true
 *         description: TC kimlik numarası
 *     responses:
 *       200:
 *         description: Hasta var mı?
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Hasta sistemde var mı?
 *                 id:
 *                   type: integer
 *                   description: Hasta ID (varsa)
 */
router.get('/exists', asyncHandler(async (req, res, next) => {
  const tc = req.query.tc_identity_number as string;
  if (!tc) {
    res.status(400).json({ error: 'tc_identity_number gerekli' });
    return;
  }
  const cleanTc = tc.trim();
  if (!/^[0-9]{11}$/.test(cleanTc)) {
    res.status(400).json({ error: 'Geçersiz TC kimlik numarası formatı' });
    return;
  }
  const patient = await req.app.get('dataSource').getRepository('Patient').findOne({
    select: ['id'],
    where: { tc_identity_number: cleanTc }
  });
  if (patient && patient.id != null) {
    res.json({ exists: true, id: patient.id });
  } else {
    res.json({ exists: false });
  }
}));

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
router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Geçersiz hasta ID' });
    return;
  }
  // Controller fonksiyonunu çağır
  await PatientController.getById(req, res);
}));

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

/**
 * @swagger
 * /patients/import-excel:
 *   post:
 *     summary: Excel ile toplu hasta aktarımı
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Aktarılan hasta sayısı ve örnek kayıtlar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imported:
 *                   type: integer
 *                 patients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 */
router.post('/import-excel', asyncHandler(PatientController.importExcel));

/**
 * @swagger
 * /patients/excel-template:
 *   get:
 *     summary: Hasta Excel şablonunu indir
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel şablonu dosyası
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/excel-template', (req, res) => {
  try {
    const filePath = require('path').resolve(__dirname, '../utils/excelPatientTemplate.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="hasta_sablon.xlsx"');
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).json({ message: 'Excel şablonu indirilemedi', error: err.message });
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Excel şablonu indirilemedi', error: err.message });
  }
});

export default router;
