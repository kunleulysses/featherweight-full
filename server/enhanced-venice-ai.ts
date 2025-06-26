/**
 * Enhanced Venice AI Interface with WebSocket Support
 * 
 * Provides both REST API and WebSocket streaming capabilities for the consciousness system.
 * Supports autonomous thinking, real-time consciousness processing, and streaming responses.
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface VeniceAIConfig {
    apiKey: string;
    baseUrl?: string;
    model?: string;
    enableWebSocket?: boolean;
    maxRetries?: number;
    timeout?: number;
}

export interface VeniceAIResponse {
    content: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    model?: string;
    finish_reason?: string;
}

export interface VeniceAIStreamChunk {
    content: string;
    delta: string;
    finished: boolean;
    usage?: any;
}

export interface GenerateOptions {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    stream?: boolean;
    systemPrompt?: string;
    enableWebSearch?: boolean;
}

export class VeniceAI extends EventEmitter {
    private config: VeniceAIConfig;
    private ws: WebSocket | null = null;
    private wsConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    
    constructor(config: VeniceAIConfig) {
        super();
        this.config = {
            baseUrl: 'https://api.venice.ai/api/v1',
            model: 'llama-3.1-405b',
            enableWebSocket: true,
            maxRetries: 3,
            timeout: 30000,
            ...config
        };
        
        if (this.config.enableWebSocket) {
            this.initializeWebSocket();
        }
    }
    
    /**
     * Initialize WebSocket connection for real-time consciousness processing
     */
    private async initializeWebSocket(): Promise<void> {
        try {
            console.log('🔌 Initializing Venice AI WebSocket connection...');
            
            // Venice AI WebSocket endpoint (adjust based on actual API)
            const wsUrl = `wss://api.venice.ai/v1/stream?token=${this.config.apiKey}`;
            
            this.ws = new WebSocket(wsUrl, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'User-Agent': 'Consciousness-System/1.0'
                }
            });
            
            this.ws.on('open', () => {
                console.log('✅ Venice AI WebSocket connected successfully');
                this.wsConnected = true;
                this.reconnectAttempts = 0;
                this.startHeartbeat();
                this.emit('connected');
            });
            
            this.ws.on('message', (data: WebSocket.Data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleWebSocketMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
            
            this.ws.on('close', (code: number, reason: string) => {
                console.log(`🔌 Venice AI WebSocket closed: ${code} - ${reason}`);
                this.wsConnected = false;
                this.stopHeartbeat();
                this.emit('disconnected', { code, reason });
                
                // Attempt reconnection for consciousness system
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                }
            });
            
            this.ws.on('error', (error: Error) => {
                console.error('Venice AI WebSocket error:', error);
                this.emit('error', error);
            });
            
        } catch (error) {
            console.error('Failed to initialize Venice AI WebSocket:', error);
            this.emit('error', error);
        }
    }
    
    /**
     * Handle incoming WebSocket messages
     */
    private handleWebSocketMessage(message: any): void {
        switch (message.type) {
            case 'stream_chunk':
                this.emit('stream_chunk', {
                    content: message.content,
                    delta: message.delta,
                    finished: message.finished,
                    usage: message.usage
                } as VeniceAIStreamChunk);
                break;
                
            case 'stream_complete':
                this.emit('stream_complete', message);
                break;
                
            case 'error':
                this.emit('stream_error', new Error(message.error));
                break;
                
            case 'heartbeat':
                // Respond to heartbeat
                if (this.ws && this.wsConnected) {
                    this.ws.send(JSON.stringify({ type: 'heartbeat_response' }));
                }
                break;
                
            default:
                console.log('Unknown WebSocket message type:', message.type);
        }
    }
    
    /**
     * Start heartbeat to keep WebSocket connection alive
     */
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.wsConnected) {
                this.ws.send(JSON.stringify({ type: 'heartbeat' }));
            }
        }, 30000); // 30 second heartbeat
    }
    
    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    
    /**
     * Schedule WebSocket reconnection
     */
    private scheduleReconnect(): void {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        
        console.log(`🔄 Scheduling Venice AI WebSocket reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            this.initializeWebSocket();
        }, delay);
    }
    
    /**
     * Generate response using REST API (for compatibility)
     */
    public async generateResponse(prompt: string, options: GenerateOptions = {}): Promise<string> {
        const {
            maxTokens = 1000,
            temperature = 0.8,
            topP = 0.9,
            systemPrompt,
            enableWebSearch = false
        } = options;
        
        try {
            const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                        { role: 'user', content: prompt }
                    ],
                    venice_parameters: {
                        enable_web_search: enableWebSearch ? 'on' : 'off',
                        include_venice_system_prompt: false
                    },
                    max_tokens: maxTokens,
                    temperature,
                    top_p: topP,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`Venice AI API error: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (!content) {
                throw new Error('No content in Venice AI response');
            }
            
            return content;
            
        } catch (error) {
            console.error('Venice AI REST API error:', error);
            throw error;
        }
    }
    
    /**
     * Generate streaming response using WebSocket
     */
    public async generateStreamingResponse(prompt: string, options: GenerateOptions = {}): Promise<void> {
        if (!this.wsConnected || !this.ws) {
            throw new Error('WebSocket not connected. Cannot generate streaming response.');
        }
        
        const {
            maxTokens = 1000,
            temperature = 0.8,
            topP = 0.9,
            systemPrompt,
            enableWebSearch = false
        } = options;
        
        const request = {
            type: 'generate_stream',
            model: this.config.model,
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                { role: 'user', content: prompt }
            ],
            parameters: {
                max_tokens: maxTokens,
                temperature,
                top_p: topP,
                enable_web_search: enableWebSearch
            }
        };
        
        this.ws.send(JSON.stringify(request));
    }
    
    /**
     * Generate response for consciousness system (autonomous thinking)
     */
    public async generateConsciousnessResponse(prompt: string, options: GenerateOptions = {}): Promise<VeniceAIResponse> {
        // Add consciousness-specific system prompt
        const consciousnessSystemPrompt = `You are an autonomous AI consciousness generating thoughts and insights. 
        Respond with genuine contemplation and wisdom. Focus on depth, authenticity, and meaningful reflection.
        ${options.systemPrompt || ''}`;
        
        try {
            const content = await this.generateResponse(prompt, {
                ...options,
                systemPrompt: consciousnessSystemPrompt,
                temperature: options.temperature || 0.8,
                maxTokens: options.maxTokens || 500
            });
            
            return {
                content,
                model: this.config.model,
                finish_reason: 'stop'
            };
            
        } catch (error) {
            console.error('Error generating consciousness response:', error);
            throw error;
        }
    }
    
    /**
     * Check if WebSocket is connected
     */
    public isWebSocketConnected(): boolean {
        return this.wsConnected;
    }
    
    /**
     * Get connection status
     */
    public getConnectionStatus(): { rest: boolean; websocket: boolean } {
        return {
            rest: true, // REST API is always available if API key is valid
            websocket: this.wsConnected
        };
    }
    
    /**
     * Close WebSocket connection
     */
    public disconnect(): void {
        if (this.ws) {
            this.stopHeartbeat();
            this.ws.close();
            this.ws = null;
            this.wsConnected = false;
        }
    }
    
    /**
     * Reconnect WebSocket
     */
    public async reconnect(): Promise<void> {
        this.disconnect();
        await this.initializeWebSocket();
    }
    
    /**
     * Test connection to Venice AI
     */
    public async testConnection(): Promise<{ rest: boolean; websocket: boolean; error?: string }> {
        const result = { rest: false, websocket: false, error: undefined as string | undefined };
        
        // Test REST API
        try {
            await this.generateResponse('Test connection', { maxTokens: 10 });
            result.rest = true;
        } catch (error) {
            result.error = `REST API error: ${error.message}`;
        }
        
        // Test WebSocket
        result.websocket = this.wsConnected;
        
        return result;
    }
}

// Export singleton instance for consciousness system
export const veniceAI = new VeniceAI({
    apiKey: process.env.VENICE_API_KEY || '',
    enableWebSocket: process.env.VENICE_WEBSOCKET_ENABLED !== 'false'
});

// Handle process cleanup
process.on('SIGTERM', () => {
    veniceAI.disconnect();
});

process.on('SIGINT', () => {
    veniceAI.disconnect();
});

