import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Patient } from '../models/Patient';
import { Company } from '../models/Company';
import { CompanyUnit } from '../models/CompanyUnit';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

export class PatientController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const patientRepository = AppDataSource.getRepository(Patient);
      
      // Get query parameters for filtering
      const { search, company_id } = req.query;
      
      // Build query
      let queryBuilder = patientRepository.createQueryBuilder('patient')
        .leftJoinAndSelect('patient.company', 'company')
        .leftJoinAndSelect('patient.company_unit', 'company_unit');
      
      // Apply filters if provided
      if (search) {
        queryBuilder = queryBuilder.where(
          '(patient.first_name ILIKE :search OR patient.last_name ILIKE :search OR patient.tc_identity_number LIKE :exactSearch)',
          { search: `%${search}%`, exactSearch: `${search}` }
        );
      }
      
      if (company_id) {
        queryBuilder = queryBuilder.andWhere('patient.company_id = :company_id', { company_id });
      }
      
      // Execute query
      const patients = await queryBuilder.getMany();
      
      res.json(patients);
      return;
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const patientRepository = AppDataSource.getRepository(Patient);
      const patient = await patientRepository.findOne({
        where: { id: Number(id) },
        relations: ['company', 'company_unit']
      });
      
      if (!patient) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      res.json(patient);
      return;
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        tc_identity_number,
        registration_number,
        passport_number,
        first_name,
        last_name,
        birth_date,
        gender,
        mother_name,
        father_name,
        mobile_phone,
        home_phone,
        email,
        address,
        notes,
        company_id,
        company_unit_id,
        photo_url
      } = req.body;
      
      // Validate required fields
      if (!first_name || !last_name || !gender) {
        res.status(400).json({ message: 'First name, last name, and gender are required' });
        return;
      }
      
      // Check if TC identity number is unique if provided
      if (tc_identity_number) {
        const patientRepository = AppDataSource.getRepository(Patient);
        const existingPatient = await patientRepository.findOne({
          where: { tc_identity_number }
        });
        
        if (existingPatient) {
          res.status(400).json({ message: 'TC identity number already exists' });
          return;
        }
      }
      
      // Create new patient
      const patient = new Patient();
      patient.tc_identity_number = tc_identity_number;
      patient.registration_number = registration_number;
      patient.passport_number = passport_number;
      patient.first_name = first_name;
      patient.last_name = last_name;
      patient.birth_date = birth_date ? new Date(birth_date) : null;
      patient.gender = gender;
      patient.mother_name = mother_name;
      patient.father_name = father_name;
      patient.mobile_phone = mobile_phone;
      patient.home_phone = home_phone;
      patient.email = email;
      patient.address = address;
      patient.notes = notes;
      patient.photo_url = photo_url;
      
      // Set company if provided
      if (company_id) {
        const companyRepository = AppDataSource.getRepository(Company);
        const company = await companyRepository.findOne({
          where: { id: Number(company_id) }
        });
        
        if (company) {
          patient.company = company;
          patient.company_id = company.id;
        }
      }
      
      // Set company unit if provided
      if (company_unit_id) {
        const companyUnitRepository = AppDataSource.getRepository(CompanyUnit);
        const companyUnit = await companyUnitRepository.findOne({
          where: { id: Number(company_unit_id) }
        });
        
        if (companyUnit) {
          patient.company_unit = companyUnit;
          patient.company_unit_id = companyUnit.id;
        }
      }
      
      // Save patient
      const patientRepository = AppDataSource.getRepository(Patient);
      await patientRepository.save(patient);
      
      res.status(201).json(patient);
      return;
    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        tc_identity_number,
        registration_number,
        passport_number,
        first_name,
        last_name,
        birth_date,
        gender,
        mother_name,
        father_name,
        mobile_phone,
        home_phone,
        email,
        address,
        notes,
        company_id,
        company_unit_id,
        photo_url
      } = req.body;
      
      // Find patient
      const patientRepository = AppDataSource.getRepository(Patient);
      const patient = await patientRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!patient) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      // Check if TC identity number is unique if changed
      if (tc_identity_number && tc_identity_number !== patient.tc_identity_number) {
        const existingPatient = await patientRepository.findOne({
          where: { tc_identity_number }
        });
        
        if (existingPatient && existingPatient.id !== Number(id)) {
          res.status(400).json({ message: 'TC identity number already exists' });
          return;
        }
      }
      
      // Update patient fields
      if (tc_identity_number !== undefined) patient.tc_identity_number = tc_identity_number;
      if (registration_number !== undefined) patient.registration_number = registration_number;
      if (passport_number !== undefined) patient.passport_number = passport_number;
      if (first_name !== undefined) patient.first_name = first_name;
      if (last_name !== undefined) patient.last_name = last_name;
      if (birth_date !== undefined) patient.birth_date = birth_date ? new Date(birth_date) : null;
      if (gender !== undefined) patient.gender = gender;
      if (mother_name !== undefined) patient.mother_name = mother_name;
      if (father_name !== undefined) patient.father_name = father_name;
      if (mobile_phone !== undefined) patient.mobile_phone = mobile_phone;
      if (home_phone !== undefined) patient.home_phone = home_phone;
      if (email !== undefined) patient.email = email;
      if (address !== undefined) patient.address = address;
      if (notes !== undefined) patient.notes = notes;
      if (photo_url !== undefined) patient.photo_url = photo_url;
      
      // Update company if provided
      if (company_id !== undefined) {
        if (company_id === null) {
          patient.company = null;
          patient.company_id = null;
        } else {
          const companyRepository = AppDataSource.getRepository(Company);
          const company = await companyRepository.findOne({
            where: { id: Number(company_id) }
          });
          
          if (company) {
            patient.company = company;
            patient.company_id = company.id;
          }
        }
      }
      
      // Update company unit if provided
      if (company_unit_id !== undefined) {
        if (company_unit_id === null) {
          patient.company_unit = null;
          patient.company_unit_id = null;
        } else {
          const companyUnitRepository = AppDataSource.getRepository(CompanyUnit);
          const companyUnit = await companyUnitRepository.findOne({
            where: { id: Number(company_unit_id) }
          });
          
          if (companyUnit) {
            patient.company_unit = companyUnit;
            patient.company_unit_id = companyUnit.id;
          }
        }
      }
      
      // Save updated patient
      await patientRepository.save(patient);
      
      res.json(patient);
      return;
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const patientRepository = AppDataSource.getRepository(Patient);
      const patient = await patientRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!patient) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      await patientRepository.remove(patient);
      
      res.status(204).send();
      return;
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async importExcel(req: Request, res: Response): Promise<void> {
    // Multer ile dosya yakalama
    const uploadSingle = upload.single('file');
    uploadSingle(req, res, async function (err: any) {
      if (err) {
        res.status(400).json({ message: 'Dosya yüklenemedi' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ message: 'Dosya bulunamadı' });
        return;
      }
      try {
        const filePath = (req.file as Express.Multer.File).path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as any[];
        const patientRepository = AppDataSource.getRepository(Patient);
        let imported = 0;
        const importedPatients = [];
        for (const row of rows) {
          // Temel zorunlu alan kontrolü
          if (!row.first_name || !row.last_name || !row.gender) continue;
          const patient = patientRepository.create({
            tc_identity_number: row.tc_identity_number,
            registration_number: row.registration_number,
            passport_number: row.passport_number,
            first_name: row.first_name,
            last_name: row.last_name,
            birth_date: row.birth_date ? new Date(row.birth_date) : null,
            gender: row.gender,
            mother_name: row.mother_name,
            father_name: row.father_name,
            mobile_phone: row.mobile_phone,
            home_phone: row.home_phone,
            email: row.email,
            address: row.address
          });
          await patientRepository.save(patient);
          importedPatients.push(patient);
          imported++;
        }
        res.json({ imported, patients: importedPatients.slice(0, 5) });
      } catch (e) {
        res.status(500).json({ message: 'Excel okuma/aktarımı sırasında hata oluştu' });
      }
    });
  }
}
