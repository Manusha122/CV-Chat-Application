"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./routes/chat"));
const email_1 = __importDefault(require("./routes/email"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
// Enhanced CORS configuration
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Root route
app.get("/", (req, res) => {
    res.json({
        message: "CV Chat API Server",
        version: "2.0.0",
        status: "running",
        endpoints: {
            health: "/health",
            chat: "/chat",
            email: "/email"
        }
    });
});
// API routes
app.use("/chat", chat_1.default);
app.use("/email", email_1.default);
// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    (0, logger_1.logger)(`MCP server listening on http://localhost:${PORT}`);
});
