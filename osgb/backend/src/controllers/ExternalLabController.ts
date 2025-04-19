import { Request, Response } from 'express';
import AppDataSource from '../../ormconfig';
import { ExternalLab } from '../models/ExternalLab';

export class ExternalLabController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(ExternalLab);
      const labs = await repo.find();
      res.json(labs);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, address, phone, email, contact_person, is_active } = req.body;
      if (!name) {
        res.status(400).json({ message: 'Name is required' });
        return;
      }
      const repo = AppDataSource.getRepository(ExternalLab);
      const lab = repo.create({
        name,
        address,
        phone,
        email,
        contact_person,
        is_active: is_active !== undefined ? is_active : true
      });
      await repo.save(lab);
      res.status(201).json(lab);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
