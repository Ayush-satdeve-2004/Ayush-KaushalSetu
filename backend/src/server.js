const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const seedDatabase = require('./seed/seedData');
const apiRoutes = require('./routes/api');
const connectDB = require('./db/connect');

// Load environment variables explicitly from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Cloud Cluster
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auto-seed database on server start
seedDatabase();

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AYUSH KaushalSetu Backend REST API',
    status: 'ONLINE',
    version: '1.0.0',
    sih_problem_statement: 'SIH26044',
    api_base: '/api',
    health: '/health'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AYUSH KaushalSetu Server is running seamlessly.' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`AYUSH KaushalSetu Backend Running on Port ${PORT}`);
  console.log(`Render Production API Base: https://ayushkaushalsetu.onrender.com/api`);
  console.log(`=================================================`);
});
