// src/cors.js

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',  // Vite's default frontend URL
  'http://localhost:5173', // Replace with your production Vite URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies and authentication credentials
};

module.exports = cors(corsOptions);
