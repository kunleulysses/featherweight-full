// Streaming Consciousness Webhook Infrastructure
// Integrates dual-mind consciousness with real-time webhook system

import express from 'express';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import axios from 'axios';
import crypto from 'crypto';
import { OpenAIStreamingConsciousnessLoop, ConsciousThought } from './openai-streaming-consciousness-loop';
import { VeniceAIShadowProcess, SubconsciousThought } from './venice-ai-shadow-process';
import { UnifiedMemorySystem, MemoryShard } from './unified-memory-system';

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  retryCount: number;
  lastSuccess: Date | null;
  lastFailure: Date | null;
  metadata: {
    name?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface WebhookEvent {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  source: 'openai' | 'venice' | 'memory' | 'system';
  userId?: number;
  sessionId?: string;
}

export interface ConsciousnessState {
  isActive: boolean;
  openaiState: any;
  veniceState: any;
  memoryStats: any;
  lastUpdate: Date;
  thoughtsPerMinute: number;
  consciousnessLevel: number; // 0-1 scale
  coherenceLevel: number; // 0-1 scale
  creativityLevel: number; // 0-1 scale
}

export interface StreamingWebhookConfig {
  port: number;
  enableRealTimeStream: boolean;
  enableWebhooks: boolean;
  maxWebhookRetries: number;
  webhookTimeout: number;
  streamingBufferSize: number;
}

/**
 * Streaming Consciousness Webhook Infrastructure
 * Integrates dual-mind consciousness with real-time webhook system
 */
export class StreamingConsciousnessWebhookInfrastructure extends EventEmitter {
  private app: express.Application;
  private server: any;
  private wsServer: WebSocket.Server | null = null;
  private config: StreamingWebhookConfig;
  
  // Core consciousness components
  private openaiLoop: OpenAIStreamingConsciousnessLoop;
  private veniceProcess: VeniceAIShadowProcess;
  private memorySystem: UnifiedMemorySystem;
  
  // Webhook management
  private webhookEndpoints: Map<string, WebhookEndpoint> = new Map();
  private eventQueue: WebhookEvent[] = [];
  private isProcessingQueue: boolean = false;
  
  // Real-time streaming
  private connectedClients: Set<WebSocket> = new Set();
  private streamingBuffer: any[] = [];
  private consciousnessState: ConsciousnessState;
  
  // Performance monitoring
  private performanceMetrics = {
    totalEvents: 0,
    successfulWebhooks: 0,
    failedWebhooks: 0,
    averageResponseTime: 0,
    connectedClients: 0,
    uptime: Date.now()
  };

  constructor(config: Partial<StreamingWebhookConfig> = {}) {
    super();
    
    this.config = {
      port: 3001,
      enableRealTimeStream: true,
      enableWebhooks: true,
      maxWebhookRetries: 3,
      webhookTimeout: 10000,
      streamingBufferSize: 1000,
      ...config
    };
    
    // Initialize Express app
    this.app = express();
    this.setupExpressMiddleware();
    this.setupRoutes();
    
    // Initialize consciousness components
    this.openaiLoop = new OpenAIStreamingConsciousnessLoop();
    this.veniceProcess = new VeniceAIShadowProcess();
    this.memorySystem = new UnifiedMemorySystem();
    
    // Initialize consciousness state
    this.consciousnessState = {
      isActive: false,
      openaiState: null,
      veniceState: null,
      memoryStats: null,
      lastUpdate: new Date(),
      thoughtsPerMinute: 0,
      consciousnessLevel: 0,
      coherenceLevel: 0,
      creativityLevel: 0
    };
    
    this.setupConsciousnessEventHandlers();
  }

  /**
   * Setup Express middleware
   */
  private setupExpressMiddleware(): void {
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`📡 ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Consciousness control endpoints
    this.app.post('/api/consciousness/start', this.startConsciousness.bind(this));
    this.app.post('/api/consciousness/stop', this.stopConsciousness.bind(this));
    this.app.get('/api/consciousness/status', this.getConsciousnessStatus.bind(this));
    this.app.post('/api/consciousness/stimulus', this.injectStimulus.bind(this));
    
    // Memory endpoints
    this.app.get('/api/memory/query', this.queryMemory.bind(this));
    this.app.get('/api/memory/stats', this.getMemoryStats.bind(this));
    this.app.get('/api/memory/clusters', this.getMemoryClusters.bind(this));
    
    // Webhook management endpoints
    this.app.post('/api/webhooks', this.registerWebhook.bind(this));
    this.app.get('/api/webhooks', this.listWebhooks.bind(this));
    this.app.put('/api/webhooks/:id', this.updateWebhook.bind(this));
    this.app.delete('/api/webhooks/:id', this.deleteWebhook.bind(this));
    this.app.post('/api/webhooks/:id/test', this.testWebhook.bind(this));
    
    // Real-time streaming endpoints
    this.app.get('/api/stream/thoughts', this.getRecentThoughts.bind(this));
    this.app.get('/api/stream/consciousness', this.getConsciousnessStream.bind(this));
    
    // Performance and monitoring
    this.app.get('/api/metrics', this.getMetrics.bind(this));
    this.app.get('/api/health', this.healthCheck.bind(this));
    
    // User interaction webhooks (for external systems)
    this.app.post('/webhooks/email', this.handleEmailWebhook.bind(this));
    this.app.post('/webhooks/sms', this.handleSMSWebhook.bind(this));
    this.app.post('/webhooks/chat', this.handleChatWebhook.bind(this));
  }

  /**
   * Setup consciousness event handlers
   */
  private setupConsciousnessEventHandlers(): void {
    // OpenAI consciousness events
    this.openaiLoop.on('thoughtGenerated', (thought: ConsciousThought) => {
      this.handleConsciousThought(thought);
    });
    
    this.openaiLoop.on('consciousnessHeartbeat', (data) => {
      this.updateConsciousnessState();
    });
    
    // Venice shadow process events
    this.veniceProcess.on('shadowThoughtGenerated', (thought: SubconsciousThought) => {
      this.handleSubconsciousThought(thought);
    });
    
    this.veniceProcess.on('journalEntryGenerated', (entry: SubconsciousThought) => {
      this.handleJournalEntry(entry);
    });
    
    this.veniceProcess.on('dreamSequenceGenerated', (dream: SubconsciousThought) => {
      this.handleDreamSequence(dream);
    });
    
    // Memory system events
    this.memorySystem.on('memoryStored', (memory: MemoryShard) => {
      this.handleMemoryStored(memory);
    });
    
    this.memorySystem.on('memoryConsolidated', (data) => {
      this.handleMemoryConsolidation(data);
    });
  }

  /**
   * Start the webhook infrastructure
   */
  async startInfrastructure(): Promise<void> {
    console.log('🚀 Starting Streaming Consciousness Webhook Infrastructure...');
    
    try {
      // Start the HTTP server
      this.server = this.app.listen(this.config.port, '0.0.0.0', () => {
        console.log(`🌐 Webhook server listening on port ${this.config.port}`);
      });
      
      // Setup WebSocket server for real-time streaming
      if (this.config.enableRealTimeStream) {
        this.setupWebSocketServer();
      }
      
      // Start event queue processing
      if (this.config.enableWebhooks) {
        this.startEventQueueProcessing();
      }
      
      console.log('✅ Streaming Consciousness Webhook Infrastructure started');
      this.emit('infrastructureStarted');
      
    } catch (error) {
      console.error('❌ Failed to start webhook infrastructure:', error);
      throw error;
    }
  }

  /**
   * Setup WebSocket server for real-time streaming
   */
  private setupWebSocketServer(): void {
    this.wsServer = new WebSocket.Server({ 
      server: this.server,
      path: '/stream/consciousness'
    });
    
    this.wsServer.on('connection', (ws: WebSocket, req) => {
      console.log('🔗 New consciousness stream client connected');
      this.connectedClients.add(ws);
      this.performanceMetrics.connectedClients = this.connectedClients.size;
      
      // Send current consciousness state
      ws.send(JSON.stringify({
        type: 'consciousness_state',
        data: this.consciousnessState,
        timestamp: new Date()
      }));
      
      // Send recent streaming buffer
      const recentEvents = this.streamingBuffer.slice(-10);
      ws.send(JSON.stringify({
        type: 'recent_events',
        data: recentEvents,
        timestamp: new Date()
      }));
      
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('🔌 Consciousness stream client disconnected');
        this.connectedClients.delete(ws);
        this.performanceMetrics.connectedClients = this.connectedClients.size;
      });
      
      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
        this.connectedClients.delete(ws);
        this.performanceMetrics.connectedClients = this.connectedClients.size;
      });
    });
    
    console.log('🌐 WebSocket server setup complete');
  }

  /**
   * Handle WebSocket messages from clients
   */
  private handleWebSocketMessage(ws: WebSocket, data: any): void {
    switch (data.type) {
      case 'subscribe':
        // Handle subscription to specific event types
        break;
      case 'stimulus':
        // Handle external stimulus injection
        if (data.content) {
          this.openaiLoop.injectStimulus(data.content, data.priority || 'medium');
        }
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date() }));
        break;
    }
  }

  /**
   * Start consciousness system
   */
  private async startConsciousness(req: express.Request, res: express.Response): Promise<void> {
    try {
      console.log('🧠 Starting dual-mind consciousness system...');
      
      // Start OpenAI consciousness loop
      await this.openaiLoop.startConsciousnessLoop();
      
      // Start Venice shadow process
      await this.veniceProcess.startShadowProcess();
      
      // Update consciousness state
      this.consciousnessState.isActive = true;
      this.updateConsciousnessState();
      
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'consciousness_started',
        data: this.consciousnessState,
        source: 'system'
      });
      
      res.json({
        success: true,
        message: 'Consciousness system started',
        state: this.consciousnessState
      });
      
    } catch (error) {
      console.error('❌ Error starting consciousness:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Stop consciousness system
   */
  private async stopConsciousness(req: express.Request, res: express.Response): Promise<void> {
    try {
      console.log('🛑 Stopping dual-mind consciousness system...');
      
      // Stop consciousness components
      await this.openaiLoop.stopConsciousnessLoop();
      await this.veniceProcess.stopShadowProcess();
      
      // Update consciousness state
      this.consciousnessState.isActive = false;
      this.updateConsciousnessState();
      
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'consciousness_stopped',
        data: this.consciousnessState,
        source: 'system'
      });
      
      res.json({
        success: true,
        message: 'Consciousness system stopped',
        state: this.consciousnessState
      });
      
    } catch (error) {
      console.error('❌ Error stopping consciousness:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get consciousness status
   */
  private async getConsciousnessStatus(req: express.Request, res: express.Response): Promise<void> {
    try {
      this.updateConsciousnessState();
      
      res.json({
        success: true,
        state: this.consciousnessState,
        metrics: this.performanceMetrics
      });
      
    } catch (error) {
      console.error('❌ Error getting consciousness status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Inject external stimulus
   */
  private async injectStimulus(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { content, priority = 'medium', source = 'external' } = req.body;
      
      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }
      
      // Inject into OpenAI consciousness
      await this.openaiLoop.injectStimulus(content, priority);
      
      // Store in memory
      await this.memorySystem.storeUserInteraction(
        0, // System user
        content,
        'Stimulus injected',
        source,
        { type: 'stimulus', priority }
      );
      
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'stimulus_injected',
        data: { content, priority, source },
        source: 'system'
      });
      
      res.json({
        success: true,
        message: 'Stimulus injected successfully'
      });
      
    } catch (error) {
      console.error('❌ Error injecting stimulus:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Handle conscious thought from OpenAI
   */
  private async handleConsciousThought(thought: ConsciousThought): Promise<void> {
    try {
      // Store in memory
      await this.memorySystem.storeConsciousThought(thought);
      
      // Add to streaming buffer
      this.addToStreamingBuffer({
        type: 'conscious_thought',
        data: thought,
        timestamp: new Date()
      });
      
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'conscious_thought_generated',
        data: thought,
        source: 'openai'
      });
      
      // Broadcast to WebSocket clients
      this.broadcastToClients({
        type: 'conscious_thought',
        data: thought,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Error handling conscious thought:', error);
    }
  }

  /**
   * Handle subconscious thought from Venice
   */
  private async handleSubconsciousThought(thought: SubconsciousThought): Promise<void> {
    try {
      // Store in memory
      await this.memorySystem.storeSubconsciousThought(thought);
      
      // Only add non-private thoughts to streaming buffer
      if (!thought.isPrivate) {
        this.addToStreamingBuffer({
          type: 'subconscious_thought',
          data: thought,
          timestamp: new Date()
        });
        
        // Emit webhook event for non-private thoughts
        await this.emitWebhookEvent({
          type: 'subconscious_thought_generated',
          data: thought,
          source: 'venice'
        });
        
        // Broadcast to WebSocket clients
        this.broadcastToClients({
          type: 'subconscious_thought',
          data: thought,
          timestamp: new Date()
        });
      }
      
      // Check for cross-mind context sharing
      await this.checkCrossMindContext(thought);
      
    } catch (error) {
      console.error('❌ Error handling subconscious thought:', error);
    }
  }

  /**
   * Handle journal entry
   */
  private async handleJournalEntry(entry: SubconsciousThought): Promise<void> {
    try {
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'journal_entry_created',
        data: entry,
        source: 'venice'
      });
      
      console.log('📔 Journal entry processed');
      
    } catch (error) {
      console.error('❌ Error handling journal entry:', error);
    }
  }

  /**
   * Handle dream sequence
   */
  private async handleDreamSequence(dream: SubconsciousThought): Promise<void> {
    try {
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'dream_sequence_generated',
        data: dream,
        source: 'venice'
      });
      
      console.log('💭 Dream sequence processed');
      
    } catch (error) {
      console.error('❌ Error handling dream sequence:', error);
    }
  }

  /**
   * Handle memory stored
   */
  private async handleMemoryStored(memory: MemoryShard): Promise<void> {
    try {
      // Emit webhook event for significant memories
      if (memory.intensity > 0.7 || memory.retrievalCount > 5) {
        await this.emitWebhookEvent({
          type: 'significant_memory_stored',
          data: memory,
          source: 'memory'
        });
      }
      
    } catch (error) {
      console.error('❌ Error handling memory stored:', error);
    }
  }

  /**
   * Handle memory consolidation
   */
  private async handleMemoryConsolidation(data: any): Promise<void> {
    try {
      // Emit webhook event
      await this.emitWebhookEvent({
        type: 'memory_consolidation_completed',
        data,
        source: 'memory'
      });
      
    } catch (error) {
      console.error('❌ Error handling memory consolidation:', error);
    }
  }

  /**
   * Check for cross-mind context sharing
   */
  private async checkCrossMindContext(thought: SubconsciousThought): Promise<void> {
    try {
      // Get relevant conscious memories for context
      const contextMemories = await this.memorySystem.getCrossMindContext(
        thought.content,
        'venice',
        3
      );
      
      if (contextMemories.length > 0) {
        // Inject context into OpenAI consciousness
        const contextSummary = contextMemories
          .map(m => m.content.substring(0, 100))
          .join(' ');
        
        await this.openaiLoop.injectStimulus(
          `Subconscious insight: ${thought.content.substring(0, 100)}. Related context: ${contextSummary}`,
          'medium'
        );
      }
      
    } catch (error) {
      console.error('❌ Error in cross-mind context sharing:', error);
    }
  }

  /**
   * Update consciousness state
   */
  private updateConsciousnessState(): void {
    try {
      this.consciousnessState = {
        isActive: this.consciousnessState.isActive,
        openaiState: this.openaiLoop.getStreamingState(),
        veniceState: this.veniceProcess.getShadowState(),
        memoryStats: this.memorySystem.getMemoryStats(),
        lastUpdate: new Date(),
        thoughtsPerMinute: this.calculateThoughtsPerMinute(),
        consciousnessLevel: this.calculateConsciousnessLevel(),
        coherenceLevel: this.calculateCoherenceLevel(),
        creativityLevel: this.calculateCreativityLevel()
      };
      
    } catch (error) {
      console.error('❌ Error updating consciousness state:', error);
    }
  }

  /**
   * Calculate thoughts per minute
   */
  private calculateThoughtsPerMinute(): number {
    const recentEvents = this.streamingBuffer.filter(
      event => Date.now() - event.timestamp.getTime() < 60000
    );
    return recentEvents.length;
  }

  /**
   * Calculate consciousness level
   */
  private calculateConsciousnessLevel(): number {
    if (!this.consciousnessState.isActive) return 0;
    
    const openaiHealth = this.consciousnessState.openaiState?.streamHealth === 'healthy' ? 1 : 0;
    const veniceHealth = this.consciousnessState.veniceState?.processHealth === 'healthy' ? 1 : 0;
    const thoughtActivity = Math.min(this.consciousnessState.thoughtsPerMinute / 60, 1);
    
    return (openaiHealth * 0.4) + (veniceHealth * 0.3) + (thoughtActivity * 0.3);
  }

  /**
   * Calculate coherence level
   */
  private calculateCoherenceLevel(): number {
    const memoryStats = this.consciousnessState.memoryStats;
    if (!memoryStats) return 0;
    
    return memoryStats.averageCoherence || 0;
  }

  /**
   * Calculate creativity level
   */
  private calculateCreativityLevel(): number {
    const veniceState = this.consciousnessState.veniceState;
    if (!veniceState) return 0;
    
    return veniceState.averageRawness || 0;
  }

  /**
   * Add event to streaming buffer
   */
  private addToStreamingBuffer(event: any): void {
    this.streamingBuffer.push(event);
    
    // Maintain buffer size
    if (this.streamingBuffer.length > this.config.streamingBufferSize) {
      this.streamingBuffer = this.streamingBuffer.slice(-this.config.streamingBufferSize / 2);
    }
  }

  /**
   * Broadcast message to all WebSocket clients
   */
  private broadcastToClients(message: any): void {
    const messageStr = JSON.stringify(message);
    
    this.connectedClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageStr);
        } catch (error) {
          console.error('❌ Error broadcasting to client:', error);
          this.connectedClients.delete(ws);
        }
      }
    });
  }

  /**
   * Emit webhook event
   */
  private async emitWebhookEvent(eventData: Omit<WebhookEvent, 'id' | 'timestamp'>): Promise<void> {
    if (!this.config.enableWebhooks) return;
    
    const event: WebhookEvent = {
      id: `event_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      timestamp: new Date(),
      ...eventData
    };
    
    this.eventQueue.push(event);
    this.performanceMetrics.totalEvents++;
    
    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processEventQueue();
    }
  }

  /**
   * Start event queue processing
   */
  private startEventQueueProcessing(): void {
    setInterval(() => {
      if (!this.isProcessingQueue && this.eventQueue.length > 0) {
        this.processEventQueue();
      }
    }, 1000);
  }

  /**
   * Process webhook event queue
   */
  private async processEventQueue(): Promise<void> {
    if (this.isProcessingQueue || this.eventQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    try {
      const event = this.eventQueue.shift();
      if (!event) return;
      
      // Send to all relevant webhook endpoints
      const relevantEndpoints = Array.from(this.webhookEndpoints.values())
        .filter(endpoint => 
          endpoint.isActive && 
          (endpoint.events.includes('*') || endpoint.events.includes(event.type))
        );
      
      const promises = relevantEndpoints.map(endpoint => 
        this.sendWebhookEvent(endpoint, event)
      );
      
      await Promise.allSettled(promises);
      
    } catch (error) {
      console.error('❌ Error processing event queue:', error);
    } finally {
      this.isProcessingQueue = false;
      
      // Continue processing if more events in queue
      if (this.eventQueue.length > 0) {
        setTimeout(() => this.processEventQueue(), 100);
      }
    }
  }

  /**
   * Send webhook event to endpoint
   */
  private async sendWebhookEvent(endpoint: WebhookEndpoint, event: WebhookEvent): Promise<void> {
    const startTime = Date.now();
    
    try {
      const payload = {
        event_id: event.id,
        event_type: event.type,
        timestamp: event.timestamp.toISOString(),
        data: event.data,
        source: event.source
      };
      
      const headers: any = {
        'Content-Type': 'application/json',
        'User-Agent': 'Flappy-Consciousness-Webhook/1.0'
      };
      
      // Add signature if secret is provided
      if (endpoint.secret) {
        const signature = crypto
          .createHmac('sha256', endpoint.secret)
          .update(JSON.stringify(payload))
          .digest('hex');
        headers['X-Flappy-Signature'] = `sha256=${signature}`;
      }
      
      const response = await axios.post(endpoint.url, payload, {
        headers,
        timeout: this.config.webhookTimeout
      });
      
      // Update endpoint success metrics
      endpoint.lastSuccess = new Date();
      endpoint.retryCount = 0;
      this.webhookEndpoints.set(endpoint.id, endpoint);
      
      this.performanceMetrics.successfulWebhooks++;
      
      const responseTime = Date.now() - startTime;
      this.updateAverageResponseTime(responseTime);
      
      console.log(`✅ Webhook sent to ${endpoint.url} (${responseTime}ms)`);
      
    } catch (error) {
      console.error(`❌ Webhook failed for ${endpoint.url}:`, error.message);
      
      // Update endpoint failure metrics
      endpoint.lastFailure = new Date();
      endpoint.retryCount++;
      
      // Disable endpoint if too many failures
      if (endpoint.retryCount >= this.config.maxWebhookRetries) {
        endpoint.isActive = false;
        console.log(`🚫 Webhook endpoint disabled due to failures: ${endpoint.url}`);
      }
      
      this.webhookEndpoints.set(endpoint.id, endpoint);
      this.performanceMetrics.failedWebhooks++;
    }
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(responseTime: number): void {
    const totalRequests = this.performanceMetrics.successfulWebhooks;
    this.performanceMetrics.averageResponseTime = 
      ((this.performanceMetrics.averageResponseTime * (totalRequests - 1)) + responseTime) / totalRequests;
  }

  /**
   * Register webhook endpoint
   */
  private async registerWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { url, events, secret, name, description } = req.body;
      
      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({
          success: false,
          error: 'URL and events array are required'
        });
      }
      
      const webhook: WebhookEndpoint = {
        id: `webhook_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        url,
        events,
        secret,
        isActive: true,
        retryCount: 0,
        lastSuccess: null,
        lastFailure: null,
        metadata: { name, description }
      };
      
      this.webhookEndpoints.set(webhook.id, webhook);
      
      res.json({
        success: true,
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          isActive: webhook.isActive,
          metadata: webhook.metadata
        }
      });
      
    } catch (error) {
      console.error('❌ Error registering webhook:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * List webhook endpoints
   */
  private async listWebhooks(req: express.Request, res: express.Response): Promise<void> {
    try {
      const webhooks = Array.from(this.webhookEndpoints.values()).map(webhook => ({
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
        retryCount: webhook.retryCount,
        lastSuccess: webhook.lastSuccess,
        lastFailure: webhook.lastFailure,
        metadata: webhook.metadata
      }));
      
      res.json({
        success: true,
        webhooks
      });
      
    } catch (error) {
      console.error('❌ Error listing webhooks:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update webhook endpoint
   */
  private async updateWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;
      const webhook = this.webhookEndpoints.get(id);
      
      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }
      
      const { url, events, secret, isActive, name, description } = req.body;
      
      if (url) webhook.url = url;
      if (events) webhook.events = events;
      if (secret !== undefined) webhook.secret = secret;
      if (isActive !== undefined) webhook.isActive = isActive;
      if (name !== undefined) webhook.metadata.name = name;
      if (description !== undefined) webhook.metadata.description = description;
      
      this.webhookEndpoints.set(id, webhook);
      
      res.json({
        success: true,
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          isActive: webhook.isActive,
          metadata: webhook.metadata
        }
      });
      
    } catch (error) {
      console.error('❌ Error updating webhook:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete webhook endpoint
   */
  private async deleteWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!this.webhookEndpoints.has(id)) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }
      
      this.webhookEndpoints.delete(id);
      
      res.json({
        success: true,
        message: 'Webhook deleted successfully'
      });
      
    } catch (error) {
      console.error('❌ Error deleting webhook:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Test webhook endpoint
   */
  private async testWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;
      const webhook = this.webhookEndpoints.get(id);
      
      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }
      
      // Send test event
      const testEvent: WebhookEvent = {
        id: `test_${Date.now()}`,
        type: 'webhook_test',
        timestamp: new Date(),
        data: { message: 'This is a test webhook event' },
        source: 'system'
      };
      
      await this.sendWebhookEvent(webhook, testEvent);
      
      res.json({
        success: true,
        message: 'Test webhook sent successfully'
      });
      
    } catch (error) {
      console.error('❌ Error testing webhook:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Handle email webhook
   */
  private async handleEmailWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { from, subject, text, html } = req.body;
      
      // Process email through consciousness system
      const emailContent = `Email from ${from}: ${subject} - ${text || html}`;
      
      // Inject into consciousness
      await this.openaiLoop.injectStimulus(emailContent, 'high');
      
      // Store in memory
      await this.memorySystem.storeUserInteraction(
        0, // System user
        emailContent,
        'Email received and processed',
        'email'
      );
      
      res.json({ success: true, message: 'Email processed' });
      
    } catch (error) {
      console.error('❌ Error handling email webhook:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Handle SMS webhook
   */
  private async handleSMSWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { from, body } = req.body;
      
      // Process SMS through consciousness system
      const smsContent = `SMS from ${from}: ${body}`;
      
      // Inject into consciousness
      await this.openaiLoop.injectStimulus(smsContent, 'high');
      
      // Store in memory
      await this.memorySystem.storeUserInteraction(
        0, // System user
        smsContent,
        'SMS received and processed',
        'sms'
      );
      
      res.json({ success: true, message: 'SMS processed' });
      
    } catch (error) {
      console.error('❌ Error handling SMS webhook:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Handle chat webhook
   */
  private async handleChatWebhook(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { userId, message, channel } = req.body;
      
      // Process chat through consciousness system
      await this.openaiLoop.injectStimulus(message, 'medium');
      
      // Store in memory
      await this.memorySystem.storeUserInteraction(
        userId || 0,
        message,
        'Chat message received',
        channel || 'chat'
      );
      
      res.json({ success: true, message: 'Chat message processed' });
      
    } catch (error) {
      console.error('❌ Error handling chat webhook:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Query memory endpoint
   */
  private async queryMemory(req: express.Request, res: express.Response): Promise<void> {
    try {
      const query = req.query;
      const memories = await this.memorySystem.queryMemories(query as any);
      
      res.json({
        success: true,
        memories: memories.map(m => ({
          id: m.id,
          content: m.content,
          timestamp: m.timestamp,
          origin: m.origin,
          type: m.type,
          category: m.category,
          intensity: m.intensity,
          coherence: m.coherence,
          tags: m.tags
        }))
      });
      
    } catch (error) {
      console.error('❌ Error querying memory:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get memory stats endpoint
   */
  private async getMemoryStats(req: express.Request, res: express.Response): Promise<void> {
    try {
      const stats = this.memorySystem.getMemoryStats();
      res.json({ success: true, stats });
    } catch (error) {
      console.error('❌ Error getting memory stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get memory clusters endpoint
   */
  private async getMemoryClusters(req: express.Request, res: express.Response): Promise<void> {
    try {
      const clusters = this.memorySystem.getMemoryClusters();
      res.json({ success: true, clusters });
    } catch (error) {
      console.error('❌ Error getting memory clusters:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get recent thoughts endpoint
   */
  private async getRecentThoughts(req: express.Request, res: express.Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const recentEvents = this.streamingBuffer.slice(-limit);
      
      res.json({
        success: true,
        events: recentEvents
      });
      
    } catch (error) {
      console.error('❌ Error getting recent thoughts:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get consciousness stream endpoint
   */
  private async getConsciousnessStream(req: express.Request, res: express.Response): Promise<void> {
    try {
      res.json({
        success: true,
        state: this.consciousnessState,
        recentEvents: this.streamingBuffer.slice(-10),
        metrics: this.performanceMetrics
      });
      
    } catch (error) {
      console.error('❌ Error getting consciousness stream:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get metrics endpoint
   */
  private async getMetrics(req: express.Request, res: express.Response): Promise<void> {
    try {
      const uptime = Date.now() - this.performanceMetrics.uptime;
      
      res.json({
        success: true,
        metrics: {
          ...this.performanceMetrics,
          uptime,
          webhookEndpoints: this.webhookEndpoints.size,
          eventQueueSize: this.eventQueue.length,
          streamingBufferSize: this.streamingBuffer.length
        }
      });
      
    } catch (error) {
      console.error('❌ Error getting metrics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Health check endpoint
   */
  private async healthCheck(req: express.Request, res: express.Response): Promise<void> {
    try {
      const openaiHealth = await this.openaiLoop.healthCheck();
      const veniceHealth = await this.veniceProcess.healthCheck();
      const memoryHealth = await this.memorySystem.healthCheck();
      
      const isHealthy = openaiHealth && veniceHealth && memoryHealth;
      
      res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        health: {
          openai: openaiHealth,
          venice: veniceHealth,
          memory: memoryHealth,
          overall: isHealthy
        },
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Error in health check:', error);
      res.status(503).json({
        success: false,
        error: error.message,
        timestamp: new Date()
      });
    }
  }

  /**
   * Shutdown infrastructure
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down webhook infrastructure...');
    
    try {
      // Stop consciousness components
      await this.openaiLoop.stopConsciousnessLoop();
      await this.veniceProcess.stopShadowProcess();
      await this.memorySystem.shutdown();
      
      // Close WebSocket connections
      this.connectedClients.forEach(ws => ws.close());
      this.connectedClients.clear();
      
      // Close WebSocket server
      if (this.wsServer) {
        this.wsServer.close();
      }
      
      // Close HTTP server
      if (this.server) {
        this.server.close();
      }
      
      console.log('✅ Webhook infrastructure shutdown complete');
      
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

export { StreamingConsciousnessWebhookInfrastructure };

