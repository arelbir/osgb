import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Protocol } from '../models/Protocol';
import { Patient } from '../models/Patient';
import { ExaminationType } from '../models/ExaminationType';
import { Company } from '../models/Company';
import { ProtocolService } from '../models/ProtocolService';
import { Service } from '../models/Service';
import { User } from '../models/User';

export class ProtocolController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const protocolRepository = AppDataSource.getRepository(Protocol);
      
      // Get query parameters for filtering
      const { 
        start_date, 
        end_date, 
        patient_id, 
        company_id, 
        examination_type_id,
        status
      } = req.query;
      
      // Build query
      let queryBuilder = protocolRepository.createQueryBuilder('protocol')
        .leftJoinAndSelect('protocol.patient', 'patient')
        .leftJoinAndSelect('protocol.examination_type', 'examination_type')
        .leftJoinAndSelect('protocol.company', 'company')
        .leftJoinAndSelect('protocol.services', 'services')
        .leftJoinAndSelect('services.service', 'service');
      
      // Apply filters if provided
      if (start_date && end_date) {
        queryBuilder = queryBuilder.where(
          'protocol.protocol_date BETWEEN :start_date AND :end_date',
          { start_date, end_date: new Date(end_date.toString() + 'T23:59:59.999Z') }
        );
      } else if (start_date) {
        queryBuilder = queryBuilder.where(
          'protocol.protocol_date >= :start_date',
          { start_date }
        );
      } else if (end_date) {
        queryBuilder = queryBuilder.where(
          'protocol.protocol_date <= :end_date',
          { end_date: new Date(end_date.toString() + 'T23:59:59.999Z') }
        );
      }
      
      if (patient_id) {
        queryBuilder = queryBuilder.andWhere('protocol.patient_id = :patient_id', { patient_id });
      }
      
      if (company_id) {
        queryBuilder = queryBuilder.andWhere('protocol.company_id = :company_id', { company_id });
      }
      
      if (examination_type_id) {
        queryBuilder = queryBuilder.andWhere('protocol.examination_type_id = :examination_type_id', { examination_type_id });
      }
      
      if (status) {
        queryBuilder = queryBuilder.andWhere('protocol.status = :status', { status });
      }
      
      // Execute query
      const protocols = await queryBuilder.getMany();
      
      res.json(protocols);
      return;
    } catch (error) {
      console.error('Get protocols error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocol = await protocolRepository.findOne({
        where: { id: Number(id) },
        relations: [
          'patient', 
          'examination_type', 
          'company', 
          'services', 
          'services.service',
          'payments'
        ]
      });
      
      if (!protocol) {
        res.status(404).json({ message: 'Protocol not found' });
        return;
      }
      
      res.json(protocol);
      return;
    } catch (error) {
      console.error('Get protocol error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        patient_id,
        examination_type_id,
        company_id,
        protocol_date,
        receipt_number,
        ledger_number,
        total_amount,
        discount_amount,
        services
      } = req.body;
      
      // Validate required fields
      if (!patient_id || !examination_type_id || !total_amount) {
        res.status(400).json({ message: 'Patient, examination type, and total amount are required' });
        return;
      }
      
      // Find patient
      const patientRepository = AppDataSource.getRepository(Patient);
      const patient = await patientRepository.findOne({
        where: { id: Number(patient_id) }
      });
      
      if (!patient) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      // Find examination type
      const examinationTypeRepository = AppDataSource.getRepository(ExaminationType);
      const examinationType = await examinationTypeRepository.findOne({
        where: { id: Number(examination_type_id) }
      });
      
      if (!examinationType) {
        res.status(404).json({ message: 'Examination type not found' });
        return;
      }
      
      // Find company if provided
      let company = null;
      if (company_id) {
        const companyRepository = AppDataSource.getRepository(Company);
        company = await companyRepository.findOne({
          where: { id: Number(company_id) }
        });
        
        if (!company) {
          res.status(404).json({ message: 'Company not found' });
          return;
        }
      }
      
      // Generate protocol number
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocolCount = await protocolRepository.count();
      const protocolNumber = `P${new Date().getFullYear()}${(protocolCount + 1).toString().padStart(6, '0')}`;
      
      // Create new protocol
      const protocol = new Protocol();
      protocol.protocol_number = protocolNumber;
      protocol.patient = patient;
      protocol.patient_id = patient.id;
      protocol.examination_type = examinationType;
      protocol.examination_type_id = examinationType.id;
      
      if (company) {
        protocol.company = company;
        protocol.company_id = company.id;
      } else {
        protocol.company = null;
        protocol.company_id = null;
      }
      
      protocol.protocol_date = protocol_date ? new Date(protocol_date) : new Date();
      protocol.receipt_number = receipt_number;
      protocol.ledger_number = ledger_number;
      protocol.total_amount = total_amount;
      protocol.discount_amount = discount_amount || 0;
      protocol.paid_amount = 0;
      protocol.status = 'active';
      
      if (req.user) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: req.user.id }
        });
        
        if (user) {
          protocol.created_by_user = user;
          protocol.created_by = user.id;
        }
      }
      
      // Save protocol
      await protocolRepository.save(protocol);
      
      // Add services if provided
      if (services && Array.isArray(services) && services.length > 0) {
        const serviceRepository = AppDataSource.getRepository(Service);
        const protocolServiceRepository = AppDataSource.getRepository(ProtocolService);
        
        for (const serviceItem of services) {
          const { service_id, price } = serviceItem;
          
          const service = await serviceRepository.findOne({
            where: { id: Number(service_id) }
          });
          
          if (service) {
            const protocolService = new ProtocolService();
            protocolService.protocol = protocol;
            protocolService.protocol_id = protocol.id;
            protocolService.service = service;
            protocolService.service_id = service.id;
            protocolService.price = price || service.price;
            
            await protocolServiceRepository.save(protocolService);
          }
        }
      }
      
      // Get protocol with relations
      const savedProtocol = await protocolRepository.findOne({
        where: { id: protocol.id },
        relations: [
          'patient', 
          'examination_type', 
          'company', 
          'services', 
          'services.service'
        ]
      });
      
      res.status(201).json(savedProtocol);
      return;
    } catch (error) {
      console.error('Create protocol error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        examination_type_id,
        company_id,
        protocol_date,
        receipt_number,
        ledger_number,
        total_amount,
        discount_amount,
        status
      } = req.body;
      
      // Find protocol
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocol = await protocolRepository.findOne({
        where: { id: Number(id) },
        relations: ['patient', 'examination_type', 'company']
      });
      
      if (!protocol) {
        res.status(404).json({ message: 'Protocol not found' });
        return;
      }
      
      // Update examination type if provided
      if (examination_type_id) {
        const examinationTypeRepository = AppDataSource.getRepository(ExaminationType);
        const examinationType = await examinationTypeRepository.findOne({
          where: { id: Number(examination_type_id) }
        });
        
        if (!examinationType) {
          res.status(404).json({ message: 'Examination type not found' });
          return;
        }
        
        protocol.examination_type = examinationType;
        protocol.examination_type_id = examinationType.id;
      }
      
      // Update company if provided
      if (company_id !== undefined) {
        if (company_id === null) {
          protocol.company = null;
          protocol.company_id = null;
        } else {
          const companyRepository = AppDataSource.getRepository(Company);
          const company = await companyRepository.findOne({
            where: { id: Number(company_id) }
          });
          
          if (!company) {
            res.status(404).json({ message: 'Company not found' });
            return;
          }
          
          protocol.company = company;
          protocol.company_id = company.id;
        }
      }
      
      // Update other fields
      if (protocol_date) protocol.protocol_date = new Date(protocol_date);
      if (receipt_number !== undefined) protocol.receipt_number = receipt_number;
      if (ledger_number !== undefined) protocol.ledger_number = ledger_number;
      if (total_amount !== undefined) protocol.total_amount = total_amount;
      if (discount_amount !== undefined) protocol.discount_amount = discount_amount;
      if (status !== undefined) protocol.status = status;
      
      // Save updated protocol
      await protocolRepository.save(protocol);
      
      // Get updated protocol with relations
      const updatedProtocol = await protocolRepository.findOne({
        where: { id: protocol.id },
        relations: [
          'patient', 
          'examination_type', 
          'company', 
          'services', 
          'services.service'
        ]
      });
      
      res.json(updatedProtocol);
      return;
    } catch (error) {
      console.error('Update protocol error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocol = await protocolRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!protocol) {
        res.status(404).json({ message: 'Protocol not found' });
        return;
      }
      
      await protocolRepository.remove(protocol);
      
      res.status(204).send();
      return;
    } catch (error) {
      console.error('Delete protocol error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
