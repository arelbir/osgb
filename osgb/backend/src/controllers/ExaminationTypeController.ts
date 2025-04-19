import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ExaminationType } from '../models/ExaminationType';

export class ExaminationTypeController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(ExaminationType);
      const types = await repo.find();
      res.json(types);
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
      const repo = AppDataSource.getRepository(ExaminationType);
      const type = repo.create({ name, description });
      await repo.save(type);
      res.status(201).json(type);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
