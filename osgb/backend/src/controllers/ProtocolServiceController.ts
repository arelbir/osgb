import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { ProtocolService } from '../models/ProtocolService';

export class ProtocolServiceController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(ProtocolService);
      const items = await repo.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { protocol_id, service_id, price } = req.body;
      if (!protocol_id || !service_id) {
        res.status(400).json({ message: 'protocol_id ve service_id zorunludur' });
        return;
      }
      const repo = AppDataSource.getRepository(ProtocolService);
      const item = repo.create({ protocol_id, service_id, price });
      await repo.save(item);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
