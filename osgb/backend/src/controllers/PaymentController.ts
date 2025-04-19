import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Payment } from '../models/Payment';
import { Protocol } from '../models/Protocol';
import { PaymentType } from '../models/PaymentType';
import { CashRegister } from '../models/CashRegister';
import { User } from '../models/User';

export class PaymentController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const paymentRepository = AppDataSource.getRepository(Payment);
      
      // Get query parameters for filtering
      const { 
        start_date, 
        end_date, 
        protocol_id, 
        payment_type_id, 
        cash_register_id 
      } = req.query;
      
      // Build query
      let queryBuilder = paymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.protocol', 'protocol')
        .leftJoinAndSelect('protocol.patient', 'patient')
        .leftJoinAndSelect('payment.payment_type', 'payment_type')
        .leftJoinAndSelect('payment.cash_register', 'cash_register')
        .leftJoinAndSelect('payment.created_by_user', 'created_by_user');
      
      // Apply filters if provided
      if (start_date && end_date) {
        queryBuilder = queryBuilder.where(
          'payment.payment_date BETWEEN :start_date AND :end_date',
          { start_date, end_date: new Date(end_date.toString() + 'T23:59:59.999Z') }
        );
      } else if (start_date) {
        queryBuilder = queryBuilder.where(
          'payment.payment_date >= :start_date',
          { start_date }
        );
      } else if (end_date) {
        queryBuilder = queryBuilder.where(
          'payment.payment_date <= :end_date',
          { end_date: new Date(end_date.toString() + 'T23:59:59.999Z') }
        );
      }
      
      if (protocol_id) {
        queryBuilder = queryBuilder.andWhere('payment.protocol_id = :protocol_id', { protocol_id });
      }
      
      if (payment_type_id) {
        queryBuilder = queryBuilder.andWhere('payment.payment_type_id = :payment_type_id', { payment_type_id });
      }
      
      if (cash_register_id) {
        queryBuilder = queryBuilder.andWhere('payment.cash_register_id = :cash_register_id', { cash_register_id });
      }
      
      // Execute query
      const payments = await queryBuilder.getMany();
      
      res.json(payments);
      return;
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const paymentRepository = AppDataSource.getRepository(Payment);
      const payment = await paymentRepository.findOne({
        where: { id: Number(id) },
        relations: [
          'protocol',
          'protocol.patient',
          'payment_type',
          'cash_register',
          'created_by_user'
        ]
      });
      
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      
      res.json(payment);
      return;
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        protocol_id,
        payment_date,
        receipt_number,
        cash_register_id,
        payment_type_id,
        amount,
        description
      } = req.body;
      
      // Validate required fields
      if (!protocol_id || !amount || amount <= 0) {
        res.status(400).json({ message: 'Protocol ID and amount are required' });
        return;
      }
      
      // Find protocol
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocol = await protocolRepository.findOne({
        where: { id: Number(protocol_id) }
      });
      
      if (!protocol) {
        res.status(404).json({ message: 'Protocol not found' });
        return;
      }
      
      // Find payment type if provided
      let paymentType = null;
      if (payment_type_id) {
        const paymentTypeRepository = AppDataSource.getRepository(PaymentType);
        paymentType = await paymentTypeRepository.findOne({
          where: { id: Number(payment_type_id) }
        });
        
        if (!paymentType) {
          res.status(404).json({ message: 'Payment type not found' });
          return;
        }
      }
      
      // Find cash register if provided
      let cashRegister = null;
      if (cash_register_id) {
        const cashRegisterRepository = AppDataSource.getRepository(CashRegister);
        cashRegister = await cashRegisterRepository.findOne({
          where: { id: Number(cash_register_id) }
        });
        
        if (!cashRegister) {
          res.status(404).json({ message: 'Cash register not found' });
          return;
        }
      }
      
      // Create new payment
      const payment = new Payment();
      payment.protocol = protocol;
      payment.protocol_id = protocol.id;
      payment.payment_date = payment_date ? new Date(payment_date) : new Date();
      payment.receipt_number = receipt_number;
      payment.amount = amount;
      payment.description = description;
      
      if (paymentType) {
        payment.payment_type = paymentType;
        payment.payment_type_id = paymentType.id;
      } else {
        payment.payment_type = null;
        payment.payment_type_id = null;
      }
      
      if (cashRegister) {
        payment.cash_register = cashRegister;
        payment.cash_register_id = cashRegister.id;
      } else {
        payment.cash_register = null;
        payment.cash_register_id = null;
      }
      
      if (req.user) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: req.user.id }
        });
        
        if (user) {
          payment.created_by_user = user;
          payment.created_by = user.id;
        }
      }
      
      // Save payment
      const paymentRepository = AppDataSource.getRepository(Payment);
      await paymentRepository.save(payment);
      
      // Update protocol paid amount
      protocol.paid_amount = Number(protocol.paid_amount) + Number(amount);
      await protocolRepository.save(protocol);
      
      res.status(201).json(payment);
      return;
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        payment_date,
        receipt_number,
        cash_register_id,
        payment_type_id,
        amount,
        description
      } = req.body;
      
      // Find payment
      const paymentRepository = AppDataSource.getRepository(Payment);
      const payment = await paymentRepository.findOne({
        where: { id: Number(id) },
        relations: ['protocol']
      });
      
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      
      const oldAmount = payment.amount;
      
      // Update payment type if provided
      if (payment_type_id !== undefined) {
        if (payment_type_id === null) {
          payment.payment_type = null;
          payment.payment_type_id = null;
        } else {
          const paymentTypeRepository = AppDataSource.getRepository(PaymentType);
          const paymentType = await paymentTypeRepository.findOne({
            where: { id: Number(payment_type_id) }
          });
          
          if (!paymentType) {
            res.status(404).json({ message: 'Payment type not found' });
            return;
          }
          
          payment.payment_type = paymentType;
          payment.payment_type_id = paymentType.id;
        }
      } else {
        payment.payment_type = null;
        payment.payment_type_id = null;
      }
      
      // Update cash register if provided
      if (cash_register_id !== undefined) {
        if (cash_register_id === null) {
          payment.cash_register = null;
          payment.cash_register_id = null;
        } else {
          const cashRegisterRepository = AppDataSource.getRepository(CashRegister);
          const cashRegister = await cashRegisterRepository.findOne({
            where: { id: Number(cash_register_id) }
          });
          
          if (!cashRegister) {
            res.status(404).json({ message: 'Cash register not found' });
            return;
          }
          
          payment.cash_register = cashRegister;
          payment.cash_register_id = cashRegister.id;
        }
      } else {
        payment.cash_register = null;
        payment.cash_register_id = null;
      }
      
      // Update other fields
      if (payment_date) payment.payment_date = new Date(payment_date);
      if (receipt_number !== undefined) payment.receipt_number = receipt_number;
      if (description !== undefined) payment.description = description;
      
      // Update amount and protocol paid amount if changed
      if (amount !== undefined && amount !== oldAmount) {
        const protocolRepository = AppDataSource.getRepository(Protocol);
        const protocol = await protocolRepository.findOne({
          where: { id: payment.protocol_id }
        });
        
        if (protocol) {
          protocol.paid_amount = Number(protocol.paid_amount) - Number(oldAmount) + Number(amount);
          await protocolRepository.save(protocol);
        }
        
        payment.amount = amount;
      }
      
      // Save updated payment
      await paymentRepository.save(payment);
      
      res.json(payment);
      return;
    } catch (error) {
      console.error('Update payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const paymentRepository = AppDataSource.getRepository(Payment);
      const payment = await paymentRepository.findOne({
        where: { id: Number(id) },
        relations: ['protocol']
      });
      
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      
      // Update protocol paid amount
      const protocolRepository = AppDataSource.getRepository(Protocol);
      const protocol = await protocolRepository.findOne({
        where: { id: payment.protocol_id }
      });
      
      if (protocol) {
        protocol.paid_amount = Number(protocol.paid_amount) - Number(payment.amount);
        await protocolRepository.save(protocol);
      }
      
      await paymentRepository.remove(payment);
      
      res.status(204).send();
      return;
    } catch (error) {
      console.error('Delete payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
