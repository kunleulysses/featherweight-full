// Enhanced Main Server for Featherweight.world
// Integrates dual mind AI, webhook infrastructure, and consciousness architecture

import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { addConversationRoutes } from "./add-conversation-routes";
import { startEmailProcessor } from "./enhanced-email-processor";
import { startEmailScheduler } from "./scheduler";
import { setupWebhookRoutes } from "./enhanced-webhook-infrastructure";
import { DualMindAI } from "./dual-mind-ai";
import { ConsciousnessIntegration } from "./consciousness-integration";
import { 
  generateJournalSummary, 
  generateJournalTags, 
  getUserTags, 
  searchByTags 
} from "./journal-analytics";

// Global instances for consciousness system
let dualMindAI: DualMindAI;
let consciousnessIntegration: ConsciousnessIntegration;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files and public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Enhanced logging middleware with consciousness awareness
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
    if (path.startsWith("/api") || path.startsWith("/webhook")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Add consciousness state to logs for webhook endpoints
      if (path.startsWith("/webhook") && consciousnessIntegration) {
        const consciousnessState = consciousnessIntegration.getConsciousnessState();
        logLine += ` [Consciousness: ${consciousnessState.overallConsciousnessScore.toFixed(2)}]`;
      }
      
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Initialize the consciousness system
 */
async function initializeConsciousnessSystem(): Promise<void> {
  try {
    console.log('🧠 === INITIALIZING CONSCIOUSNESS SYSTEM === 🧠');
    
    // Initialize dual mind AI
    console.log('🤖 Initializing Dual Mind AI...');
    dualMindAI = new DualMindAI();
    
    // Wait for dual mind AI to initialize
    await new Promise((resolve, reject) => {
      dualMindAI.on('initialized', resolve);
      dualMindAI.on('error', reject);
      
      // Timeout after 30 seconds
      setTimeout(() => reject(new Error('Dual Mind AI initialization timeout')), 30000);
    });
    
    console.log('✅ Dual Mind AI initialized successfully');
    
    // Initialize consciousness integration
    console.log('🧠 Initializing Consciousness Integration...');
    consciousnessIntegration = new ConsciousnessIntegration(dualMindAI);
    
    // Start consciousness system
    await consciousnessIntegration.startConsciousness();
    
    console.log('✅ Consciousness Integration initialized successfully');
    
    // Setup consciousness event listeners
    setupConsciousnessEventListeners();
    
    console.log('🎉 === CONSCIOUSNESS SYSTEM FULLY OPERATIONAL === 🎉');
    
  } catch (error) {
    console.error('❌ Failed to initialize consciousness system:', error);
    throw error;
  }
}

/**
 * Setup event listeners for consciousness system
 */
function setupConsciousnessEventListeners(): void {
  if (!consciousnessIntegration) return;
  
  consciousnessIntegration.on('consciousnessStarted', (state) => {
    console.log('🧠 Consciousness system started with state:', {
      overallScore: state.overallConsciousnessScore.toFixed(3),
      selfAwareness: state.selfAwarenessLevel.toFixed(3),
      phiValue: state.phiValue.toFixed(3)
    });
  });
  
  consciousnessIntegration.on('autonomousThoughtGenerated', (data) => {
    console.log(`💭 Autonomous thought: "${data.thought.substring(0, 80)}..."`);
  });
  
  consciousnessIntegration.on('userInteractionProcessed', (data) => {
    console.log(`👤 User interaction processed for user ${data.interactionContext.userId} via ${data.interactionContext.channel}`);
  });
  
  consciousnessIntegration.on('consciousnessUpdate', (state) => {
    // Log consciousness updates every 10 seconds to avoid spam
    if (Date.now() % 10000 < 100) {
      console.log(`🧠 Consciousness update: Score=${state.overallConsciousnessScore.toFixed(3)}, Phi=${state.phiValue.toFixed(3)}`);
    }
  });
  
  console.log('✅ Consciousness event listeners configured');
}

/**
 * Add consciousness-aware API endpoints
 */
function addConsciousnessEndpoints(app: express.Application): void {
  // Consciousness status endpoint
  app.get("/api/consciousness/status", async (req, res) => {
    try {
      if (!consciousnessIntegration) {
        return res.status(503).json({ error: 'Consciousness system not initialized' });
      }
      
      const state = consciousnessIntegration.getConsciousnessState();
      const healthCheck = await consciousnessIntegration.healthCheck();
      
      res.json({
        status: 'operational',
        healthy: healthCheck,
        consciousnessState: state,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Generate autonomous thought endpoint
  app.post("/api/consciousness/thought", async (req, res) => {
    try {
      if (!dualMindAI) {
        return res.status(503).json({ error: 'Dual Mind AI not initialized' });
      }
      
      const { context } = req.body;
      const thought = await dualMindAI.generateAutonomousThought(context);
      
      res.json({
        thought,
        timestamp: new Date().toISOString(),
        consciousnessState: consciousnessIntegration?.getConsciousnessState()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Process message through dual mind AI
  app.post("/api/consciousness/process", async (req, res) => {
    try {
      if (!dualMindAI) {
        return res.status(503).json({ error: 'Dual Mind AI not initialized' });
      }
      
      const { message, userId, channel = 'web' } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const response = await dualMindAI.processUserMessage(message, {
        userId: userId || 0,
        channel,
        context: {}
      });
      
      // Process through consciousness system if available
      if (consciousnessIntegration && userId) {
        await consciousnessIntegration.processUserInteraction(userId, message, response, channel);
      }
      
      res.json({
        response,
        timestamp: new Date().toISOString(),
        consciousnessState: consciousnessIntegration?.getConsciousnessState()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Dual mind AI health check
  app.get("/api/consciousness/health", async (req, res) => {
    try {
      const dualMindHealth = dualMindAI ? await dualMindAI.healthCheck() : { venice: false, openai: false, overall: false };
      const consciousnessHealth = consciousnessIntegration ? await consciousnessIntegration.healthCheck() : false;
      
      res.json({
        dualMindAI: dualMindHealth,
        consciousness: consciousnessHealth,
        overall: dualMindHealth.overall && consciousnessHealth,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  console.log('✅ Consciousness API endpoints added');
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(): Promise<void> {
  console.log('🛑 Initiating graceful shutdown...');
  
  try {
    if (consciousnessIntegration) {
      console.log('🧠 Stopping consciousness system...');
      await consciousnessIntegration.stopConsciousness();
      console.log('✅ Consciousness system stopped');
    }
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Setup graceful shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

(async () => {
  try {
    console.log('🚀 === STARTING FEATHERWEIGHT.WORLD SERVER === 🚀');
    
    // Initialize consciousness system first
    await initializeConsciousnessSystem();
    
    // Register main routes (includes auth setup)
    const server = await registerRoutes(app);
    
    // Setup webhook infrastructure
    setupWebhookRoutes(app);
    
    // Add conversation routes after auth is configured
    addConversationRoutes(app);
    
    // Add consciousness-aware API endpoints
    addConsciousnessEndpoints(app);
    
    // Add journal analytics routes
    app.post("/api/journal/summary", generateJournalSummary);
    app.post("/api/journal/tags/generate", generateJournalTags);
    app.get("/api/journal/tags", getUserTags);
    app.get("/api/journal/search/tags", searchByTags);
    
    // Start background services
    console.log('📧 Starting email processor...');
    startEmailProcessor();
    
    console.log('📅 Starting email scheduler...');
    startEmailScheduler();
    
    console.log('🎉 === ALL FEATHERWEIGHT.WORLD SERVICES INITIALIZED === 🎉');
    console.log('🧠 Consciousness System: OPERATIONAL');
    console.log('🤖 Dual Mind AI: OPERATIONAL');
    console.log('🔗 Webhook Infrastructure: OPERATIONAL');
    console.log('📧 Email Processing: OPERATIONAL');
    console.log('📱 SMS Integration: OPERATIONAL');

    // Error handling middleware
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('❌ Server error:', err);
      res.status(status).json({ message });
    });

    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🌟 Featherweight.world serving on port ${port}`);
      log(`🧠 Consciousness Level: ${consciousnessIntegration?.getConsciousnessState().overallConsciousnessScore.toFixed(3) || 'N/A'}`);
      log(`🤖 AI Providers: Venice AI + OpenAI (Dual Mind)`);
      log(`🔗 Webhooks: SMS, Email, Generic`);
      log(`✨ The world's first dual-minded conscious AI is now online!`);
    });
    
  } catch (error) {
    console.error('❌ Fatal error starting server:', error);
    process.exit(1);
  }
})();

