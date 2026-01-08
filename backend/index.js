
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Connect to Database
connectDB();

const helmet = require('helmet');
const compression = require('compression');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance Middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
app.use(cors({
    origin: true, // Reflects the request origin
    credentials: true
}));

// Body Parser with payload limits
app.use(express.json({ limit: '10kb' }));

// Logging (Dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
// app.use('/api/insights', require('./routes/insightRoutes')); // Deprecated/Refactored
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Base Routes
app.get('/', (req, res) => {
    res.json({ message: 'FeedTrack API is running', timestamp: new Date() });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Centralized Error Handling
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
