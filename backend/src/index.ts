import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import emailRouter from "./routes/email";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
app.use("/chat", chatRouter);
app.use("/email", emailRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use(errorHandler);

app.listen(PORT, () => {
  logger(`MCP server listening on http://localhost:${PORT}`);
});
