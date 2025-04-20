import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { SampleStatus } from '../models/SampleStatus';

export class SampleStatusController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(SampleStatus);
      const statuses = await repo.find();
      res.json(statuses);
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
      const repo = AppDataSource.getRepository(SampleStatus);
      const status = repo.create({ name, description });
      await repo.save(status);
      res.status(201).json(status);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
