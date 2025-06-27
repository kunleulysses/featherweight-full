import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { addConversationRoutes } from "./add-conversation-routes";
import { startEmailProcessor } from "./enhanced-email-processor";
import { startEmailScheduler } from "./scheduler";
// import { startMoodPatternRecognition } from "./mood-pattern-recognition";
// import { startConversationInsights } from "./conversation-insights";
import {
  generateJournalSummary,
  generateJournalTags,
  getUserTags,
  searchByTags
} from "./journal-analytics";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files and public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
// Serve the public directory for favicon and other static assets
app.use(express.static(path.join(process.cwd(), 'public')));

// ——————— Request logging middleware ——————————————————————————
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(this, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let line = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (line.length > 80) line = line.slice(0, 79) + "…";
      log(line);
    }
  });

  next();
});
// ————————————————————————————————————————————————

(async () => {
  // 1) Main + auth routes
  const server = await registerRoutes(app);

  // 2) Conversation & analytics
  addConversationRoutes(app);
  app.post("/api/journal/summary",    generateJournalSummary);
  app.post("/api/journal/tags/generate", generateJournalTags);
  app.get( "/api/journal/tags",       getUserTags);
  app.get( "/api/journal/search/tags", searchByTags);

  // 3) Background workers
  startEmailProcessor();
  startEmailScheduler();
  // startMoodPatternRecognition();
  // startConversationInsights();

  log('🚀 All Featherweight.world services initialized successfully!');

  // 4) Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status  = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // ——————— JSON Health & Metrics ————————————————————————
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/consciousness/metrics", (_req, res) => {
    res.json({
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: Date.now(),
    });
  });
  // ————————————————————————————————————————————————

  // 5) Dev vs Prod
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 6) Start HTTP server
  const port = 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
