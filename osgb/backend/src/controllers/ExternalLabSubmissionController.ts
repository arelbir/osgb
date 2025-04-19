import { Request, Response } from 'express';
import AppDataSource from '../../ormconfig';
import { ExternalLabSubmission } from '../models/ExternalLabSubmission';

export class ExternalLabSubmissionController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(ExternalLabSubmission);
      const submissions = await repo.find();
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { protocol_service_id, external_lab_id, submission_date, expected_return_date, return_date, status, notes } = req.body;
      if (!protocol_service_id || !external_lab_id) {
        res.status(400).json({ message: 'protocol_service_id ve external_lab_id zorunludur' });
        return;
      }
      const repo = AppDataSource.getRepository(ExternalLabSubmission);
      const submission = repo.create({
        protocol_service_id,
        external_lab_id,
        submission_date,
        expected_return_date,
        return_date,
        status,
        notes
      });
      await repo.save(submission);
      res.status(201).json(submission);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
