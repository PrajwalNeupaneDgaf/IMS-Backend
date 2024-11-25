const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const cors = require('./src/cors');
const itemRoutes = require('./src/routes/itemRoutes');
const entityRoutes = require('./src/routes/entityRoutes');
const userRoute = require('./src/routes/UserRoutes')
const salesRoutes = require('./src/routes/Sales')
const dashboardRoutes = require('./src/routes/DashBoardRoutes')

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.use(cors); // Enable CORS for the entire app

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Failed:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api', userRoute);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Function to list all routes
// const listRoutes = (stack, basePath = '') => {
//   const routes = [];
//   stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Routes directly attached to the app
//       const methods = Object.keys(middleware.route.methods)
//         .map((method) => method.toUpperCase())
//         .join(', ');
//       routes.push(`${methods}: ${basePath}${middleware.route.path}`);
//     } else if (middleware.name === 'router' && middleware.handle.stack) {
//       // Nested router
//       const newBasePath = basePath + (middleware.regexp.source.replace(/\\\//g, '/').replace(/\^|\?\(\=\(\.\*\)\|$/, ''));
//       routes.push(...listRoutes(middleware.handle.stack, newBasePath));
//     }
//   });
//   return routes;
// };

// // Log all available routes
// console.log('Available Routes:');
// listRoutes(app._router.stack).forEach((route) => console.log(route));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
