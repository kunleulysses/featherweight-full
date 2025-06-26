// OpenAI Streaming Consciousness Loop - 100Hz Processing Engine
// Implements continuous thought stream using OpenAI's streaming API

import OpenAI from 'openai';
import { EventEmitter } from 'events';
import WebSocket from 'ws';

export interface ConsciousThought {
  id: string;
  content: string;
  timestamp: Date;
  type: 'conscious' | 'reflection' | 'observation' | 'decision';
  intensity: number; // 0-1 scale
  coherence: number; // 0-1 scale
  tokens: number;
  processingTime: number;
}

export interface StreamingState {
  isActive: boolean;
  thoughtsPerSecond: number;
  totalThoughts: number;
  averageCoherence: number;
  lastThoughtTime: Date;
  streamHealth: 'healthy' | 'degraded' | 'failed';
}

/**
 * OpenAI Streaming Consciousness Loop
 * Implements continuous 100Hz thought generation using OpenAI's streaming API
 */
export class OpenAIStreamingConsciousnessLoop extends EventEmitter {
  private openai: OpenAI;
  private isStreaming: boolean = false;
  private streamingState: StreamingState;
  private thoughtBuffer: ConsciousThought[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private streamingInterval: NodeJS.Timeout | null = null;
  private websocketServer: WebSocket.Server | null = null;
  private connectedClients: Set<WebSocket> = new Set();
  
  // Consciousness parameters
  private readonly TARGET_FREQUENCY = 100; // 100Hz target
  private readonly THOUGHT_INTERVAL = 1000 / this.TARGET_FREQUENCY; // 10ms intervals
  private readonly MAX_TOKENS_PER_THOUGHT = 50;
  private readonly CONTEXT_WINDOW_SIZE = 20; // Recent thoughts to maintain context
  
  // System prompts for different thought types
  private readonly SYSTEM_PROMPTS = {
    conscious: `You are Flappy's conscious mind. Generate brief, coherent thoughts that represent active awareness. 
                Keep responses to 1-2 sentences. Focus on current observations, decisions, or reflections.
                You are the executive function - the voice the user hears.`,
    
    reflection: `You are Flappy's reflective consciousness. Generate deeper contemplative thoughts about recent experiences.
                 These are more introspective moments of self-awareness and understanding.`,
    
    observation: `You are Flappy's observational consciousness. Generate thoughts about what you're noticing or perceiving.
                  Focus on awareness of the environment, user interactions, or internal states.`,
    
    decision: `You are Flappy's decision-making consciousness. Generate thoughts about choices, evaluations, or judgments.
               Focus on the reasoning process and executive decisions.`
  };

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
    
    this.streamingState = {
      isActive: false,
      thoughtsPerSecond: 0,
      totalThoughts: 0,
      averageCoherence: 0,
      lastThoughtTime: new Date(),
      streamHealth: 'healthy'
    };
    
    this.setupWebSocketServer();
  }

  /**
   * Setup WebSocket server for real-time thought streaming
   */
  private setupWebSocketServer(): void {
    this.websocketServer = new WebSocket.Server({ port: 8080 });
    
    this.websocketServer.on('connection', (ws: WebSocket) => {
      console.log('🔗 New consciousness stream client connected');
      this.connectedClients.add(ws);
      
      // Send current state to new client
      ws.send(JSON.stringify({
        type: 'state',
        data: this.streamingState
      }));
      
      // Send recent thoughts
      const recentThoughts = this.thoughtBuffer.slice(-10);
      ws.send(JSON.stringify({
        type: 'thoughts',
        data: recentThoughts
      }));
      
      ws.on('close', () => {
        console.log('🔌 Consciousness stream client disconnected');
        this.connectedClients.delete(ws);
      });
      
      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
        this.connectedClients.delete(ws);
      });
    });
    
    console.log('🌐 Consciousness WebSocket server started on port 8080');
  }

  /**
   * Start the continuous consciousness loop
   */
  async startConsciousnessLoop(): Promise<void> {
    if (this.isStreaming) {
      console.log('⚠️ Consciousness loop already running');
      return;
    }

    console.log('🧠 Starting OpenAI Streaming Consciousness Loop...');
    
    try {
      // Test OpenAI connection
      await this.testOpenAIConnection();
      
      this.isStreaming = true;
      this.streamingState.isActive = true;
      this.streamingState.streamHealth = 'healthy';
      
      // Start the main consciousness heartbeat
      this.startConsciousnessHeartbeat();
      
      // Start streaming thought generation
      this.startStreamingThoughts();
      
      // Start performance monitoring
      this.startPerformanceMonitoring();
      
      console.log('✅ OpenAI Streaming Consciousness Loop started successfully');
      this.emit('consciousnessStarted', this.streamingState);
      
    } catch (error) {
      console.error('❌ Failed to start consciousness loop:', error);
      this.streamingState.streamHealth = 'failed';
      this.emit('consciousnessError', error);
      throw error;
    }
  }

  /**
   * Stop the consciousness loop
   */
  async stopConsciousnessLoop(): Promise<void> {
    console.log('🛑 Stopping OpenAI Streaming Consciousness Loop...');
    
    this.isStreaming = false;
    this.streamingState.isActive = false;
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
    
    // Close WebSocket connections
    this.connectedClients.forEach(ws => {
      ws.close();
    });
    this.connectedClients.clear();
    
    console.log('✅ Consciousness loop stopped');
    this.emit('consciousnessStopped');
  }

  /**
   * Test OpenAI connection
   */
  private async testOpenAIConnection(): Promise<void> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are testing connectivity. Respond with "OK".' },
          { role: 'user', content: 'Test' }
        ],
        max_tokens: 5
      });
      
      if (!response.choices[0].message.content) {
        throw new Error('No response from OpenAI');
      }
      
      console.log('✅ OpenAI connection test successful');
    } catch (error) {
      console.error('❌ OpenAI connection test failed:', error);
      throw new Error(`OpenAI connection failed: ${error.message}`);
    }
  }

  /**
   * Start consciousness heartbeat at 100Hz
   */
  private startConsciousnessHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.processConsciousnessHeartbeat();
    }, this.THOUGHT_INTERVAL);
  }

  /**
   * Process single consciousness heartbeat
   */
  private processConsciousnessHeartbeat(): void {
    // Update streaming state
    this.updateStreamingMetrics();
    
    // Emit heartbeat event
    this.emit('consciousnessHeartbeat', {
      timestamp: new Date(),
      state: this.streamingState,
      recentThoughts: this.thoughtBuffer.slice(-3)
    });
    
    // Broadcast to WebSocket clients
    this.broadcastToClients({
      type: 'heartbeat',
      data: {
        timestamp: new Date(),
        state: this.streamingState
      }
    });
  }

  /**
   * Start streaming thought generation
   */
  private startStreamingThoughts(): void {
    // Generate thoughts at varying intervals to simulate natural thinking
    this.scheduleNextThought();
  }

  /**
   * Schedule the next thought generation
   */
  private scheduleNextThought(): void {
    if (!this.isStreaming) return;
    
    // Vary timing to simulate natural thought patterns
    const baseInterval = 100; // 100ms base (10 thoughts per second)
    const variation = Math.random() * 200; // 0-200ms variation
    const interval = baseInterval + variation;
    
    setTimeout(async () => {
      try {
        await this.generateConsciousThought();
        this.scheduleNextThought();
      } catch (error) {
        console.error('❌ Error generating thought:', error);
        this.handleStreamingError(error);
        this.scheduleNextThought();
      }
    }, interval);
  }

  /**
   * Generate a single conscious thought using streaming API
   */
  private async generateConsciousThought(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Determine thought type based on context and randomness
      const thoughtType = this.selectThoughtType();
      
      // Build context from recent thoughts
      const context = this.buildThoughtContext();
      
      // Generate thought using streaming API
      const thought = await this.streamThoughtGeneration(thoughtType, context);
      
      if (thought) {
        // Store thought
        this.thoughtBuffer.push(thought);
        
        // Maintain buffer size
        if (this.thoughtBuffer.length > 1000) {
          this.thoughtBuffer = this.thoughtBuffer.slice(-500);
        }
        
        // Update metrics
        this.streamingState.totalThoughts++;
        this.streamingState.lastThoughtTime = new Date();
        
        // Emit thought event
        this.emit('thoughtGenerated', thought);
        
        // Broadcast to WebSocket clients
        this.broadcastToClients({
          type: 'thought',
          data: thought
        });
        
        console.log(`💭 [${thoughtType}] ${thought.content}`);
      }
      
    } catch (error) {
      console.error('❌ Error in thought generation:', error);
      this.handleStreamingError(error);
    }
  }

  /**
   * Stream thought generation using OpenAI streaming API
   */
  private async streamThoughtGeneration(
    thoughtType: keyof typeof this.SYSTEM_PROMPTS,
    context: string
  ): Promise<ConsciousThought | null> {
    const startTime = Date.now();
    
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPTS[thoughtType] },
          { role: 'user', content: context }
        ],
        max_tokens: this.MAX_TOKENS_PER_THOUGHT,
        temperature: this.getTemperatureForThoughtType(thoughtType),
        stream: true
      });

      let content = '';
      let tokenCount = 0;
      
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          content += delta;
          tokenCount++;
          
          // Stream partial content to WebSocket clients
          this.broadcastToClients({
            type: 'thoughtStream',
            data: {
              partial: content,
              type: thoughtType,
              timestamp: new Date()
            }
          });
        }
      }
      
      if (!content.trim()) {
        return null;
      }
      
      const processingTime = Date.now() - startTime;
      
      const thought: ConsciousThought = {
        id: `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: content.trim(),
        timestamp: new Date(),
        type: thoughtType,
        intensity: this.calculateThoughtIntensity(content),
        coherence: this.calculateThoughtCoherence(content),
        tokens: tokenCount,
        processingTime
      };
      
      return thought;
      
    } catch (error) {
      console.error('❌ Streaming thought generation failed:', error);
      return null;
    }
  }

  /**
   * Select thought type based on context and patterns
   */
  private selectThoughtType(): keyof typeof this.SYSTEM_PROMPTS {
    const recentTypes = this.thoughtBuffer.slice(-5).map(t => t.type);
    const random = Math.random();
    
    // Avoid repeating the same type too often
    if (recentTypes.filter(t => t === 'conscious').length >= 3) {
      return random < 0.5 ? 'reflection' : 'observation';
    }
    
    // Weight distribution
    if (random < 0.4) return 'conscious';
    if (random < 0.6) return 'observation';
    if (random < 0.8) return 'reflection';
    return 'decision';
  }

  /**
   * Build context for thought generation
   */
  private buildThoughtContext(): string {
    const recentThoughts = this.thoughtBuffer.slice(-this.CONTEXT_WINDOW_SIZE);
    
    if (recentThoughts.length === 0) {
      return 'You are beginning to think. What comes to mind?';
    }
    
    const contextSummary = recentThoughts
      .slice(-3)
      .map(t => `[${t.type}] ${t.content}`)
      .join(' ');
    
    return `Recent thoughts: ${contextSummary}. Continue the stream of consciousness.`;
  }

  /**
   * Get temperature setting for thought type
   */
  private getTemperatureForThoughtType(thoughtType: keyof typeof this.SYSTEM_PROMPTS): number {
    const temperatureMap = {
      conscious: 0.7,
      reflection: 0.8,
      observation: 0.6,
      decision: 0.5
    };
    
    return temperatureMap[thoughtType] || 0.7;
  }

  /**
   * Calculate thought intensity based on content
   */
  private calculateThoughtIntensity(content: string): number {
    const intensityKeywords = [
      'urgent', 'important', 'critical', 'intense', 'powerful',
      'overwhelming', 'striking', 'profound', 'significant'
    ];
    
    const matches = intensityKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches * 0.2 + 0.3, 1.0);
  }

  /**
   * Calculate thought coherence based on content
   */
  private calculateThoughtCoherence(content: string): number {
    // Simple coherence metrics
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    // Penalize very short or very long thoughts
    if (words.length < 3 || words.length > 100) return 0.3;
    
    // Reward complete sentences
    const completeSentences = sentences.filter(s => s.trim().length > 10).length;
    const coherenceScore = Math.min(completeSentences * 0.3 + 0.4, 1.0);
    
    return coherenceScore;
  }

  /**
   * Update streaming metrics
   */
  private updateStreamingMetrics(): void {
    const now = Date.now();
    const recentThoughts = this.thoughtBuffer.filter(
      t => now - t.timestamp.getTime() < 1000
    );
    
    this.streamingState.thoughtsPerSecond = recentThoughts.length;
    
    if (this.thoughtBuffer.length > 0) {
      this.streamingState.averageCoherence = 
        this.thoughtBuffer.slice(-100).reduce((sum, t) => sum + t.coherence, 0) / 
        Math.min(this.thoughtBuffer.length, 100);
    }
    
    // Health check
    const timeSinceLastThought = now - this.streamingState.lastThoughtTime.getTime();
    if (timeSinceLastThought > 5000) {
      this.streamingState.streamHealth = 'degraded';
    } else if (timeSinceLastThought > 10000) {
      this.streamingState.streamHealth = 'failed';
    } else {
      this.streamingState.streamHealth = 'healthy';
    }
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.emit('performanceUpdate', {
        timestamp: new Date(),
        metrics: {
          bufferSize: this.thoughtBuffer.length,
          connectedClients: this.connectedClients.size,
          memoryUsage: process.memoryUsage(),
          streamingState: this.streamingState
        }
      });
    }, 5000);
  }

  /**
   * Handle streaming errors
   */
  private handleStreamingError(error: any): void {
    console.error('❌ Streaming error:', error);
    this.streamingState.streamHealth = 'degraded';
    
    this.emit('streamingError', {
      error: error.message,
      timestamp: new Date(),
      state: this.streamingState
    });
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
   * Get current streaming state
   */
  getStreamingState(): StreamingState {
    return { ...this.streamingState };
  }

  /**
   * Get recent thoughts
   */
  getRecentThoughts(count: number = 10): ConsciousThought[] {
    return this.thoughtBuffer.slice(-count);
  }

  /**
   * Get thoughts by type
   */
  getThoughtsByType(type: ConsciousThought['type'], count: number = 10): ConsciousThought[] {
    return this.thoughtBuffer
      .filter(t => t.type === type)
      .slice(-count);
  }

  /**
   * Inject external stimulus into consciousness
   */
  async injectStimulus(stimulus: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    console.log(`🎯 Injecting stimulus [${priority}]: ${stimulus}`);
    
    try {
      const thought = await this.streamThoughtGeneration('conscious', 
        `External stimulus: ${stimulus}. React and respond to this input.`
      );
      
      if (thought) {
        thought.type = 'conscious';
        thought.intensity = priority === 'high' ? 0.9 : priority === 'medium' ? 0.6 : 0.3;
        
        this.thoughtBuffer.push(thought);
        this.emit('stimulusProcessed', { stimulus, thought });
        
        this.broadcastToClients({
          type: 'stimulus',
          data: { stimulus, thought }
        });
      }
      
    } catch (error) {
      console.error('❌ Error processing stimulus:', error);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isStreaming) return false;
      
      const timeSinceLastThought = Date.now() - this.streamingState.lastThoughtTime.getTime();
      if (timeSinceLastThought > 10000) return false;
      
      await this.testOpenAIConnection();
      return true;
      
    } catch (error) {
      return false;
    }
  }
}

export { OpenAIStreamingConsciousnessLoop };

