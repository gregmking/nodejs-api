const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const customers = require('./routes/customers');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Initialize express app instance
const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/customers', customers);

// Use error handling middleware
app.use(errorHandler);

// Assign port
PORT = process.env.PORT || 8000;

// Start server
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server and exit process
    server.close(() => process.exit(1));
});