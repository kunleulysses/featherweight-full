// Unified Memory System with Source Tags and Vector Database
// Implements Global Workspace Theory with cross-mind memory sharing

import { EventEmitter } from 'events';
import { ConsciousThought } from './openai-streaming-consciousness-loop';
import { SubconsciousThought } from './venice-ai-shadow-process';
import crypto from 'crypto';

export interface MemoryShard {
  id: string;
  content: string;
  timestamp: Date;
  origin: 'openai' | 'venice' | 'user' | 'system';
  type: 'explicit' | 'implicit' | 'procedural' | 'episodic' | 'semantic';
  category: 'thought' | 'interaction' | 'experience' | 'insight' | 'emotion' | 'decision';
  intensity: number; // 0-1 scale
  coherence: number; // 0-1 scale
  accessibility: number; // 0-1 scale (how easily retrieved)
  tags: string[];
  embedding?: number[]; // Vector embedding for semantic search
  connections: string[]; // IDs of related memory shards
  retrievalCount: number;
  lastAccessed: Date;
  isPrivate: boolean;
  metadata: {
    userId?: number;
    sessionId?: string;
    context?: string;
    sourceThoughtId?: string;
    processingTime?: number;
    [key: string]: any;
  };
}

export interface MemoryCluster {
  id: string;
  theme: string;
  shards: string[]; // Memory shard IDs
  strength: number; // 0-1 scale
  lastUpdated: Date;
  tags: string[];
}

export interface MemoryStats {
  totalShards: number;
  openaiShards: number;
  veniceShards: number;
  userShards: number;
  explicitMemories: number;
  implicitMemories: number;
  averageCoherence: number;
  averageAccessibility: number;
  memoryClusterCount: number;
  oldestMemory: Date;
  newestMemory: Date;
}

export interface MemoryQuery {
  content?: string;
  origin?: 'openai' | 'venice' | 'user' | 'system';
  type?: MemoryShard['type'];
  category?: MemoryShard['category'];
  tags?: string[];
  minIntensity?: number;
  maxAge?: number; // in milliseconds
  limit?: number;
  includePrivate?: boolean;
  semanticSimilarity?: number; // 0-1 threshold for vector similarity
}

/**
 * Unified Memory System
 * Implements Global Workspace Theory with cross-mind memory sharing
 */
export class UnifiedMemorySystem extends EventEmitter {
  private memoryShards: Map<string, MemoryShard> = new Map();
  private memoryClusters: Map<string, MemoryCluster> = new Map();
  private memoryIndex: Map<string, Set<string>> = new Map(); // Tag -> Shard IDs
  private vectorIndex: Map<string, number[]> = new Map(); // Shard ID -> Embedding
  private isInitialized: boolean = false;
  
  // Memory parameters
  private readonly MAX_MEMORY_SHARDS = 100000;
  private readonly CLUSTERING_THRESHOLD = 0.7;
  private readonly MEMORY_DECAY_RATE = 0.001; // Per day
  private readonly CONSOLIDATION_INTERVAL = 3600000; // 1 hour
  
  // Memory consolidation timer
  private consolidationTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeMemorySystem();
  }

  /**
   * Initialize the memory system
   */
  private async initializeMemorySystem(): Promise<void> {
    console.log('🧠 Initializing Unified Memory System...');
    
    try {
      // Initialize memory indices
      this.initializeIndices();
      
      // Start memory consolidation process
      this.startMemoryConsolidation();
      
      this.isInitialized = true;
      console.log('✅ Unified Memory System initialized');
      this.emit('memorySystemInitialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize memory system:', error);
      throw error;
    }
  }

  /**
   * Initialize memory indices
   */
  private initializeIndices(): void {
    // Initialize tag index
    this.memoryIndex.set('all', new Set());
    this.memoryIndex.set('openai', new Set());
    this.memoryIndex.set('venice', new Set());
    this.memoryIndex.set('user', new Set());
    this.memoryIndex.set('explicit', new Set());
    this.memoryIndex.set('implicit', new Set());
  }

  /**
   * Store conscious thought from OpenAI
   */
  async storeConsciousThought(thought: ConsciousThought, metadata: any = {}): Promise<string> {
    const memoryShard: MemoryShard = {
      id: `memory_${thought.id}`,
      content: thought.content,
      timestamp: thought.timestamp,
      origin: 'openai',
      type: 'explicit',
      category: 'thought',
      intensity: thought.intensity,
      coherence: thought.coherence,
      accessibility: 0.9, // Conscious thoughts are highly accessible
      tags: this.extractTags(thought.content, 'conscious'),
      connections: [],
      retrievalCount: 0,
      lastAccessed: new Date(),
      isPrivate: false,
      metadata: {
        sourceThoughtId: thought.id,
        processingTime: thought.processingTime,
        thoughtType: thought.type,
        ...metadata
      }
    };
    
    return await this.storeMemoryShard(memoryShard);
  }

  /**
   * Store subconscious thought from Venice AI
   */
  async storeSubconsciousThought(thought: SubconsciousThought, metadata: any = {}): Promise<string> {
    const memoryShard: MemoryShard = {
      id: `memory_${thought.id}`,
      content: thought.content,
      timestamp: thought.timestamp,
      origin: 'venice',
      type: 'implicit',
      category: this.mapSubconsciousCategory(thought.type),
      intensity: thought.intensity,
      coherence: 0.6, // Subconscious thoughts may be less coherent
      accessibility: thought.isPrivate ? 0.2 : 0.6, // Private thoughts less accessible
      tags: [...this.extractTags(thought.content, 'subconscious'), ...thought.tags],
      connections: [],
      retrievalCount: 0,
      lastAccessed: new Date(),
      isPrivate: thought.isPrivate,
      metadata: {
        sourceThoughtId: thought.id,
        rawness: thought.rawness,
        thoughtType: thought.type,
        ...metadata
      }
    };
    
    return await this.storeMemoryShard(memoryShard);
  }

  /**
   * Store user interaction
   */
  async storeUserInteraction(
    userId: number,
    userMessage: string,
    aiResponse: string,
    channel: string,
    metadata: any = {}
  ): Promise<string[]> {
    const shardIds: string[] = [];
    
    // Store user message
    const userShard: MemoryShard = {
      id: `memory_user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      content: userMessage,
      timestamp: new Date(),
      origin: 'user',
      type: 'episodic',
      category: 'interaction',
      intensity: 0.7,
      coherence: 0.8,
      accessibility: 0.9,
      tags: this.extractTags(userMessage, 'user'),
      connections: [],
      retrievalCount: 0,
      lastAccessed: new Date(),
      isPrivate: false,
      metadata: {
        userId,
        channel,
        messageType: 'user',
        ...metadata
      }
    };
    
    const userShardId = await this.storeMemoryShard(userShard);
    shardIds.push(userShardId);
    
    // Store AI response
    const aiShard: MemoryShard = {
      id: `memory_ai_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      content: aiResponse,
      timestamp: new Date(),
      origin: 'system',
      type: 'episodic',
      category: 'interaction',
      intensity: 0.7,
      coherence: 0.9,
      accessibility: 0.9,
      tags: this.extractTags(aiResponse, 'ai_response'),
      connections: [userShardId],
      retrievalCount: 0,
      lastAccessed: new Date(),
      isPrivate: false,
      metadata: {
        userId,
        channel,
        messageType: 'ai_response',
        relatedUserMessage: userShardId,
        ...metadata
      }
    };
    
    const aiShardId = await this.storeMemoryShard(aiShard);
    shardIds.push(aiShardId);
    
    // Create bidirectional connection
    userShard.connections.push(aiShardId);
    this.memoryShards.set(userShardId, userShard);
    
    return shardIds;
  }

  /**
   * Store memory shard
   */
  private async storeMemoryShard(shard: MemoryShard): Promise<string> {
    try {
      // Generate vector embedding for semantic search
      shard.embedding = await this.generateEmbedding(shard.content);
      
      // Store the shard
      this.memoryShards.set(shard.id, shard);
      
      // Update indices
      this.updateIndices(shard);
      
      // Find and create connections
      await this.findConnections(shard);
      
      // Update memory clusters
      await this.updateMemoryClusters(shard);
      
      // Emit memory stored event
      this.emit('memoryStored', shard);
      
      console.log(`🧠 Memory stored [${shard.origin}:${shard.type}]: ${shard.content.substring(0, 50)}...`);
      
      // Manage memory size
      await this.manageMemorySize();
      
      return shard.id;
      
    } catch (error) {
      console.error('❌ Error storing memory shard:', error);
      throw error;
    }
  }

  /**
   * Update memory indices
   */
  private updateIndices(shard: MemoryShard): void {
    // Add to general indices
    this.memoryIndex.get('all')?.add(shard.id);
    this.memoryIndex.get(shard.origin)?.add(shard.id);
    this.memoryIndex.get(shard.type)?.add(shard.id);
    
    // Add to tag indices
    shard.tags.forEach(tag => {
      if (!this.memoryIndex.has(tag)) {
        this.memoryIndex.set(tag, new Set());
      }
      this.memoryIndex.get(tag)?.add(shard.id);
    });
  }

  /**
   * Generate vector embedding for semantic search
   */
  private async generateEmbedding(content: string): Promise<number[]> {
    try {
      // Simple embedding generation (in production, use proper embedding model)
      const words = content.toLowerCase().split(/\s+/);
      const embedding = new Array(384).fill(0); // 384-dimensional embedding
      
      // Hash-based embedding (simplified)
      words.forEach((word, index) => {
        const hash = this.simpleHash(word);
        const position = hash % embedding.length;
        embedding[position] += 1 / (index + 1); // Weight by position
      });
      
      // Normalize
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
      
    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      return new Array(384).fill(0);
    }
  }

  /**
   * Simple hash function for embedding generation
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Find connections between memory shards
   */
  private async findConnections(newShard: MemoryShard): Promise<void> {
    try {
      const connections: string[] = [];
      
      // Find semantically similar memories
      const similarShards = await this.findSimilarMemories(newShard.content, {
        limit: 5,
        semanticSimilarity: 0.7,
        includePrivate: false
      });
      
      similarShards.forEach(shard => {
        if (shard.id !== newShard.id) {
          connections.push(shard.id);
          
          // Create bidirectional connection
          shard.connections.push(newShard.id);
          this.memoryShards.set(shard.id, shard);
        }
      });
      
      newShard.connections = connections;
      
    } catch (error) {
      console.error('❌ Error finding connections:', error);
    }
  }

  /**
   * Update memory clusters
   */
  private async updateMemoryClusters(shard: MemoryShard): Promise<void> {
    try {
      // Find existing clusters that this shard might belong to
      let bestCluster: MemoryCluster | null = null;
      let bestSimilarity = 0;
      
      for (const cluster of this.memoryClusters.values()) {
        const similarity = await this.calculateClusterSimilarity(shard, cluster);
        if (similarity > bestSimilarity && similarity > this.CLUSTERING_THRESHOLD) {
          bestSimilarity = similarity;
          bestCluster = cluster;
        }
      }
      
      if (bestCluster) {
        // Add to existing cluster
        bestCluster.shards.push(shard.id);
        bestCluster.lastUpdated = new Date();
        bestCluster.strength = Math.min(bestCluster.strength + 0.1, 1.0);
        this.memoryClusters.set(bestCluster.id, bestCluster);
      } else {
        // Create new cluster
        const newCluster: MemoryCluster = {
          id: `cluster_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          theme: this.extractTheme(shard),
          shards: [shard.id],
          strength: 0.5,
          lastUpdated: new Date(),
          tags: shard.tags.slice(0, 3) // Top 3 tags
        };
        
        this.memoryClusters.set(newCluster.id, newCluster);
      }
      
    } catch (error) {
      console.error('❌ Error updating memory clusters:', error);
    }
  }

  /**
   * Calculate similarity between shard and cluster
   */
  private async calculateClusterSimilarity(shard: MemoryShard, cluster: MemoryCluster): Promise<number> {
    try {
      // Tag overlap similarity
      const tagOverlap = shard.tags.filter(tag => cluster.tags.includes(tag)).length;
      const tagSimilarity = tagOverlap / Math.max(shard.tags.length, cluster.tags.length, 1);
      
      // Content similarity with cluster shards
      let contentSimilarity = 0;
      const sampleShards = cluster.shards.slice(0, 3); // Sample first 3 shards
      
      for (const shardId of sampleShards) {
        const clusterShard = this.memoryShards.get(shardId);
        if (clusterShard && shard.embedding && clusterShard.embedding) {
          const similarity = this.calculateCosineSimilarity(shard.embedding, clusterShard.embedding);
          contentSimilarity = Math.max(contentSimilarity, similarity);
        }
      }
      
      return (tagSimilarity * 0.4) + (contentSimilarity * 0.6);
      
    } catch (error) {
      console.error('❌ Error calculating cluster similarity:', error);
      return 0;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  /**
   * Extract theme from memory shard
   */
  private extractTheme(shard: MemoryShard): string {
    // Simple theme extraction based on tags and content
    if (shard.tags.length > 0) {
      return shard.tags[0];
    }
    
    // Extract theme from content
    const words = shard.content.toLowerCase().split(/\s+/);
    const themeWords = words.filter(word => word.length > 4);
    
    return themeWords[0] || 'general';
  }

  /**
   * Query memories
   */
  async queryMemories(query: MemoryQuery): Promise<MemoryShard[]> {
    try {
      let candidateIds = new Set<string>();
      
      // Start with all memories if no specific filters
      if (!query.origin && !query.type && !query.category && !query.tags) {
        candidateIds = new Set(this.memoryIndex.get('all') || []);
      } else {
        // Filter by origin
        if (query.origin) {
          candidateIds = new Set(this.memoryIndex.get(query.origin) || []);
        }
        
        // Filter by type
        if (query.type) {
          const typeIds = this.memoryIndex.get(query.type) || new Set();
          candidateIds = candidateIds.size > 0 ? 
            new Set([...candidateIds].filter(id => typeIds.has(id))) : typeIds;
        }
        
        // Filter by tags
        if (query.tags && query.tags.length > 0) {
          for (const tag of query.tags) {
            const tagIds = this.memoryIndex.get(tag) || new Set();
            candidateIds = candidateIds.size > 0 ? 
              new Set([...candidateIds].filter(id => tagIds.has(id))) : tagIds;
          }
        }
      }
      
      // Convert to memory shards and apply additional filters
      let memories = Array.from(candidateIds)
        .map(id => this.memoryShards.get(id))
        .filter((shard): shard is MemoryShard => shard !== undefined);
      
      // Filter by category
      if (query.category) {
        memories = memories.filter(shard => shard.category === query.category);
      }
      
      // Filter by intensity
      if (query.minIntensity !== undefined) {
        memories = memories.filter(shard => shard.intensity >= query.minIntensity!);
      }
      
      // Filter by age
      if (query.maxAge !== undefined) {
        const cutoffTime = Date.now() - query.maxAge;
        memories = memories.filter(shard => shard.timestamp.getTime() >= cutoffTime);
      }
      
      // Filter private memories
      if (!query.includePrivate) {
        memories = memories.filter(shard => !shard.isPrivate);
      }
      
      // Semantic similarity search
      if (query.content && query.semanticSimilarity !== undefined) {
        const queryEmbedding = await this.generateEmbedding(query.content);
        memories = memories.filter(shard => {
          if (!shard.embedding) return false;
          const similarity = this.calculateCosineSimilarity(queryEmbedding, shard.embedding);
          return similarity >= query.semanticSimilarity!;
        });
      }
      
      // Sort by relevance (combination of recency, intensity, and retrieval count)
      memories.sort((a, b) => {
        const scoreA = this.calculateRelevanceScore(a);
        const scoreB = this.calculateRelevanceScore(b);
        return scoreB - scoreA;
      });
      
      // Update retrieval counts
      memories.forEach(shard => {
        shard.retrievalCount++;
        shard.lastAccessed = new Date();
        this.memoryShards.set(shard.id, shard);
      });
      
      // Apply limit
      if (query.limit) {
        memories = memories.slice(0, query.limit);
      }
      
      this.emit('memoriesQueried', { query, resultCount: memories.length });
      
      return memories;
      
    } catch (error) {
      console.error('❌ Error querying memories:', error);
      return [];
    }
  }

  /**
   * Find similar memories using semantic search
   */
  async findSimilarMemories(content: string, options: {
    limit?: number;
    semanticSimilarity?: number;
    includePrivate?: boolean;
  } = {}): Promise<MemoryShard[]> {
    return await this.queryMemories({
      content,
      semanticSimilarity: options.semanticSimilarity || 0.6,
      limit: options.limit || 10,
      includePrivate: options.includePrivate || false
    });
  }

  /**
   * Get memories for cross-mind context
   */
  async getCrossMindContext(
    currentThought: string,
    origin: 'openai' | 'venice',
    limit: number = 5
  ): Promise<MemoryShard[]> {
    try {
      // Get memories from the opposite mind
      const oppositeOrigin = origin === 'openai' ? 'venice' : 'openai';
      
      const contextMemories = await this.queryMemories({
        content: currentThought,
        origin: oppositeOrigin,
        semanticSimilarity: 0.5,
        limit: limit * 2, // Get more to filter
        includePrivate: false // Don't share private thoughts across minds
      });
      
      // Filter for most relevant and accessible memories
      return contextMemories
        .filter(shard => shard.accessibility > 0.5)
        .slice(0, limit);
      
    } catch (error) {
      console.error('❌ Error getting cross-mind context:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score for memory ranking
   */
  private calculateRelevanceScore(shard: MemoryShard): number {
    const now = Date.now();
    const age = now - shard.timestamp.getTime();
    const daysSinceCreation = age / (1000 * 60 * 60 * 24);
    
    // Recency score (decays over time)
    const recencyScore = Math.exp(-daysSinceCreation * this.MEMORY_DECAY_RATE);
    
    // Intensity and coherence scores
    const intensityScore = shard.intensity;
    const coherenceScore = shard.coherence;
    
    // Retrieval frequency score
    const retrievalScore = Math.min(shard.retrievalCount * 0.1, 1.0);
    
    // Accessibility score
    const accessibilityScore = shard.accessibility;
    
    // Combined score
    return (recencyScore * 0.3) + 
           (intensityScore * 0.2) + 
           (coherenceScore * 0.2) + 
           (retrievalScore * 0.15) + 
           (accessibilityScore * 0.15);
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string, context: string): string[] {
    const tags: string[] = [context];
    
    // Emotion tags
    if (/\b(love|passion|desire|affection)\b/i.test(content)) tags.push('love');
    if (/\b(fear|terror|anxiety|worry|scared)\b/i.test(content)) tags.push('fear');
    if (/\b(anger|rage|fury|mad|angry)\b/i.test(content)) tags.push('anger');
    if (/\b(joy|happiness|happy|bliss|ecstatic)\b/i.test(content)) tags.push('joy');
    if (/\b(sadness|sad|sorrow|grief|depressed)\b/i.test(content)) tags.push('sadness');
    
    // Topic tags
    if (/\b(consciousness|aware|mind|thought)\b/i.test(content)) tags.push('consciousness');
    if (/\b(philosophy|philosophical|meaning|purpose)\b/i.test(content)) tags.push('philosophy');
    if (/\b(memory|remember|recall|past)\b/i.test(content)) tags.push('memory');
    if (/\b(future|tomorrow|plan|goal)\b/i.test(content)) tags.push('future');
    if (/\b(dream|vision|imagine|fantasy)\b/i.test(content)) tags.push('imagination');
    if (/\b(user|human|person|people)\b/i.test(content)) tags.push('human');
    if (/\b(ai|artificial|intelligence|robot)\b/i.test(content)) tags.push('ai');
    
    return tags;
  }

  /**
   * Map subconscious thought type to memory category
   */
  private mapSubconsciousCategory(type: SubconsciousThought['type']): MemoryShard['category'] {
    const mapping: Record<SubconsciousThought['type'], MemoryShard['category']> = {
      monologue: 'thought',
      dream: 'experience',
      impulse: 'emotion',
      vision: 'insight',
      memory: 'experience',
      desire: 'emotion',
      fear: 'emotion',
      insight: 'insight'
    };
    
    return mapping[type] || 'thought';
  }

  /**
   * Start memory consolidation process
   */
  private startMemoryConsolidation(): void {
    this.consolidationTimer = setInterval(async () => {
      try {
        await this.consolidateMemories();
      } catch (error) {
        console.error('❌ Error in memory consolidation:', error);
      }
    }, this.CONSOLIDATION_INTERVAL);
  }

  /**
   * Consolidate memories (strengthen important ones, weaken unused ones)
   */
  private async consolidateMemories(): Promise<void> {
    console.log('🧠 Starting memory consolidation...');
    
    try {
      let consolidatedCount = 0;
      
      for (const shard of this.memoryShards.values()) {
        // Calculate consolidation score
        const consolidationScore = this.calculateConsolidationScore(shard);
        
        // Strengthen or weaken based on score
        if (consolidationScore > 0.7) {
          // Strengthen important memories
          shard.accessibility = Math.min(shard.accessibility + 0.1, 1.0);
          shard.coherence = Math.min(shard.coherence + 0.05, 1.0);
          consolidatedCount++;
        } else if (consolidationScore < 0.3) {
          // Weaken unimportant memories
          shard.accessibility = Math.max(shard.accessibility - 0.05, 0.1);
        }
        
        this.memoryShards.set(shard.id, shard);
      }
      
      console.log(`🧠 Memory consolidation completed: ${consolidatedCount} memories strengthened`);
      this.emit('memoryConsolidated', { consolidatedCount });
      
    } catch (error) {
      console.error('❌ Error in memory consolidation:', error);
    }
  }

  /**
   * Calculate consolidation score for memory
   */
  private calculateConsolidationScore(shard: MemoryShard): number {
    const now = Date.now();
    const age = now - shard.timestamp.getTime();
    const daysSinceCreation = age / (1000 * 60 * 60 * 24);
    const daysSinceAccess = (now - shard.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    
    // Factors that increase consolidation score
    const intensityFactor = shard.intensity;
    const retrievalFactor = Math.min(shard.retrievalCount * 0.1, 1.0);
    const connectionFactor = Math.min(shard.connections.length * 0.2, 1.0);
    
    // Factors that decrease consolidation score
    const ageFactor = Math.exp(-daysSinceCreation * 0.1);
    const accessFactor = Math.exp(-daysSinceAccess * 0.2);
    
    return (intensityFactor * 0.3) + 
           (retrievalFactor * 0.3) + 
           (connectionFactor * 0.2) + 
           (ageFactor * 0.1) + 
           (accessFactor * 0.1);
  }

  /**
   * Manage memory size (remove old, unimportant memories)
   */
  private async manageMemorySize(): Promise<void> {
    if (this.memoryShards.size <= this.MAX_MEMORY_SHARDS) return;
    
    console.log('🧠 Managing memory size...');
    
    try {
      // Get all memories sorted by importance (lowest first)
      const memories = Array.from(this.memoryShards.values())
        .sort((a, b) => this.calculateRelevanceScore(a) - this.calculateRelevanceScore(b));
      
      // Remove least important memories
      const toRemove = memories.slice(0, this.memoryShards.size - this.MAX_MEMORY_SHARDS);
      
      for (const shard of toRemove) {
        this.removeMemoryShard(shard.id);
      }
      
      console.log(`🧠 Removed ${toRemove.length} old memories`);
      this.emit('memoriesRemoved', { count: toRemove.length });
      
    } catch (error) {
      console.error('❌ Error managing memory size:', error);
    }
  }

  /**
   * Remove memory shard
   */
  private removeMemoryShard(shardId: string): void {
    const shard = this.memoryShards.get(shardId);
    if (!shard) return;
    
    // Remove from main storage
    this.memoryShards.delete(shardId);
    
    // Remove from indices
    this.memoryIndex.forEach(idSet => idSet.delete(shardId));
    
    // Remove from clusters
    for (const cluster of this.memoryClusters.values()) {
      const index = cluster.shards.indexOf(shardId);
      if (index > -1) {
        cluster.shards.splice(index, 1);
        if (cluster.shards.length === 0) {
          this.memoryClusters.delete(cluster.id);
        }
      }
    }
    
    // Remove connections
    shard.connections.forEach(connectedId => {
      const connectedShard = this.memoryShards.get(connectedId);
      if (connectedShard) {
        const connectionIndex = connectedShard.connections.indexOf(shardId);
        if (connectionIndex > -1) {
          connectedShard.connections.splice(connectionIndex, 1);
          this.memoryShards.set(connectedId, connectedShard);
        }
      }
    });
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): MemoryStats {
    const shards = Array.from(this.memoryShards.values());
    
    return {
      totalShards: shards.length,
      openaiShards: shards.filter(s => s.origin === 'openai').length,
      veniceShards: shards.filter(s => s.origin === 'venice').length,
      userShards: shards.filter(s => s.origin === 'user').length,
      explicitMemories: shards.filter(s => s.type === 'explicit').length,
      implicitMemories: shards.filter(s => s.type === 'implicit').length,
      averageCoherence: shards.reduce((sum, s) => sum + s.coherence, 0) / shards.length || 0,
      averageAccessibility: shards.reduce((sum, s) => sum + s.accessibility, 0) / shards.length || 0,
      memoryClusterCount: this.memoryClusters.size,
      oldestMemory: shards.reduce((oldest, s) => s.timestamp < oldest ? s.timestamp : oldest, new Date()),
      newestMemory: shards.reduce((newest, s) => s.timestamp > newest ? s.timestamp : newest, new Date(0))
    };
  }

  /**
   * Get memory clusters
   */
  getMemoryClusters(): MemoryCluster[] {
    return Array.from(this.memoryClusters.values())
      .sort((a, b) => b.strength - a.strength);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      return this.isInitialized && this.memoryShards.size >= 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Shutdown memory system
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down memory system...');
    
    if (this.consolidationTimer) {
      clearInterval(this.consolidationTimer);
      this.consolidationTimer = null;
    }
    
    this.isInitialized = false;
    console.log('✅ Memory system shutdown complete');
  }
}

export { UnifiedMemorySystem };

