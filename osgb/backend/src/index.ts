import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import companyRoutes from './routes/companies';
import protocolRoutes from './routes/protocols';
import labResultRoutes from './routes/lab-results';
import paymentRoutes from './routes/payments';
import { setupSwagger } from './swagger';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/lab-results', labResultRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OSGB API is running' });
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

export default app;
