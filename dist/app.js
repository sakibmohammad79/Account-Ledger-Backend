"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./app/config");
const routes_1 = __importDefault(require("./routes"));
const ApiNotFoundHandler_1 = require("./app/middlewares/ApiNotFoundHandler");
const GlobalErrorHandler_1 = require("./app/middlewares/GlobalErrorHandler");
const app = (0, express_1.default)();
// Trust proxy (Vercel requirement)
app.set('trust proxy', 1);
// Security
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// Rate limit only API
app.use('/api', (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
}));
// CORS
app.use((0, cors_1.default)({
    origin: config_1.config.app.nodeEnv === 'production'
        ? config_1.config.cors.allowedOrigin
        : 'http://localhost:3000',
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(config_1.config.app.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
// Health
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        environment: config_1.config.app.nodeEnv,
    });
});
// Root
app.get('/', (_req, res) => {
    res.json({
        message: 'WELCOME TO ACCOUNT LEDGER',
        version: '1.0.0',
    });
});
// Routes
app.use('/api/v1', routes_1.default);
// Errors
app.use(ApiNotFoundHandler_1.apiNotFoundHandler);
app.use(GlobalErrorHandler_1.globalErrorHandler);
exports.default = app;
