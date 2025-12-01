import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', authRoutes);
app.use('/', accountRoutes);

// Error handler
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  let retries = 5;
  while (retries > 0) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected successfully');
      break;
    } catch (error: any) {
      retries--;
      console.log(`Database connection failed. Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Error during initialization:', error);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

