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
 * components:
 *   schemas:
 *     LabResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         protocol_service_id:
 *           type: integer
 *         barcode_number:
 *           type: string
 *         result:
 *           type: string
 *         result_text:
 *           type: string
 *         reference_range:
 *           type: string
 *         unit:
 *           type: string
 *         is_abnormal:
 *           type: boolean
 *         sample_status_id:
 *           type: integer
 *         rejection_reason_id:
 *           type: integer
 *         request_date:
 *           type: string
 *           format: date-time
 *         acceptance_date:
 *           type: string
 *           format: date-time
 *         acceptance_by:
 *           type: integer
 *         barcode_date:
 *           type: string
 *           format: date-time
 *         approval_date:
 *           type: string
 *           format: date-time
 *         approved_by:
 *           type: integer
 *         rejection_date:
 *           type: string
 *           format: date-time
 *         rejected_by:
 *           type: integer
 *         external_lab_id:
 *           type: integer
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 5
 *         protocol_service_id: 12
 *         barcode_number: "BR-2025001"
 *         result: "Pozitif"
 *         result_text: "HCV RNA tespit edildi."
 *         reference_range: "Negatif"
 *         unit: "IU/mL"
 *         is_abnormal: true
 *         sample_status_id: 2
 *         rejection_reason_id: null
 *         request_date: "2025-04-19T08:00:00.000Z"
 *         acceptance_date: "2025-04-19T09:00:00.000Z"
 *         acceptance_by: 3
 *         barcode_date: "2025-04-19T09:10:00.000Z"
 *         approval_date: "2025-04-19T10:00:00.000Z"
 *         approved_by: 4
 *         rejection_date: null
 *         rejected_by: null
 *         external_lab_id: 1
 *         status: "approved"
 *         created_at: "2025-04-19T08:00:00.000Z"
 *         updated_at: "2025-04-19T10:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabResult'
 *             example:
 *               - id: 5
 *                 protocol_service_id: 12
 *                 barcode_number: "BR-2025001"
 *                 result: "Pozitif"
 *                 result_text: "HCV RNA tespit edildi."
 *                 reference_range: "Negatif"
 *                 unit: "IU/mL"
 *                 is_abnormal: true
 *                 sample_status_id: 2
 *                 rejection_reason_id: null
 *                 request_date: "2025-04-19T08:00:00.000Z"
 *                 acceptance_date: "2025-04-19T09:00:00.000Z"
 *                 acceptance_by: 3
 *                 barcode_date: "2025-04-19T09:10:00.000Z"
 *                 approval_date: "2025-04-19T10:00:00.000Z"
 *                 approved_by: 4
 *                 rejection_date: null
 *                 rejected_by: null
 *                 external_lab_id: 1
 *                 status: "approved"
 *                 created_at: "2025-04-19T08:00:00.000Z"
 *                 updated_at: "2025-04-19T10:00:00.000Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabResult'
 *             example:
 *               id: 5
 *               protocol_service_id: 12
 *               barcode_number: "BR-2025001"
 *               result: "Pozitif"
 *               result_text: "HCV RNA tespit edildi."
 *               reference_range: "Negatif"
 *               unit: "IU/mL"
 *               is_abnormal: true
 *               sample_status_id: 2
 *               rejection_reason_id: null
 *               request_date: "2025-04-19T08:00:00.000Z"
 *               acceptance_date: "2025-04-19T09:00:00.000Z"
 *               acceptance_by: 3
 *               barcode_date: "2025-04-19T09:10:00.000Z"
 *               approval_date: "2025-04-19T10:00:00.000Z"
 *               approved_by: 4
 *               rejection_date: null
 *               rejected_by: null
 *               external_lab_id: 1
 *               status: "approved"
 *               created_at: "2025-04-19T08:00:00.000Z"
 *               updated_at: "2025-04-19T10:00:00.000Z"
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
 *             $ref: '#/components/schemas/LabResult'
 *           example:
 *             protocol_service_id: 12
 *             barcode_number: "BR-2025001"
 *             result: "Pozitif"
 *             result_text: "HCV RNA tespit edildi."
 *             reference_range: "Negatif"
 *             unit: "IU/mL"
 *             is_abnormal: true
 *             sample_status_id: 2
 *             request_date: "2025-04-19T08:00:00.000Z"
 *             acceptance_date: "2025-04-19T09:00:00.000Z"
 *             acceptance_by: 3
 *             barcode_date: "2025-04-19T09:10:00.000Z"
 *             approval_date: "2025-04-19T10:00:00.000Z"
 *             approved_by: 4
 *             external_lab_id: 1
 *             status: "approved"
 *     responses:
 *       201:
 *         description: Sonuç oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabResult'
 *             example:
 *               id: 5
 *               protocol_service_id: 12
 *               barcode_number: "BR-2025001"
 *               result: "Pozitif"
 *               result_text: "HCV RNA tespit edildi."
 *               reference_range: "Negatif"
 *               unit: "IU/mL"
 *               is_abnormal: true
 *               sample_status_id: 2
 *               rejection_reason_id: null
 *               request_date: "2025-04-19T08:00:00.000Z"
 *               acceptance_date: "2025-04-19T09:00:00.000Z"
 *               acceptance_by: 3
 *               barcode_date: "2025-04-19T09:10:00.000Z"
 *               approval_date: "2025-04-19T10:00:00.000Z"
 *               approved_by: 4
 *               rejection_date: null
 *               rejected_by: null
 *               external_lab_id: 1
 *               status: "approved"
 *               created_at: "2025-04-19T08:00:00.000Z"
 *               updated_at: "2025-04-19T10:00:00.000Z"
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
 *             $ref: '#/components/schemas/LabResult'
 *           example:
 *             result: "Negatif"
 *             result_text: "HCV RNA tespit edilmedi."
 *             is_abnormal: false
 *             approval_date: "2025-04-19T11:00:00.000Z"
 *             approved_by: 4
 *             status: "approved"
 *     responses:
 *       200:
 *         description: Sonuç güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabResult'
 *             example:
 *               id: 5
 *               result: "Negatif"
 *               result_text: "HCV RNA tespit edilmedi."
 *               is_abnormal: false
 *               approval_date: "2025-04-19T11:00:00.000Z"
 *               approved_by: 4
 *               status: "approved"
 *               updated_at: "2025-04-19T11:00:00.000Z"
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
