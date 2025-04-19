import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { LabResult } from '../models/LabResult';
import { ProtocolService } from '../models/ProtocolService';
import { SampleStatus } from '../models/SampleStatus';
import { SampleRejectionReason } from '../models/SampleRejectionReason';
import { ExternalLab } from '../models/ExternalLab';
import { User } from '../models/User';

export class LabResultController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const labResultRepository = AppDataSource.getRepository(LabResult);
      
      // Get query parameters for filtering
      const { 
        protocol_service_id, 
        sample_status_id, 
        barcode_number,
        status,
        external_lab_id
      } = req.query;
      
      // Build query
      let queryBuilder = labResultRepository.createQueryBuilder('lab_result')
        .leftJoinAndSelect('lab_result.protocol_service', 'protocol_service')
        .leftJoinAndSelect('protocol_service.protocol', 'protocol')
        .leftJoinAndSelect('protocol_service.service', 'service')
        .leftJoinAndSelect('protocol.patient', 'patient')
        .leftJoinAndSelect('lab_result.sample_status', 'sample_status')
        .leftJoinAndSelect('lab_result.rejection_reason', 'rejection_reason')
        .leftJoinAndSelect('lab_result.external_lab', 'external_lab');
      
      // Apply filters if provided
      if (protocol_service_id) {
        queryBuilder = queryBuilder.where('lab_result.protocol_service_id = :protocol_service_id', { protocol_service_id });
      }
      
      if (sample_status_id) {
        queryBuilder = queryBuilder.andWhere('lab_result.sample_status_id = :sample_status_id', { sample_status_id });
      }
      
      if (barcode_number) {
        queryBuilder = queryBuilder.andWhere('lab_result.barcode_number = :barcode_number', { barcode_number });
      }
      
      if (status) {
        queryBuilder = queryBuilder.andWhere('lab_result.status = :status', { status });
      }
      
      if (external_lab_id) {
        queryBuilder = queryBuilder.andWhere('lab_result.external_lab_id = :external_lab_id', { external_lab_id });
      }
      
      // Execute query
      const labResults = await queryBuilder.getMany();
      
      res.json(labResults);
      return;
    } catch (error) {
      console.error('Get lab results error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const labResultRepository = AppDataSource.getRepository(LabResult);
      const labResult = await labResultRepository.findOne({
        where: { id: Number(id) },
        relations: [
          'protocol_service',
          'protocol_service.protocol',
          'protocol_service.service',
          'protocol_service.protocol.patient',
          'sample_status',
          'rejection_reason',
          'external_lab',
          'acceptance_by_user',
          'approved_by_user',
          'rejected_by_user'
        ]
      });
      
      if (!labResult) {
        res.status(404).json({ message: 'Lab result not found' });
        return;
      }
      
      res.json(labResult);
      return;
    } catch (error) {
      console.error('Get lab result error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        protocol_service_id,
        barcode_number,
        result,
        result_text,
        reference_range,
        unit,
        is_abnormal,
        sample_status_id,
        external_lab_id
      } = req.body;
      
      // Validate required fields
      if (!protocol_service_id) {
        res.status(400).json({ message: 'Protocol service ID is required' });
        return;
      }
      
      // Find protocol service
      const protocolServiceRepository = AppDataSource.getRepository(ProtocolService);
      const protocolService = await protocolServiceRepository.findOne({
        where: { id: Number(protocol_service_id) },
        relations: ['protocol', 'service']
      });
      
      if (!protocolService) {
        res.status(404).json({ message: 'Protocol service not found' });
        return;
      }
      
      // Find sample status if provided
      let sampleStatus = null;
      if (sample_status_id) {
        const sampleStatusRepository = AppDataSource.getRepository(SampleStatus);
        sampleStatus = await sampleStatusRepository.findOne({
          where: { id: Number(sample_status_id) }
        });
        
        if (!sampleStatus) {
          res.status(404).json({ message: 'Sample status not found' });
          return;
        }
      }
      
      // Find external lab if provided
      let externalLab = null;
      if (external_lab_id) {
        const externalLabRepository = AppDataSource.getRepository(ExternalLab);
        externalLab = await externalLabRepository.findOne({
          where: { id: Number(external_lab_id) }
        });
        
        if (!externalLab) {
          res.status(404).json({ message: 'External lab not found' });
          return;
        }
      }
      
      // Create new lab result
      const labResult = new LabResult();
      labResult.protocol_service = protocolService;
      labResult.protocol_service_id = protocolService.id;
      labResult.barcode_number = barcode_number;
      labResult.result = result;
      labResult.result_text = result_text;
      labResult.reference_range = reference_range;
      labResult.unit = unit;
      labResult.is_abnormal = is_abnormal || false;
      labResult.request_date = new Date();
      
      if (sampleStatus) {
        labResult.sample_status = sampleStatus;
        labResult.sample_status_id = sampleStatus.id;
      } else {
        labResult.sample_status = null;
        labResult.sample_status_id = null;
      }
      
      if (externalLab) {
        labResult.external_lab = externalLab;
        labResult.external_lab_id = externalLab.id;
      } else {
        labResult.external_lab = null;
        labResult.external_lab_id = null;
      }
      
      // Save lab result
      const labResultRepository = AppDataSource.getRepository(LabResult);
      await labResultRepository.save(labResult);
      
      res.status(201).json(labResult);
      return;
    } catch (error) {
      console.error('Create lab result error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        barcode_number,
        result,
        result_text,
        reference_range,
        unit,
        is_abnormal,
        sample_status_id,
        rejection_reason_id,
        external_lab_id,
        status
      } = req.body;
      
      // Find lab result
      const labResultRepository = AppDataSource.getRepository(LabResult);
      const labResult = await labResultRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!labResult) {
        res.status(404).json({ message: 'Lab result not found' });
        return;
      }
      
      // Update sample status if provided
      if (sample_status_id !== undefined) {
        if (sample_status_id === null) {
          labResult.sample_status = null;
          labResult.sample_status_id = null;
        } else {
          const sampleStatusRepository = AppDataSource.getRepository(SampleStatus);
          const sampleStatus = await sampleStatusRepository.findOne({
            where: { id: Number(sample_status_id) }
          });
          
          if (!sampleStatus) {
            res.status(404).json({ message: 'Sample status not found' });
            return;
          }
          
          labResult.sample_status = sampleStatus;
          labResult.sample_status_id = sampleStatus.id;
        }
      }
      
      // Update rejection reason if provided
      if (rejection_reason_id !== undefined) {
        if (rejection_reason_id === null) {
          labResult.rejection_reason = null;
          labResult.rejection_reason_id = null;
        } else {
          const rejectionReasonRepository = AppDataSource.getRepository(SampleRejectionReason);
          const rejectionReason = await rejectionReasonRepository.findOne({
            where: { id: Number(rejection_reason_id) }
          });
          
          if (!rejectionReason) {
            res.status(404).json({ message: 'Rejection reason not found' });
            return;
          }
          
          labResult.rejection_reason = rejectionReason;
          labResult.rejection_reason_id = rejectionReason.id;
          labResult.rejection_date = new Date();
          
          if (req.user) {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
              where: { id: req.user.id }
            });
            
            if (user) {
              labResult.rejected_by_user = user;
              labResult.rejected_by = user.id;
            }
          }
        }
      }
      
      // Update external lab if provided
      if (external_lab_id !== undefined) {
        if (external_lab_id === null) {
          labResult.external_lab = null;
          labResult.external_lab_id = null;
        } else {
          const externalLabRepository = AppDataSource.getRepository(ExternalLab);
          const externalLab = await externalLabRepository.findOne({
            where: { id: Number(external_lab_id) }
          });
          
          if (!externalLab) {
            res.status(404).json({ message: 'External lab not found' });
            return;
          }
          
          labResult.external_lab = externalLab;
          labResult.external_lab_id = externalLab.id;
        }
      }
      
      // Update other fields
      if (barcode_number !== undefined) labResult.barcode_number = barcode_number;
      if (result !== undefined) labResult.result = result;
      if (result_text !== undefined) labResult.result_text = result_text;
      if (reference_range !== undefined) labResult.reference_range = reference_range;
      if (unit !== undefined) labResult.unit = unit;
      if (is_abnormal !== undefined) labResult.is_abnormal = is_abnormal;
      if (status !== undefined) labResult.status = status;
      
      // Save updated lab result
      await labResultRepository.save(labResult);
      
      res.json(labResult);
      return;
    } catch (error) {
      console.error('Update lab result error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async acceptSample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Find lab result
      const labResultRepository = AppDataSource.getRepository(LabResult);
      const labResult = await labResultRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!labResult) {
        res.status(404).json({ message: 'Lab result not found' });
        return;
      }
      
      // Find "Accepted" sample status
      const sampleStatusRepository = AppDataSource.getRepository(SampleStatus);
      const acceptedStatus = await sampleStatusRepository.findOne({
        where: { name: 'Kabul Edildi' }
      });
      
      if (!acceptedStatus) {
        res.status(404).json({ message: 'Accepted sample status not found' });
        return;
      }
      
      // Update lab result
      labResult.sample_status = acceptedStatus;
      labResult.sample_status_id = acceptedStatus.id;
      labResult.acceptance_date = new Date();
      labResult.status = 'processing';
      
      if (req.user) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: req.user.id }
        });
        
        if (user) {
          labResult.acceptance_by_user = user;
          labResult.acceptance_by = user.id;
        }
      }
      
      // Save updated lab result
      await labResultRepository.save(labResult);
      
      res.json(labResult);
      return;
    } catch (error) {
      console.error('Accept sample error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async approveSample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Find lab result
      const labResultRepository = AppDataSource.getRepository(LabResult);
      const labResult = await labResultRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!labResult) {
        res.status(404).json({ message: 'Lab result not found' });
        return;
      }
      
      // Find "Completed" sample status
      const sampleStatusRepository = AppDataSource.getRepository(SampleStatus);
      const completedStatus = await sampleStatusRepository.findOne({
        where: { name: 'Sonuçlandı' }
      });
      
      if (!completedStatus) {
        res.status(404).json({ message: 'Completed sample status not found' });
        return;
      }
      
      // Update lab result
      labResult.sample_status = completedStatus;
      labResult.sample_status_id = completedStatus.id;
      labResult.approval_date = new Date();
      labResult.status = 'completed';
      
      if (req.user) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: req.user.id }
        });
        
        if (user) {
          labResult.approved_by_user = user;
          labResult.approved_by = user.id;
        }
      }
      
      // Save updated lab result
      await labResultRepository.save(labResult);
      
      res.json(labResult);
      return;
    } catch (error) {
      console.error('Approve sample error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const labResultRepository = AppDataSource.getRepository(LabResult);
      const labResult = await labResultRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!labResult) {
        res.status(404).json({ message: 'Lab result not found' });
        return;
      }
      
      await labResultRepository.remove(labResult);
      
      res.status(204).send();
      return;
    } catch (error) {
      console.error('Delete lab result error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
