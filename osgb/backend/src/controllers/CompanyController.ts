import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Company } from '../models/Company';
import { CompanyUnit } from '../models/CompanyUnit';

export class CompanyController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const companyRepository = AppDataSource.getRepository(Company);
      
      // Get query parameters for filtering
      const { search, is_active } = req.query;
      
      // Build query
      let queryBuilder = companyRepository.createQueryBuilder('company')
        .leftJoinAndSelect('company.units', 'units');
      
      // Apply filters if provided
      if (search) {
        queryBuilder = queryBuilder.where(
          'company.name ILIKE :search',
          { search: `%${search}%` }
        );
      }
      
      if (is_active !== undefined) {
        queryBuilder = queryBuilder.andWhere('company.is_active = :is_active', 
          { is_active: is_active === 'true' });
      }
      
      // Execute query
      const companies = await queryBuilder.getMany();
      
      res.json(companies);
      return;
    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const companyRepository = AppDataSource.getRepository(Company);
      const company = await companyRepository.findOne({
        where: { id: Number(id) },
        relations: ['units']
      });
      
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }
      
      res.json(company);
      return;
    } catch (error) {
      console.error('Get company error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        tax_number,
        address,
        phone,
        email,
        contact_person,
        is_active
      } = req.body;
      
      // Validate required fields
      if (!name) {
        res.status(400).json({ message: 'Company name is required' });
        return;
      }
      
      // Create new company
      const company = new Company();
      company.name = name;
      company.tax_number = tax_number;
      company.address = address;
      company.phone = phone;
      company.email = email;
      company.contact_person = contact_person;
      company.is_active = is_active !== undefined ? is_active : true;
      
      // Save company
      const companyRepository = AppDataSource.getRepository(Company);
      await companyRepository.save(company);
      
      res.status(201).json(company);
      return;
    } catch (error) {
      console.error('Create company error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        tax_number,
        address,
        phone,
        email,
        contact_person,
        is_active
      } = req.body;
      
      // Find company
      const companyRepository = AppDataSource.getRepository(Company);
      const company = await companyRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }
      
      // Update company fields
      if (name !== undefined) company.name = name;
      if (tax_number !== undefined) company.tax_number = tax_number;
      if (address !== undefined) company.address = address;
      if (phone !== undefined) company.phone = phone;
      if (email !== undefined) company.email = email;
      if (contact_person !== undefined) company.contact_person = contact_person;
      if (is_active !== undefined) company.is_active = is_active;
      
      // Save updated company
      await companyRepository.save(company);
      
      res.json(company);
      return;
    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const companyRepository = AppDataSource.getRepository(Company);
      const company = await companyRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }
      
      await companyRepository.remove(company);
      
      res.status(204).send();
      return;
    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  // Company Units
  static async getCompanyUnits(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      
      const companyUnitRepository = AppDataSource.getRepository(CompanyUnit);
      const units = await companyUnitRepository.find({
        where: { company_id: Number(companyId) },
        relations: ['company']
      });
      
      res.json(units);
      return;
    } catch (error) {
      console.error('Get company units error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async createCompanyUnit(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { name, address, phone } = req.body;
      
      // Validate required fields
      if (!name) {
        res.status(400).json({ message: 'Unit name is required' });
        return;
      }
      
      // Find company
      const companyRepository = AppDataSource.getRepository(Company);
      const company = await companyRepository.findOne({
        where: { id: Number(companyId) }
      });
      
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }
      
      // Create new company unit
      const companyUnit = new CompanyUnit();
      companyUnit.name = name;
      companyUnit.address = address;
      companyUnit.phone = phone;
      companyUnit.company = company;
      companyUnit.company_id = company.id;
      
      // Save company unit
      const companyUnitRepository = AppDataSource.getRepository(CompanyUnit);
      await companyUnitRepository.save(companyUnit);
      
      res.status(201).json(companyUnit);
      return;
    } catch (error) {
      console.error('Create company unit error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
