import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { SampleRejectionReason } from '../models/SampleRejectionReason';

export class SampleRejectionReasonController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(SampleRejectionReason);
      const reasons = await repo.find();
      res.json(reasons);
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
      const repo = AppDataSource.getRepository(SampleRejectionReason);
      const reason = repo.create({ name, description });
      await repo.save(reason);
      res.status(201).json(reason);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
