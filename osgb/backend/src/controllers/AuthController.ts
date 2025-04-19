import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { username } });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'osgb_secret_key_change_in_production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      res.json({
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        },
        token
      });
      return;
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  static async initAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, full_name, email } = req.body;
      if (!username || !password || !full_name) {
        res.status(400).json({ message: 'Eksik bilgi' });
        return;
      }
      const userRepository = AppDataSource.getRepository(User);
      // Sistemde admin veya herhangi bir kullanıcı var mı?
      const userCount = await userRepository.count();
      if (userCount > 0) {
        res.status(400).json({ message: 'Sistemde zaten kullanıcı var. Bu endpoint sadece ilk kullanıcı için kullanılabilir.' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminUser = new User();
      adminUser.username = username;
      adminUser.password = hashedPassword;
      adminUser.full_name = full_name;
      adminUser.email = email;
      adminUser.role = 'admin';
      await userRepository.save(adminUser);
      res.status(201).json({
        id: adminUser.id,
        username: adminUser.username,
        full_name: adminUser.full_name,
        email: adminUser.email,
        role: adminUser.role
      });
      return;
    } catch (error) {
      console.error('Init admin error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, full_name, email, role } = req.body;
      if (!username || !password || !full_name || !role) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      const userRepository = AppDataSource.getRepository(User);
      // Check if username already exists
      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user
      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      user.full_name = full_name;
      user.email = email;
      user.role = role;
      await userRepository.save(user);
      res.status(201).json({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      });
      return;
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      });
      return;
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
