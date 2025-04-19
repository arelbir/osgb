import { Request, Response } from 'express';
import AppDataSource from '../../ormconfig';
import { CashRegister } from '../models/CashRegister';

export class CashRegisterController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(CashRegister);
      const items = await repo.find();
      res.json(items);
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
      const repo = AppDataSource.getRepository(CashRegister);
      const item = repo.create({ name, description });
      await repo.save(item);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
