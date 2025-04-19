const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/groups', require('./routes/groups'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Health Tracker API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});