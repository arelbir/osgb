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
import paymentTypeRoutes from './routes/payment-types';
import examinationTypeRoutes from './routes/examination-types';
import serviceGroupRoutes from './routes/service-groups';
import serviceRoutes from './routes/services';
import sampleStatusRoutes from './routes/sample-statuses';
import sampleRejectionReasonRoutes from './routes/sample-rejection-reasons';
import externalLabRoutes from './routes/external-labs';
import externalLabSubmissionRoutes from './routes/external-lab-submissions';
import cashRegisterRoutes from './routes/cash-registers';
import webResultUserRoutes from './routes/web-result-users';
import { setupSwagger } from './swagger';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: '*', // Gerekirse buraya frontend domainini ekleyebilirsin (örn: ["http://localhost:3000"])
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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
app.use('/api/payment-types', paymentTypeRoutes);
app.use('/api/examination-types', examinationTypeRoutes);
app.use('/api/service-groups', serviceGroupRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/sample-statuses', sampleStatusRoutes);
app.use('/api/sample-rejection-reasons', sampleRejectionReasonRoutes);
app.use('/api/external-labs', externalLabRoutes);
app.use('/api/external-lab-submissions', externalLabSubmissionRoutes);
app.use('/api/cash-registers', cashRegisterRoutes);
app.use('/api/web-result-users', webResultUserRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OSGB API is running' });
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.set('dataSource', AppDataSource); // AppDataSource'u Express app'e ekle
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
