import { Request, Response } from 'express';
import AppDataSource from '../../ormconfig';
import { Service } from '../models/Service';

export class ServiceController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(Service);
      const services = await repo.find();
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, service_group_id } = req.body;
      if (!name || !service_group_id) {
        res.status(400).json({ message: 'Name and service_group_id are required' });
        return;
      }
      const repo = AppDataSource.getRepository(Service);
      const service = repo.create({ name, description, service_group_id });
      await repo.save(service);
      res.status(201).json(service);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
