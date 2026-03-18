import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

// Import routes
import talentRoutes from './routes/talent_routes.js';
import jobRoutes from './routes/job_routes.js';
import matchRoutes from './routes/match_routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
            scriptSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
        },
    },
}));

// Data sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Compression
app.use(compression());

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Debug Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Welcome to African AI Talent Board API',
        version: '1.0.0',
        documentation: `${BASE_URL}/api-docs`,
        endpoints: {
            talents: `${BASE_URL}/api/talents`,
            jobs: `${BASE_URL}/api/jobs`,
            matching: `${BASE_URL}/api/jobs/:jobId/matches`,
        },
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'African AI Talent Board API',
}));

// API Routes
app.use('/api/talents', talentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', matchRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Error Handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🌍 African AI Talent Board API Server Running 🌍   ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📡 Server:        ${BASE_URL}`);
    console.log(`📚 API Docs:      ${BASE_URL}/api-docs`);
    console.log(`❤️  Health Check:  ${BASE_URL}/health`);
    console.log('');
    console.log('Available Endpoints:');
    console.log(`  → POST   /api/talents          - Create talent`);
    console.log(`  → GET    /api/talents          - List talents`);
    console.log(`  → POST   /api/jobs             - Create job`);
    console.log(`  → GET    /api/jobs             - List jobs`);
    console.log(`  → GET    /api/jobs/:id/matches - Get matches`);
    console.log('');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
});

export default app;

