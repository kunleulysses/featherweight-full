/**
 * Conversation Insights and Thematic Analysis
 * 
 * This module provides deep insights into user conversations, identifying themes,
 * emotional patterns, and generating meaningful summaries and connections.
 */

import { storage } from "./storage";
import { generateFlappyContent } from "./venice-ai";
import { ConversationMemory, JournalEntry } from "@shared/schema";

export interface ConversationTheme {
  name: string;
  frequency: number;
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
  keywords: string[];
  relatedEntries: number[];
  insights: string[];
  firstMention: Date;
  lastMention: Date;
}

export interface EmotionalArc {
  timeframe: {
    start: Date;
    end: Date;
  };
  overallTrend: 'improving' | 'declining' | 'stable' | 'volatile';
  keyMoments: {
    date: Date;
    type: 'breakthrough' | 'setback' | 'milestone' | 'turning_point';
    description: string;
    entryId?: number;
  }[];
  emotionalDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ConversationInsight {
  type: 'pattern' | 'growth' | 'concern' | 'achievement' | 'connection';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  relatedThemes: string[];
  timeframe: {
    start: Date;
    end: Date;
  };
}

export class ConversationInsights {
  
  /**
   * Analyze conversation themes across all user interactions
   */
  static async analyzeConversationThemes(userId: number, daysPast: number = 90): Promise<ConversationTheme[]> {
    try {
      const memories = await storage.getConversationMemoriesByUser(userId);
      const journalEntries = await storage.getRecentJournalEntries(userId, daysPast);
      
      // Combine all text content for analysis
      const allContent = [
        ...memories.map(m => ({ content: m.content, date: m.createdAt, id: m.id, type: 'memory' })),
        ...journalEntries.map(j => ({ content: j.content, date: j.createdAt, id: j.id, type: 'journal' }))
      ];
      
      if (allContent.length === 0) return [];
      
      // Use AI to identify themes
      const themeAnalysisPrompt = `Analyze the following conversation and journal content to identify recurring themes. 

Content to analyze:
${allContent.map(item => `[${item.date.toISOString().split('T')[0]}] ${item.content.substring(0, 200)}...`).join('\n\n')}

Identify 5-8 major themes that appear across multiple entries. For each theme, provide:
1. Theme name (2-3 words)
2. Key emotional tone (positive/neutral/negative/mixed)
3. 3-5 relevant keywords
4. Brief insight about this theme

Format as JSON array:
[
  {
    "name": "Work Stress",
    "emotionalTone": "negative",
    "keywords": ["deadline", "pressure", "overwhelmed", "boss", "project"],
    "insight": "Work-related stress appears to be a recurring challenge, often triggered by deadlines and high expectations."
  }
]`;

      const aiResponse = await generateFlappyContent(
        'journalResponse',
        themeAnalysisPrompt,
        {
          username: 'system',
          email: 'system@featherweight.world',
          userId: userId
        }
      );

      let aiThemes: any[] = [];
      try {
        aiThemes = JSON.parse(aiResponse.content);
      } catch (parseError) {
        console.warn('Failed to parse AI theme analysis, using fallback');
        aiThemes = this.extractThemesFallback(allContent);
      }

      // Process AI themes into full ConversationTheme objects
      const themes: ConversationTheme[] = [];
      
      for (const aiTheme of aiThemes) {
        const relatedEntries = this.findRelatedEntries(allContent, aiTheme.keywords || []);
        const dates = relatedEntries.map(entry => entry.date);
        
        themes.push({
          name: aiTheme.name || 'Unknown Theme',
          frequency: relatedEntries.length,
          emotionalTone: aiTheme.emotionalTone || 'neutral',
          keywords: aiTheme.keywords || [],
          relatedEntries: relatedEntries.map(entry => entry.id),
          insights: [aiTheme.insight || 'No insight available'],
          firstMention: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date(),
          lastMention: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date()
        });
      }
      
      return themes.sort((a, b) => b.frequency - a.frequency);
    } catch (error) {
      console.error('Error analyzing conversation themes:', error);
      return [];
    }
  }

  /**
   * Fallback theme extraction using keyword analysis
   */
  private static extractThemesFallback(content: any[]): any[] {
    const commonThemes = [
      {
        name: "Work Life",
        keywords: ["work", "job", "career", "boss", "colleague", "deadline", "project"],
        emotionalTone: "mixed"
      },
      {
        name: "Relationships",
        keywords: ["friend", "family", "partner", "relationship", "love", "conflict"],
        emotionalTone: "mixed"
      },
      {
        name: "Personal Growth",
        keywords: ["growth", "learn", "improve", "goal", "habit", "change"],
        emotionalTone: "positive"
      },
      {
        name: "Health & Wellness",
        keywords: ["health", "exercise", "sleep", "tired", "energy", "wellness"],
        emotionalTone: "neutral"
      },
      {
        name: "Stress & Anxiety",
        keywords: ["stress", "anxiety", "worried", "overwhelmed", "pressure"],
        emotionalTone: "negative"
      }
    ];

    return commonThemes.filter(theme => {
      const matches = this.findRelatedEntries(content, theme.keywords);
      return matches.length >= 2;
    });
  }

  /**
   * Find entries related to specific keywords
   */
  private static findRelatedEntries(content: any[], keywords: string[]): any[] {
    return content.filter(entry => {
      const text = entry.content.toLowerCase();
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  /**
   * Generate emotional arc analysis
   */
  static async generateEmotionalArc(userId: number, daysPast: number = 90): Promise<EmotionalArc | null> {
    try {
      const memories = await storage.getConversationMemoriesByUser(userId);
      const journalEntries = await storage.getRecentJournalEntries(userId, daysPast);
      
      // Combine and sort by date
      const emotionalData = [
        ...memories.filter(m => m.emotionalTone).map(m => ({
          date: m.createdAt,
          tone: m.emotionalTone!,
          content: m.content,
          id: m.id,
          type: 'memory'
        })),
        ...journalEntries.filter(j => j.mood).map(j => ({
          date: j.createdAt,
          tone: j.mood!,
          content: j.content,
          id: j.id,
          type: 'journal'
        }))
      ].sort((a, b) => a.date.getTime() - b.date.getTime());

      if (emotionalData.length < 3) return null;

      // Calculate emotional distribution
      const distribution = { positive: 0, neutral: 0, negative: 0 };
      const positiveEmotions = ['happy', 'excited', 'grateful', 'calm', 'proud'];
      const negativeEmotions = ['sad', 'anxious', 'frustrated', 'stressed', 'angry'];

      emotionalData.forEach(data => {
        if (positiveEmotions.includes(data.tone)) {
          distribution.positive++;
        } else if (negativeEmotions.includes(data.tone)) {
          distribution.negative++;
        } else {
          distribution.neutral++;
        }
      });

      // Determine overall trend
      const recentData = emotionalData.slice(-10); // Last 10 entries
      const earlyData = emotionalData.slice(0, 10); // First 10 entries
      
      const recentPositiveRatio = recentData.filter(d => positiveEmotions.includes(d.tone)).length / recentData.length;
      const earlyPositiveRatio = earlyData.filter(d => positiveEmotions.includes(d.tone)).length / earlyData.length;
      
      let overallTrend: 'improving' | 'declining' | 'stable' | 'volatile' = 'stable';
      
      if (recentPositiveRatio > earlyPositiveRatio + 0.2) {
        overallTrend = 'improving';
      } else if (recentPositiveRatio < earlyPositiveRatio - 0.2) {
        overallTrend = 'declining';
      } else {
        // Check for volatility
        const emotionalSwings = this.countEmotionalSwings(emotionalData);
        if (emotionalSwings / emotionalData.length > 0.3) {
          overallTrend = 'volatile';
        }
      }

      // Identify key moments
      const keyMoments = await this.identifyKeyMoments(emotionalData);

      return {
        timeframe: {
          start: emotionalData[0].date,
          end: emotionalData[emotionalData.length - 1].date
        },
        overallTrend,
        keyMoments,
        emotionalDistribution: {
          positive: distribution.positive / emotionalData.length,
          neutral: distribution.neutral / emotionalData.length,
          negative: distribution.negative / emotionalData.length
        }
      };
    } catch (error) {
      console.error('Error generating emotional arc:', error);
      return null;
    }
  }

  /**
   * Count emotional swings in the data
   */
  private static countEmotionalSwings(emotionalData: any[]): number {
    let swings = 0;
    const positiveEmotions = ['happy', 'excited', 'grateful', 'calm', 'proud'];
    const negativeEmotions = ['sad', 'anxious', 'frustrated', 'stressed', 'angry'];

    for (let i = 1; i < emotionalData.length; i++) {
      const prev = emotionalData[i - 1];
      const curr = emotionalData[i];
      
      const prevIsPositive = positiveEmotions.includes(prev.tone);
      const currIsPositive = positiveEmotions.includes(curr.tone);
      const prevIsNegative = negativeEmotions.includes(prev.tone);
      const currIsNegative = negativeEmotions.includes(curr.tone);
      
      if ((prevIsPositive && currIsNegative) || (prevIsNegative && currIsPositive)) {
        swings++;
      }
    }
    
    return swings;
  }

  /**
   * Identify key emotional moments
   */
  private static async identifyKeyMoments(emotionalData: any[]): Promise<EmotionalArc['keyMoments']> {
    const keyMoments: EmotionalArc['keyMoments'] = [];
    const positiveEmotions = ['happy', 'excited', 'grateful', 'calm', 'proud'];
    const negativeEmotions = ['sad', 'anxious', 'frustrated', 'stressed', 'angry'];
    
    // Look for significant emotional shifts
    for (let i = 1; i < emotionalData.length; i++) {
      const prev = emotionalData[i - 1];
      const curr = emotionalData[i];
      
      // Breakthrough: negative to positive
      if (negativeEmotions.includes(prev.tone) && positiveEmotions.includes(curr.tone)) {
        keyMoments.push({
          date: curr.date,
          type: 'breakthrough',
          description: `Emotional shift from ${prev.tone} to ${curr.tone}`,
          entryId: curr.id
        });
      }
      
      // Setback: positive to negative
      if (positiveEmotions.includes(prev.tone) && negativeEmotions.includes(curr.tone)) {
        keyMoments.push({
          date: curr.date,
          type: 'setback',
          description: `Emotional shift from ${prev.tone} to ${curr.tone}`,
          entryId: curr.id
        });
      }
    }
    
    // Look for milestones (sustained positive periods)
    let positiveStreak = 0;
    for (const data of emotionalData) {
      if (positiveEmotions.includes(data.tone)) {
        positiveStreak++;
        if (positiveStreak === 5) { // 5 consecutive positive entries
          keyMoments.push({
            date: data.date,
            type: 'milestone',
            description: 'Sustained positive emotional period',
            entryId: data.id
          });
        }
      } else {
        positiveStreak = 0;
      }
    }
    
    return keyMoments.slice(0, 10); // Limit to 10 key moments
  }

  /**
   * Generate comprehensive conversation insights
   */
  static async generateConversationInsights(userId: number): Promise<ConversationInsight[]> {
    try {
      const themes = await this.analyzeConversationThemes(userId);
      const emotionalArc = await this.generateEmotionalArc(userId);
      const insights: ConversationInsight[] = [];
      
      // Theme-based insights
      for (const theme of themes.slice(0, 3)) { // Top 3 themes
        if (theme.frequency >= 3) {
          insights.push({
            type: 'pattern',
            title: `Recurring Theme: ${theme.name}`,
            description: `This theme appears in ${theme.frequency} conversations with a ${theme.emotionalTone} emotional tone.`,
            confidence: Math.min(theme.frequency / 10, 1),
            actionable: true,
            suggestedActions: [
              `Explore your relationship with ${theme.name.toLowerCase()}`,
              `Consider strategies to address challenges in this area`,
              `Reflect on patterns and triggers related to ${theme.name.toLowerCase()}`
            ],
            relatedThemes: themes.filter(t => t.name !== theme.name).slice(0, 2).map(t => t.name),
            timeframe: {
              start: theme.firstMention,
              end: theme.lastMention
            }
          });
        }
      }
      
      // Emotional arc insights
      if (emotionalArc) {
        if (emotionalArc.overallTrend === 'improving') {
          insights.push({
            type: 'growth',
            title: 'Positive Emotional Trajectory',
            description: 'Your emotional well-being shows an improving trend over time.',
            confidence: 0.8,
            actionable: true,
            suggestedActions: [
              'Reflect on what has contributed to this positive change',
              'Consider how to maintain this positive momentum',
              'Celebrate your emotional growth and progress'
            ],
            relatedThemes: themes.filter(t => t.emotionalTone === 'positive').map(t => t.name),
            timeframe: emotionalArc.timeframe
          });
        } else if (emotionalArc.overallTrend === 'declining') {
          insights.push({
            type: 'concern',
            title: 'Emotional Support Needed',
            description: 'Recent patterns suggest you might benefit from additional emotional support.',
            confidence: 0.7,
            actionable: true,
            suggestedActions: [
              'Consider reaching out to friends, family, or a professional',
              'Explore stress management and self-care strategies',
              'Identify specific triggers or stressors to address'
            ],
            relatedThemes: themes.filter(t => t.emotionalTone === 'negative').map(t => t.name),
            timeframe: emotionalArc.timeframe
          });
        }
        
        // Key moments insights
        const breakthroughs = emotionalArc.keyMoments.filter(m => m.type === 'breakthrough');
        if (breakthroughs.length > 0) {
          insights.push({
            type: 'achievement',
            title: 'Emotional Breakthroughs Identified',
            description: `You've had ${breakthroughs.length} significant emotional breakthrough${breakthroughs.length > 1 ? 's' : ''}.`,
            confidence: 0.9,
            actionable: true,
            suggestedActions: [
              'Reflect on what led to these breakthrough moments',
              'Consider how to replicate the conditions that supported these shifts',
              'Acknowledge and celebrate these important milestones'
            ],
            relatedThemes: [],
            timeframe: {
              start: breakthroughs[0].date,
              end: breakthroughs[breakthroughs.length - 1].date
            }
          });
        }
      }
      
      return insights.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error generating conversation insights:', error);
      return [];
    }
  }

  /**
   * Generate a comprehensive insights report for a user
   */
  static async generateInsightsReport(userId: number): Promise<{
    themes: ConversationTheme[];
    emotionalArc: EmotionalArc | null;
    insights: ConversationInsight[];
    summary: string;
  }> {
    try {
      const themes = await this.analyzeConversationThemes(userId);
      const emotionalArc = await this.generateEmotionalArc(userId);
      const insights = await this.generateConversationInsights(userId);
      
      // Generate AI summary
      const summaryPrompt = `Based on the following analysis of a user's journaling patterns, create a warm, encouraging summary from Flappy's perspective:

Themes: ${themes.map(t => `${t.name} (${t.frequency} mentions, ${t.emotionalTone} tone)`).join(', ')}

Emotional Trend: ${emotionalArc?.overallTrend || 'stable'}

Key Insights: ${insights.map(i => i.title).join(', ')}

Write a 2-3 paragraph summary that:
1. Acknowledges their journaling journey with warmth
2. Highlights positive patterns and growth
3. Gently addresses any concerns with supportive suggestions
4. Encourages continued self-reflection

Keep it personal, encouraging, and authentically Flappy-like.`;

      const summaryResponse = await generateFlappyContent(
        'journalResponse',
        summaryPrompt,
        {
          username: 'system',
          email: 'system@featherweight.world',
          userId: userId
        }
      );
      
      return {
        themes,
        emotionalArc,
        insights,
        summary: summaryResponse.content
      };
    } catch (error) {
      console.error('Error generating insights report:', error);
      return {
        themes: [],
        emotionalArc: null,
        insights: [],
        summary: 'Unable to generate insights report at this time.'
      };
    }
  }
}

/**
 * Initialize conversation insights system
 */
export function initializeConversationInsights(): void {
  console.log('🔍 Initializing Conversation Insights system...');
  
  // Generate insights reports weekly for active users
  setInterval(async () => {
    try {
      const users = await storage.getAllActiveUsers();
      console.log(`📊 Generating weekly insights for ${users.length} users...`);
      
      for (const user of users) {
        const report = await ConversationInsights.generateInsightsReport(user.id);
        
        if (report.insights.length > 0) {
          // Store insights in database or send to user
          console.log(`✅ Generated insights for user ${user.id}: ${report.insights.length} insights`);
        }
        
        // Add delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error in weekly insights generation:', error);
    }
  }, 7 * 24 * 60 * 60 * 1000); // Weekly
}

