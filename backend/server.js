const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Allows us to accept JSON data in the body

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});