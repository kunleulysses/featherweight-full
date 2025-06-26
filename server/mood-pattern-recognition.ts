/**
 * Mood Pattern Recognition and Proactive Support System
 * 
 * This module implements advanced mood tracking, pattern recognition,
 * and proactive emotional support features for Featherweight.world.
 */

import { storage } from "./storage";
import { generateFlappyContent } from "./venice-ai";
import { emailService } from "./email";
import { ConversationMemory, User } from "@shared/schema";

export interface MoodPattern {
  userId: number;
  pattern: 'weekly_low' | 'stress_spike' | 'consistent_anxiety' | 'positive_trend' | 'emotional_volatility';
  confidence: number; // 0-1 scale
  triggers: string[];
  timeframe: {
    start: Date;
    end: Date;
  };
  recommendations: string[];
}

export interface EmotionalInsight {
  type: 'trend' | 'trigger' | 'breakthrough' | 'concern';
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedResponse?: string;
}

export class MoodPatternRecognition {
  
  /**
   * Analyze user's emotional patterns over time
   */
  static async analyzeUserMoodPatterns(userId: number, daysPast: number = 30): Promise<MoodPattern[]> {
    try {
      // Get recent memories and journal entries
      const memories = await storage.getConversationMemoriesByUser(userId);
      const journalEntries = await storage.getRecentJournalEntries(userId, daysPast);
      
      const patterns: MoodPattern[] = [];
      
      // Analyze for weekly patterns
      const weeklyPattern = await this.detectWeeklyMoodPattern(memories, journalEntries);
      if (weeklyPattern) patterns.push(weeklyPattern);
      
      // Analyze for stress patterns
      const stressPattern = await this.detectStressPatterns(memories, journalEntries);
      if (stressPattern) patterns.push(stressPattern);
      
      // Analyze for positive trends
      const positivePattern = await this.detectPositiveTrends(memories, journalEntries);
      if (positivePattern) patterns.push(positivePattern);
      
      // Analyze for emotional volatility
      const volatilityPattern = await this.detectEmotionalVolatility(memories, journalEntries);
      if (volatilityPattern) patterns.push(volatilityPattern);
      
      return patterns;
    } catch (error) {
      console.error('Error analyzing mood patterns:', error);
      return [];
    }
  }

  /**
   * Detect weekly mood patterns (e.g., Sunday blues, Monday stress)
   */
  private static async detectWeeklyMoodPattern(
    memories: ConversationMemory[], 
    journalEntries: any[]
  ): Promise<MoodPattern | null> {
    const weeklyData: { [key: number]: { negative: number; positive: number; total: number } } = {};
    
    // Initialize weekly data
    for (let i = 0; i < 7; i++) {
      weeklyData[i] = { negative: 0, positive: 0, total: 0 };
    }
    
    // Analyze memories
    memories.forEach(memory => {
      if (memory.emotionalTone) {
        const dayOfWeek = new Date(memory.createdAt).getDay();
        weeklyData[dayOfWeek].total++;
        
        if (['sad', 'anxious', 'frustrated', 'stressed'].includes(memory.emotionalTone)) {
          weeklyData[dayOfWeek].negative++;
        } else if (['happy', 'excited', 'grateful', 'calm'].includes(memory.emotionalTone)) {
          weeklyData[dayOfWeek].positive++;
        }
      }
    });
    
    // Analyze journal entries
    journalEntries.forEach(entry => {
      if (entry.mood) {
        const dayOfWeek = new Date(entry.createdAt).getDay();
        weeklyData[dayOfWeek].total++;
        
        if (['sad', 'frustrated'].includes(entry.mood)) {
          weeklyData[dayOfWeek].negative++;
        } else if (['happy', 'calm'].includes(entry.mood)) {
          weeklyData[dayOfWeek].positive++;
        }
      }
    });
    
    // Find patterns
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let problematicDays: string[] = [];
    let confidence = 0;
    
    Object.entries(weeklyData).forEach(([day, data]) => {
      if (data.total >= 3) { // Minimum data points
        const negativeRatio = data.negative / data.total;
        if (negativeRatio > 0.6) {
          problematicDays.push(dayNames[parseInt(day)]);
          confidence = Math.max(confidence, negativeRatio);
        }
      }
    });
    
    if (problematicDays.length > 0) {
      return {
        userId: memories[0]?.userId || 0,
        pattern: 'weekly_low',
        confidence,
        triggers: problematicDays,
        timeframe: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        recommendations: [
          `Consider planning something positive for ${problematicDays.join(' and ')}`,
          'Prepare self-care strategies for challenging days',
          'Reflect on what makes these days more difficult'
        ]
      };
    }
    
    return null;
  }

  /**
   * Detect stress spike patterns
   */
  private static async detectStressPatterns(
    memories: ConversationMemory[], 
    journalEntries: any[]
  ): Promise<MoodPattern | null> {
    const stressKeywords = ['stress', 'overwhelm', 'pressure', 'deadline', 'anxiety', 'worried', 'panic'];
    const stressEvents: { date: Date; intensity: number; context: string }[] = [];
    
    // Analyze memories for stress indicators
    memories.forEach(memory => {
      const content = memory.content.toLowerCase();
      const stressScore = stressKeywords.reduce((score, keyword) => {
        return score + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (stressScore > 0 || memory.emotionalTone === 'anxious' || memory.emotionalTone === 'stressed') {
        stressEvents.push({
          date: new Date(memory.createdAt),
          intensity: stressScore + (memory.emotionalTone === 'anxious' ? 2 : 0),
          context: memory.topicCategory || 'general'
        });
      }
    });
    
    // Analyze journal entries
    journalEntries.forEach(entry => {
      const content = entry.content.toLowerCase();
      const stressScore = stressKeywords.reduce((score, keyword) => {
        return score + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (stressScore > 0 || entry.mood === 'frustrated') {
        stressEvents.push({
          date: new Date(entry.createdAt),
          intensity: stressScore + (entry.mood === 'frustrated' ? 2 : 0),
          context: entry.tags?.join(', ') || 'general'
        });
      }
    });
    
    if (stressEvents.length >= 3) {
      // Calculate average intensity and identify common triggers
      const avgIntensity = stressEvents.reduce((sum, event) => sum + event.intensity, 0) / stressEvents.length;
      const triggers = [...new Set(stressEvents.map(e => e.context))];
      
      return {
        userId: memories[0]?.userId || 0,
        pattern: 'stress_spike',
        confidence: Math.min(avgIntensity / 5, 1), // Normalize to 0-1
        triggers,
        timeframe: {
          start: new Date(Math.min(...stressEvents.map(e => e.date.getTime()))),
          end: new Date(Math.max(...stressEvents.map(e => e.date.getTime())))
        },
        recommendations: [
          'Consider stress management techniques like deep breathing',
          'Identify and address the root causes of stress',
          'Build in regular breaks and self-care time',
          'Practice mindfulness or meditation'
        ]
      };
    }
    
    return null;
  }

  /**
   * Detect positive trends and growth
   */
  private static async detectPositiveTrends(
    memories: ConversationMemory[], 
    journalEntries: any[]
  ): Promise<MoodPattern | null> {
    const positiveKeywords = ['grateful', 'happy', 'excited', 'proud', 'accomplished', 'breakthrough', 'growth'];
    const positiveEvents: { date: Date; intensity: number }[] = [];
    
    // Analyze memories
    memories.forEach(memory => {
      const content = memory.content.toLowerCase();
      const positiveScore = positiveKeywords.reduce((score, keyword) => {
        return score + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (positiveScore > 0 || ['happy', 'excited', 'grateful'].includes(memory.emotionalTone || '')) {
        positiveEvents.push({
          date: new Date(memory.createdAt),
          intensity: positiveScore + (['happy', 'excited', 'grateful'].includes(memory.emotionalTone || '') ? 2 : 0)
        });
      }
    });
    
    // Analyze journal entries
    journalEntries.forEach(entry => {
      const content = entry.content.toLowerCase();
      const positiveScore = positiveKeywords.reduce((score, keyword) => {
        return score + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (positiveScore > 0 || entry.mood === 'happy') {
        positiveEvents.push({
          date: new Date(entry.createdAt),
          intensity: positiveScore + (entry.mood === 'happy' ? 2 : 0)
        });
      }
    });
    
    if (positiveEvents.length >= 3) {
      // Check if there's an upward trend
      const sortedEvents = positiveEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      const recentEvents = sortedEvents.slice(-5); // Last 5 events
      const avgRecentIntensity = recentEvents.reduce((sum, event) => sum + event.intensity, 0) / recentEvents.length;
      
      if (avgRecentIntensity > 2) {
        return {
          userId: memories[0]?.userId || 0,
          pattern: 'positive_trend',
          confidence: Math.min(avgRecentIntensity / 5, 1),
          triggers: ['personal growth', 'positive experiences'],
          timeframe: {
            start: sortedEvents[0].date,
            end: sortedEvents[sortedEvents.length - 1].date
          },
          recommendations: [
            'Celebrate your progress and positive momentum',
            'Reflect on what\'s contributing to these positive feelings',
            'Consider how to maintain this positive trajectory',
            'Share your wins with others who support you'
          ]
        };
      }
    }
    
    return null;
  }

  /**
   * Detect emotional volatility patterns
   */
  private static async detectEmotionalVolatility(
    memories: ConversationMemory[], 
    journalEntries: any[]
  ): Promise<MoodPattern | null> {
    const emotionalData: { date: Date; tone: string }[] = [];
    
    // Collect emotional data
    memories.forEach(memory => {
      if (memory.emotionalTone) {
        emotionalData.push({
          date: new Date(memory.createdAt),
          tone: memory.emotionalTone
        });
      }
    });
    
    journalEntries.forEach(entry => {
      if (entry.mood) {
        emotionalData.push({
          date: new Date(entry.createdAt),
          tone: entry.mood
        });
      }
    });
    
    if (emotionalData.length >= 5) {
      // Sort by date and analyze for rapid changes
      const sortedData = emotionalData.sort((a, b) => a.date.getTime() - b.date.getTime());
      let volatilityScore = 0;
      
      for (let i = 1; i < sortedData.length; i++) {
        const prev = sortedData[i - 1];
        const curr = sortedData[i];
        
        // Check for emotional swings
        if (this.isEmotionalSwing(prev.tone, curr.tone)) {
          volatilityScore++;
        }
      }
      
      const volatilityRatio = volatilityScore / (sortedData.length - 1);
      
      if (volatilityRatio > 0.4) { // High volatility threshold
        return {
          userId: memories[0]?.userId || 0,
          pattern: 'emotional_volatility',
          confidence: volatilityRatio,
          triggers: ['emotional regulation challenges'],
          timeframe: {
            start: sortedData[0].date,
            end: sortedData[sortedData.length - 1].date
          },
          recommendations: [
            'Consider emotional regulation techniques',
            'Practice mindfulness to increase emotional awareness',
            'Identify triggers for emotional swings',
            'Consider speaking with a mental health professional'
          ]
        };
      }
    }
    
    return null;
  }

  /**
   * Check if two emotional tones represent a significant swing
   */
  private static isEmotionalSwing(tone1: string, tone2: string): boolean {
    const positive = ['happy', 'excited', 'grateful', 'calm'];
    const negative = ['sad', 'anxious', 'frustrated', 'stressed'];
    
    return (positive.includes(tone1) && negative.includes(tone2)) ||
           (negative.includes(tone1) && positive.includes(tone2));
  }

  /**
   * Generate proactive support based on detected patterns
   */
  static async generateProactiveSupport(userId: number): Promise<void> {
    try {
      const patterns = await this.analyzeUserMoodPatterns(userId);
      const user = await storage.getUserById(userId);
      
      if (!user || patterns.length === 0) return;
      
      for (const pattern of patterns) {
        if (pattern.confidence > 0.6) { // High confidence threshold
          await this.sendProactiveSupport(user, pattern);
        }
      }
    } catch (error) {
      console.error('Error generating proactive support:', error);
    }
  }

  /**
   * Send proactive support message based on pattern
   */
  private static async sendProactiveSupport(user: User, pattern: MoodPattern): Promise<void> {
    try {
      let supportMessage = '';
      
      switch (pattern.pattern) {
        case 'weekly_low':
          supportMessage = `I've noticed you tend to have challenging ${pattern.triggers.join(' and ')} days. Would you like to explore some strategies to make these days easier?`;
          break;
        case 'stress_spike':
          supportMessage = `I've been noticing some stress patterns in your recent entries. How are you feeling about everything right now? I'm here if you need support.`;
          break;
        case 'positive_trend':
          supportMessage = `I've been celebrating your recent positive momentum! You seem to be in a really good space lately. What's been contributing to these good feelings?`;
          break;
        case 'emotional_volatility':
          supportMessage = `I've noticed your emotions have been quite varied lately. That's completely normal, but I wanted to check in - how are you feeling about your emotional landscape right now?`;
          break;
      }
      
      if (supportMessage) {
        const flappyResponse = await generateFlappyContent(
          'emailConversation',
          supportMessage,
          {
            username: user.username,
            email: user.email,
            userId: user.id,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined
          }
        );
        
        await emailService.sendFlappyEmail(
          user.email,
          flappyResponse.subject,
          flappyResponse.content,
          'conversation_reply'
        );
        
        console.log(`✅ Sent proactive support to ${user.email} for pattern: ${pattern.pattern}`);
      }
    } catch (error) {
      console.error('Error sending proactive support:', error);
    }
  }

  /**
   * Schedule regular pattern analysis for all users
   */
  static async schedulePatternAnalysis(): Promise<void> {
    try {
      const users = await storage.getAllActiveUsers();
      
      for (const user of users) {
        // Run analysis for each user
        await this.generateProactiveSupport(user.id);
        
        // Add delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`✅ Completed pattern analysis for ${users.length} users`);
    } catch (error) {
      console.error('Error in scheduled pattern analysis:', error);
    }
  }
}

/**
 * Initialize the mood pattern recognition system
 */
export function initializeMoodPatternRecognition(): void {
  console.log('🧠 Initializing Mood Pattern Recognition system...');
  
  // Run pattern analysis every 6 hours
  setInterval(() => {
    MoodPatternRecognition.schedulePatternAnalysis();
  }, 6 * 60 * 60 * 1000);
  
  // Run initial analysis after 5 minutes
  setTimeout(() => {
    MoodPatternRecognition.schedulePatternAnalysis();
  }, 5 * 60 * 1000);
}

