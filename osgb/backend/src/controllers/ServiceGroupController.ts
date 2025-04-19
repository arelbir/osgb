import { Request, Response } from 'express';
import AppDataSource from '../../ormconfig';
import { ServiceGroup } from '../models/ServiceGroup';

export class ServiceGroupController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(ServiceGroup);
      const groups = await repo.find();
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      if (!name) {
        res.status(400).json({ message: 'Name is required' });
        return;
      }
      const repo = AppDataSource.getRepository(ServiceGroup);
      const group = repo.create({ name, description });
      await repo.save(group);
      res.status(201).json(group);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
