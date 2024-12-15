const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors'); // Import the CORS package
const statisticsRoutes = require('./routes/statistics');



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all origins (or restrict it to specific origins in production)
app.use(cors());  // Allow all origins for now (you can restrict this later, e.g. app.use(cors({ origin: 'http://localhost:3001' })))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);  // This ensures your routes are available under /api
app.use('/api', statisticsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
