const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const customers = require('./routes/customers');
const projects = require('./routes/projects');
const auth = require('./routes/auth');
const users = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Initialize express app instance
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = expressRateLimit({
    windowMs: 30 * 60 * 1000, // 30 mins
    max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Mount routers
app.use('/api/v1/customers', customers);
app.use('/api/v1/projects', projects);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

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