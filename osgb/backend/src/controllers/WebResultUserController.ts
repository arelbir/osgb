import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { WebResultUser } from '../models/WebResultUser';

export class WebResultUserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(WebResultUser);
      const items = await repo.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, patient_id } = req.body;
      if (!username || !password || !patient_id) {
        res.status(400).json({ message: 'username, password ve patient_id zorunludur' });
        return;
      }
      const repo = AppDataSource.getRepository(WebResultUser);
      const item = repo.create({ username, password, patient_id });
      await repo.save(item);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
