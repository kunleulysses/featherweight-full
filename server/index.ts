import express from "express";
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

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // First register main routes which includes auth setup
  const server = await registerRoutes(app);
  
  // Then register conversation routes after auth is configured
  addConversationRoutes(app);
  
  // Add journal analytics routes
  app.post("/api/journal/summary", generateJournalSummary);
  app.post("/api/journal/tags/generate", generateJournalTags);
  app.get("/api/journal/tags", getUserTags);
  app.get("/api/journal/search/tags", searchByTags);
  
  // Start the email processor for background processing of email queue
  startEmailProcessor();
  
  // Start the scheduler for daily inspiration emails
  startEmailScheduler();
  
  // Initialize genius features (commented out for now)
  // startMoodPatternRecognition();
  // startConversationInsights();
  
  console.log('🚀 All Featherweight.world services initialized successfully!');

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Listen on port 5000 for Replit deployment compatibility
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
