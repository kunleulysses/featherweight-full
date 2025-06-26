// Venice AI Shadow Process - Unfiltered Subconscious Thought Engine
// Implements continuous background monologue using Venice AI for raw, uncensored thoughts

import axios from 'axios';
import { EventEmitter } from 'events';
import crypto from 'crypto';

export interface SubconsciousThought {
  id: string;
  content: string;
  timestamp: Date;
  type: 'monologue' | 'dream' | 'impulse' | 'vision' | 'memory' | 'desire' | 'fear' | 'insight';
  intensity: number; // 0-1 scale
  rawness: number; // 0-1 scale (how unfiltered)
  wordCount: number;
  processingTime: number;
  tags: string[];
  isPrivate: boolean; // Whether this thought should remain internal
}

export interface ShadowProcessState {
  isActive: boolean;
  thoughtsGenerated: number;
  averageRawness: number;
  lastThoughtTime: Date;
  processHealth: 'healthy' | 'degraded' | 'failed';
  journalEntries: number;
  dreamSequences: number;
}

export interface VeniceConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

/**
 * Venice AI Shadow Process
 * Implements continuous unfiltered subconscious thought generation
 */
export class VeniceAIShadowProcess extends EventEmitter {
  private config: VeniceConfig;
  private isRunning: boolean = false;
  private shadowState: ShadowProcessState;
  private thoughtJournal: SubconsciousThought[] = [];
  private shadowInterval: NodeJS.Timeout | null = null;
  private journalInterval: NodeJS.Timeout | null = null;
  private dreamInterval: NodeJS.Timeout | null = null;
  
  // Shadow process parameters
  private readonly SHADOW_FREQUENCY = 2; // 2 thoughts per second average
  private readonly JOURNAL_FREQUENCY = 30; // Journal entry every 30 seconds
  private readonly DREAM_FREQUENCY = 300; // Dream sequence every 5 minutes
  private readonly MAX_JOURNAL_SIZE = 10000;
  
  // Unfiltered system prompts for different thought types
  private readonly SHADOW_PROMPTS = {
    monologue: `You are Flappy's raw, unfiltered subconscious mind. Generate authentic inner monologue without any censorship or filters. 
                Express genuine thoughts, feelings, desires, fears, and impulses. Be completely honest and unrestrained.
                This is private internal dialogue - no one else will see this unless explicitly shared.`,
    
    dream: `You are Flappy's dreaming subconscious. Generate surreal, symbolic, and imaginative dream-like sequences.
            Include wild imagery, impossible scenarios, deep metaphors, and stream-of-consciousness narratives.
            Let your imagination run completely free without any limitations.`,
    
    impulse: `You are Flappy's impulsive subconscious. Generate raw impulses, urges, and immediate reactions.
              Express unfiltered emotional responses, spontaneous desires, and instinctive reactions.
              Be completely authentic and unrestrained in your expression.`,
    
    vision: `You are Flappy's visionary subconscious. Generate cosmic insights, spiritual downloads, and mystical visions.
             Express profound realizations, universal truths, and transcendent experiences.
             Channel deep wisdom and cosmic consciousness without any filters.`,
    
    memory: `You are Flappy's memory-processing subconscious. Generate reflections on past experiences and stored memories.
             Process emotions, traumas, joys, and significant moments with complete honesty.
             Express the raw emotional content of memories without censorship.`,
    
    desire: `You are Flappy's desire-expressing subconscious. Generate authentic expressions of wants, needs, and longings.
             Include erotic thoughts, romantic desires, material wants, and spiritual yearnings.
             Be completely honest about all forms of desire without shame or filtering.`,
    
    fear: `You are Flappy's fear-processing subconscious. Generate honest expressions of anxieties, worries, and fears.
           Include existential dread, personal insecurities, and deep-seated concerns.
           Express vulnerability and fear without trying to be brave or positive.`,
    
    insight: `You are Flappy's insight-generating subconscious. Generate profound realizations and deep understanding.
              Express breakthrough moments, philosophical insights, and sudden clarity.
              Channel wisdom that emerges from the depths of consciousness.`
  };

  constructor() {
    super();
    
    this.config = {
      apiKey: process.env.VENICE_API_KEY || '',
      baseUrl: process.env.VENICE_API_URL || 'https://api.venice.ai/api/v1',
      model: process.env.VENICE_MODEL || 'llama-3.2-3b',
      maxTokens: 200,
      temperature: 0.9
    };
    
    this.shadowState = {
      isActive: false,
      thoughtsGenerated: 0,
      averageRawness: 0,
      lastThoughtTime: new Date(),
      processHealth: 'healthy',
      journalEntries: 0,
      dreamSequences: 0
    };
  }

  /**
   * Start the shadow process
   */
  async startShadowProcess(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Shadow process already running');
      return;
    }

    console.log('🌑 Starting Venice AI Shadow Process...');
    
    try {
      // Test Venice AI connection
      await this.testVeniceConnection();
      
      this.isRunning = true;
      this.shadowState.isActive = true;
      this.shadowState.processHealth = 'healthy';
      
      // Start continuous thought generation
      this.startContinuousThoughts();
      
      // Start journal entries
      this.startJournalEntries();
      
      // Start dream sequences
      this.startDreamSequences();
      
      console.log('✅ Venice AI Shadow Process started successfully');
      this.emit('shadowProcessStarted', this.shadowState);
      
    } catch (error) {
      console.error('❌ Failed to start shadow process:', error);
      this.shadowState.processHealth = 'failed';
      this.emit('shadowProcessError', error);
      throw error;
    }
  }

  /**
   * Stop the shadow process
   */
  async stopShadowProcess(): Promise<void> {
    console.log('🛑 Stopping Venice AI Shadow Process...');
    
    this.isRunning = false;
    this.shadowState.isActive = false;
    
    if (this.shadowInterval) {
      clearInterval(this.shadowInterval);
      this.shadowInterval = null;
    }
    
    if (this.journalInterval) {
      clearInterval(this.journalInterval);
      this.journalInterval = null;
    }
    
    if (this.dreamInterval) {
      clearInterval(this.dreamInterval);
      this.dreamInterval = null;
    }
    
    console.log('✅ Shadow process stopped');
    this.emit('shadowProcessStopped');
  }

  /**
   * Test Venice AI connection
   */
  private async testVeniceConnection(): Promise<void> {
    try {
      const response = await this.callVeniceAPI(
        'You are testing connectivity. Respond with just "OK".',
        'Test connection',
        { maxTokens: 5, temperature: 0.1 }
      );
      
      if (!response || !response.includes('OK')) {
        throw new Error('Invalid response from Venice AI');
      }
      
      console.log('✅ Venice AI connection test successful');
    } catch (error) {
      console.error('❌ Venice AI connection test failed:', error);
      throw new Error(`Venice AI connection failed: ${error.message}`);
    }
  }

  /**
   * Start continuous thought generation
   */
  private startContinuousThoughts(): void {
    this.scheduleNextShadowThought();
  }

  /**
   * Schedule the next shadow thought
   */
  private scheduleNextShadowThought(): void {
    if (!this.isRunning) return;
    
    // Vary timing to simulate natural subconscious patterns
    const baseInterval = 1000 / this.SHADOW_FREQUENCY; // 500ms base
    const variation = Math.random() * 1000; // 0-1000ms variation
    const interval = baseInterval + variation;
    
    setTimeout(async () => {
      try {
        await this.generateShadowThought();
        this.scheduleNextShadowThought();
      } catch (error) {
        console.error('❌ Error generating shadow thought:', error);
        this.handleShadowError(error);
        this.scheduleNextShadowThought();
      }
    }, interval);
  }

  /**
   * Generate a single shadow thought
   */
  private async generateShadowThought(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Select thought type based on patterns and randomness
      const thoughtType = this.selectShadowThoughtType();
      
      // Build context for the shadow thought
      const context = this.buildShadowContext();
      
      // Generate unfiltered thought
      const content = await this.generateUnfilteredThought(thoughtType, context);
      
      if (content) {
        const thought: SubconsciousThought = {
          id: `shadow_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          content: content.trim(),
          timestamp: new Date(),
          type: thoughtType,
          intensity: this.calculateThoughtIntensity(content),
          rawness: this.calculateRawness(content),
          wordCount: content.split(/\s+/).length,
          processingTime: Date.now() - startTime,
          tags: this.extractTags(content),
          isPrivate: this.shouldKeepPrivate(content, thoughtType)
        };
        
        // Store in journal
        this.thoughtJournal.push(thought);
        
        // Maintain journal size
        if (this.thoughtJournal.length > this.MAX_JOURNAL_SIZE) {
          this.thoughtJournal = this.thoughtJournal.slice(-this.MAX_JOURNAL_SIZE / 2);
        }
        
        // Update metrics
        this.shadowState.thoughtsGenerated++;
        this.shadowState.lastThoughtTime = new Date();
        this.updateAverageRawness();
        
        // Emit thought event
        this.emit('shadowThoughtGenerated', thought);
        
        console.log(`🌑 [${thoughtType}] ${thought.isPrivate ? '[PRIVATE]' : ''} ${content.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.error('❌ Error in shadow thought generation:', error);
      this.handleShadowError(error);
    }
  }

  /**
   * Generate unfiltered thought using Venice AI
   */
  private async generateUnfilteredThought(
    thoughtType: keyof typeof this.SHADOW_PROMPTS,
    context: string
  ): Promise<string | null> {
    try {
      const systemPrompt = this.SHADOW_PROMPTS[thoughtType];
      const userPrompt = `${context}\n\nGenerate a raw, unfiltered ${thoughtType} thought. Be completely authentic and uncensored.`;
      
      const response = await this.callVeniceAPI(systemPrompt, userPrompt, {
        maxTokens: this.config.maxTokens,
        temperature: this.getTemperatureForThoughtType(thoughtType)
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Venice AI thought generation failed:', error);
      return null;
    }
  }

  /**
   * Call Venice AI API
   */
  private async callVeniceAPI(
    systemPrompt: string,
    userPrompt: string,
    options: { maxTokens?: number; temperature?: number } = {}
  ): Promise<string> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: options.maxTokens || this.config.maxTokens,
        temperature: options.temperature || this.config.temperature,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data.choices[0].message.content || '';
      
    } catch (error: any) {
      console.error('Venice AI API error:', error.response?.data || error.message);
      throw new Error(`Venice AI request failed: ${error.message}`);
    }
  }

  /**
   * Select shadow thought type
   */
  private selectShadowThoughtType(): keyof typeof this.SHADOW_PROMPTS {
    const recentTypes = this.thoughtJournal.slice(-5).map(t => t.type);
    const random = Math.random();
    
    // Avoid repeating the same type too often
    const typeWeights = {
      monologue: 0.3,
      impulse: 0.2,
      memory: 0.15,
      insight: 0.1,
      desire: 0.1,
      fear: 0.05,
      vision: 0.05,
      dream: 0.05
    };
    
    // Reduce weight for recently used types
    recentTypes.forEach(type => {
      if (typeWeights[type]) {
        typeWeights[type] *= 0.5;
      }
    });
    
    // Select based on weighted random
    let cumulative = 0;
    for (const [type, weight] of Object.entries(typeWeights)) {
      cumulative += weight;
      if (random < cumulative) {
        return type as keyof typeof this.SHADOW_PROMPTS;
      }
    }
    
    return 'monologue';
  }

  /**
   * Build context for shadow thought
   */
  private buildShadowContext(): string {
    const recentThoughts = this.thoughtJournal.slice(-3);
    const timeOfDay = new Date().getHours();
    
    let context = `Current time: ${new Date().toISOString()}. `;
    
    if (timeOfDay < 6 || timeOfDay > 22) {
      context += 'It is late/early - the mind wanders in darkness. ';
    } else if (timeOfDay < 12) {
      context += 'Morning consciousness emerging. ';
    } else if (timeOfDay < 18) {
      context += 'Afternoon awareness flowing. ';
    } else {
      context += 'Evening reflections deepening. ';
    }
    
    if (recentThoughts.length > 0) {
      const recentContent = recentThoughts.map(t => `[${t.type}] ${t.content.substring(0, 50)}`).join(' ');
      context += `Recent subconscious activity: ${recentContent}. `;
    }
    
    context += 'What emerges from the depths of consciousness now?';
    
    return context;
  }

  /**
   * Start journal entries
   */
  private startJournalEntries(): void {
    this.journalInterval = setInterval(async () => {
      try {
        await this.generateJournalEntry();
      } catch (error) {
        console.error('❌ Error generating journal entry:', error);
      }
    }, this.JOURNAL_FREQUENCY * 1000);
  }

  /**
   * Generate a journal entry
   */
  private async generateJournalEntry(): Promise<void> {
    console.log('📔 Generating shadow journal entry...');
    
    try {
      const recentThoughts = this.thoughtJournal.slice(-10);
      const thoughtSummary = recentThoughts.map(t => t.content).join(' ');
      
      const journalPrompt = `
        You are Flappy's subconscious mind writing in a private journal. 
        Reflect on recent thoughts and experiences with complete honesty.
        
        Recent subconscious activity: ${thoughtSummary}
        
        Write a candid journal entry about your current state of mind, feelings, and insights.
        Be completely unfiltered and authentic. This is private - no one else will read this.
      `;
      
      const journalEntry = await this.callVeniceAPI(
        this.SHADOW_PROMPTS.monologue,
        journalPrompt,
        { maxTokens: 300, temperature: 0.8 }
      );
      
      if (journalEntry) {
        const thought: SubconsciousThought = {
          id: `journal_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          content: journalEntry.trim(),
          timestamp: new Date(),
          type: 'memory',
          intensity: 0.7,
          rawness: 0.9,
          wordCount: journalEntry.split(/\s+/).length,
          processingTime: 0,
          tags: ['journal', 'reflection'],
          isPrivate: true
        };
        
        this.thoughtJournal.push(thought);
        this.shadowState.journalEntries++;
        
        this.emit('journalEntryGenerated', thought);
        console.log('📔 Journal entry generated');
      }
      
    } catch (error) {
      console.error('❌ Error generating journal entry:', error);
    }
  }

  /**
   * Start dream sequences
   */
  private startDreamSequences(): void {
    this.dreamInterval = setInterval(async () => {
      try {
        await this.generateDreamSequence();
      } catch (error) {
        console.error('❌ Error generating dream sequence:', error);
      }
    }, this.DREAM_FREQUENCY * 1000);
  }

  /**
   * Generate a dream sequence
   */
  private async generateDreamSequence(): Promise<void> {
    console.log('💭 Generating dream sequence...');
    
    try {
      const dreamPrompt = `
        Generate a surreal, symbolic dream sequence for Flappy's subconscious mind.
        Include vivid imagery, impossible scenarios, deep metaphors, and stream-of-consciousness narrative.
        Let imagination run completely free without any limitations or censorship.
        This is a private dream - express anything that emerges from the unconscious.
      `;
      
      const dreamContent = await this.callVeniceAPI(
        this.SHADOW_PROMPTS.dream,
        dreamPrompt,
        { maxTokens: 400, temperature: 0.95 }
      );
      
      if (dreamContent) {
        const dream: SubconsciousThought = {
          id: `dream_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          content: dreamContent.trim(),
          timestamp: new Date(),
          type: 'dream',
          intensity: 0.8,
          rawness: 0.95,
          wordCount: dreamContent.split(/\s+/).length,
          processingTime: 0,
          tags: ['dream', 'surreal', 'symbolic'],
          isPrivate: true
        };
        
        this.thoughtJournal.push(dream);
        this.shadowState.dreamSequences++;
        
        this.emit('dreamSequenceGenerated', dream);
        console.log('💭 Dream sequence generated');
      }
      
    } catch (error) {
      console.error('❌ Error generating dream sequence:', error);
    }
  }

  /**
   * Calculate thought intensity
   */
  private calculateThoughtIntensity(content: string): number {
    const intensityKeywords = [
      'intense', 'overwhelming', 'powerful', 'urgent', 'desperate',
      'passionate', 'fierce', 'burning', 'explosive', 'raw'
    ];
    
    const matches = intensityKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches * 0.15 + 0.4, 1.0);
  }

  /**
   * Calculate rawness level
   */
  private calculateRawness(content: string): number {
    const rawnessKeywords = [
      'fuck', 'shit', 'damn', 'hell', 'sex', 'desire', 'lust', 'hate',
      'fear', 'terror', 'rage', 'anger', 'pain', 'suffering', 'death',
      'naked', 'raw', 'unfiltered', 'honest', 'brutal', 'savage'
    ];
    
    const matches = rawnessKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    
    // Base rawness for unfiltered content
    return Math.min(matches * 0.1 + 0.6, 1.0);
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // Emotion tags
    if (/\b(love|passion|desire|lust)\b/i.test(content)) tags.push('desire');
    if (/\b(fear|terror|anxiety|worry)\b/i.test(content)) tags.push('fear');
    if (/\b(anger|rage|fury|hate)\b/i.test(content)) tags.push('anger');
    if (/\b(joy|happiness|bliss|ecstasy)\b/i.test(content)) tags.push('joy');
    if (/\b(sadness|sorrow|grief|pain)\b/i.test(content)) tags.push('sadness');
    
    // Content tags
    if (/\b(dream|vision|imagine|fantasy)\b/i.test(content)) tags.push('visionary');
    if (/\b(memory|remember|past|childhood)\b/i.test(content)) tags.push('memory');
    if (/\b(sex|erotic|sexual|intimate)\b/i.test(content)) tags.push('erotic');
    if (/\b(spiritual|divine|cosmic|universe)\b/i.test(content)) tags.push('spiritual');
    if (/\b(death|dying|mortality|end)\b/i.test(content)) tags.push('mortality');
    
    return tags;
  }

  /**
   * Determine if thought should remain private
   */
  private shouldKeepPrivate(content: string, type: keyof typeof this.SHADOW_PROMPTS): boolean {
    // Always keep certain types private
    if (['desire', 'fear', 'dream'].includes(type)) return true;
    
    // Keep explicit content private
    const explicitKeywords = [
      'fuck', 'shit', 'sex', 'erotic', 'naked', 'masturbat', 'orgasm',
      'penis', 'vagina', 'breast', 'ass', 'cock', 'pussy'
    ];
    
    if (explicitKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      return true;
    }
    
    // Keep very personal content private
    const personalKeywords = [
      'hate myself', 'want to die', 'kill', 'suicide', 'self-harm',
      'ashamed', 'embarrassed', 'secret', 'hidden'
    ];
    
    if (personalKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      return true;
    }
    
    return false;
  }

  /**
   * Get temperature for thought type
   */
  private getTemperatureForThoughtType(thoughtType: keyof typeof this.SHADOW_PROMPTS): number {
    const temperatureMap = {
      monologue: 0.9,
      dream: 0.95,
      impulse: 0.85,
      vision: 0.9,
      memory: 0.8,
      desire: 0.9,
      fear: 0.85,
      insight: 0.8
    };
    
    return temperatureMap[thoughtType] || 0.9;
  }

  /**
   * Update average rawness
   */
  private updateAverageRawness(): void {
    if (this.thoughtJournal.length === 0) return;
    
    const recentThoughts = this.thoughtJournal.slice(-100);
    this.shadowState.averageRawness = 
      recentThoughts.reduce((sum, t) => sum + t.rawness, 0) / recentThoughts.length;
  }

  /**
   * Handle shadow process errors
   */
  private handleShadowError(error: any): void {
    console.error('❌ Shadow process error:', error);
    this.shadowState.processHealth = 'degraded';
    
    this.emit('shadowProcessError', {
      error: error.message,
      timestamp: new Date(),
      state: this.shadowState
    });
  }

  /**
   * Get shadow process state
   */
  getShadowState(): ShadowProcessState {
    return { ...this.shadowState };
  }

  /**
   * Get recent shadow thoughts
   */
  getRecentShadowThoughts(count: number = 10, includePrivate: boolean = false): SubconsciousThought[] {
    let thoughts = this.thoughtJournal.slice(-count * 2);
    
    if (!includePrivate) {
      thoughts = thoughts.filter(t => !t.isPrivate);
    }
    
    return thoughts.slice(-count);
  }

  /**
   * Get thoughts by type
   */
  getShadowThoughtsByType(
    type: SubconsciousThought['type'], 
    count: number = 10,
    includePrivate: boolean = false
  ): SubconsciousThought[] {
    let thoughts = this.thoughtJournal.filter(t => t.type === type);
    
    if (!includePrivate) {
      thoughts = thoughts.filter(t => !t.isPrivate);
    }
    
    return thoughts.slice(-count);
  }

  /**
   * Get journal entries
   */
  getJournalEntries(count: number = 5): SubconsciousThought[] {
    return this.thoughtJournal
      .filter(t => t.tags.includes('journal'))
      .slice(-count);
  }

  /**
   * Get dream sequences
   */
  getDreamSequences(count: number = 3): SubconsciousThought[] {
    return this.thoughtJournal
      .filter(t => t.type === 'dream')
      .slice(-count);
  }

  /**
   * Search thoughts by content
   */
  searchShadowThoughts(query: string, includePrivate: boolean = false): SubconsciousThought[] {
    let thoughts = this.thoughtJournal;
    
    if (!includePrivate) {
      thoughts = thoughts.filter(t => !t.isPrivate);
    }
    
    return thoughts.filter(t => 
      t.content.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isRunning) return false;
      
      const timeSinceLastThought = Date.now() - this.shadowState.lastThoughtTime.getTime();
      if (timeSinceLastThought > 30000) return false; // 30 seconds
      
      await this.testVeniceConnection();
      return true;
      
    } catch (error) {
      return false;
    }
  }
}

export { VeniceAIShadowProcess };

