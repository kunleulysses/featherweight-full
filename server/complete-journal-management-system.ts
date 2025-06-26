// Complete Journal Management System for Featherweight.world
// Provides comprehensive journaling functionality with multi-channel integration

import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../shared/db';
import { journalEntries, conversations, smsMessages, emails, conversationMemories, users } from '../shared/schema';
import { eq, desc, and, or, like, gte, lte, inArray } from 'drizzle-orm';
import { generateFlappyContent } from './venice-ai';
import { memoryService } from './memory-service';

// Validation schemas
const createJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Journal entry content cannot be empty"),
  mood: z.enum(["happy", "calm", "neutral", "sad", "frustrated"]).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  source: z.enum(["web", "sms", "email", "conversation"]).default("web"),
  sourceId: z.number().optional(), // ID of source conversation/message
});

const updateJournalEntrySchema = createJournalEntrySchema.partial();

const journalSearchSchema = z.object({
  query: z.string().optional(),
  mood: z.enum(["happy", "calm", "neutral", "sad", "frustrated"]).optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const reflectionPromptSchema = z.object({
  entryId: z.number().optional(),
  context: z.string().optional(),
  promptType: z.enum(["daily", "weekly", "gratitude", "growth", "custom"]).default("daily"),
});

export class CompleteJournalManagementSystem {
  
  /**
   * Create a new journal entry
   */
  async createJournalEntry(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = createJournalEntrySchema.parse(req.body);
      const { title, content, mood, tags, imageUrl, source, sourceId } = validatedData;

      // Auto-generate title if not provided
      const finalTitle = title || await this.generateEntryTitle(content);

      // Auto-detect mood if not provided
      const finalMood = mood || await this.detectMood(content);

      // Auto-extract tags if not provided
      const finalTags = tags || await this.extractTags(content);

      // Create journal entry
      const [journalEntry] = await db.insert(journalEntries)
        .values({
          userId,
          title: finalTitle,
          content,
          mood: finalMood,
          tags: finalTags,
          imageUrl,
        })
        .returning();

      // Process entry for memory formation
      await memoryService.processMessage(userId, content, 'journal_topic');

      // Link to source if provided
      if (sourceId && source !== "web") {
        await this.linkToSource(journalEntry.id, source, sourceId);
      }

      // Generate AI insights for the entry
      const insights = await this.generateEntryInsights(journalEntry);

      res.status(201).json({
        success: true,
        journalEntry,
        insights,
        message: "Journal entry created successfully"
      });

    } catch (error) {
      console.error('Error creating journal entry:', error);
      res.status(500).json({ 
        error: "Failed to create journal entry",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Get journal entries with search and filtering
   */
  async getJournalEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedParams = journalSearchSchema.parse(req.query);
      const { query, mood, tags, startDate, endDate, limit, offset, sortBy, sortOrder } = validatedParams;

      // Build query conditions
      const conditions = [eq(journalEntries.userId, userId)];

      if (query) {
        conditions.push(
          or(
            like(journalEntries.content, `%${query}%`),
            like(journalEntries.title, `%${query}%`)
          )
        );
      }

      if (mood) {
        conditions.push(eq(journalEntries.mood, mood));
      }

      if (startDate) {
        conditions.push(gte(journalEntries.createdAt, new Date(startDate)));
      }

      if (endDate) {
        conditions.push(lte(journalEntries.createdAt, new Date(endDate)));
      }

      // Execute query
      const entries = await db.select()
        .from(journalEntries)
        .where(and(...conditions))
        .orderBy(sortOrder === 'desc' ? desc(journalEntries[sortBy]) : journalEntries[sortBy])
        .limit(limit)
        .offset(offset);

      // Filter by tags if provided (since JSON filtering is complex in SQL)
      let filteredEntries = entries;
      if (tags && tags.length > 0) {
        filteredEntries = entries.filter(entry => 
          entry.tags && tags.some(tag => entry.tags.includes(tag))
        );
      }

      // Get total count for pagination
      const totalCount = await this.getJournalEntriesCount(userId, validatedParams);

      res.json({
        success: true,
        entries: filteredEntries,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      });

    } catch (error) {
      console.error('Error fetching journal entries:', error);
      res.status(500).json({ 
        error: "Failed to fetch journal entries",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Get a specific journal entry by ID
   */
  async getJournalEntry(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const entryId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(entryId)) {
        return res.status(400).json({ error: "Invalid entry ID" });
      }

      const [entry] = await db.select()
        .from(journalEntries)
        .where(and(
          eq(journalEntries.id, entryId),
          eq(journalEntries.userId, userId)
        ));

      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      // Get related conversations and insights
      const relatedData = await this.getRelatedEntryData(entryId, userId);

      res.json({
        success: true,
        entry,
        related: relatedData
      });

    } catch (error) {
      console.error('Error fetching journal entry:', error);
      res.status(500).json({ 
        error: "Failed to fetch journal entry",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Update a journal entry
   */
  async updateJournalEntry(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const entryId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(entryId)) {
        return res.status(400).json({ error: "Invalid entry ID" });
      }

      const validatedData = updateJournalEntrySchema.parse(req.body);

      // Verify ownership
      const [existingEntry] = await db.select()
        .from(journalEntries)
        .where(and(
          eq(journalEntries.id, entryId),
          eq(journalEntries.userId, userId)
        ));

      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      // Update entry
      const [updatedEntry] = await db.update(journalEntries)
        .set({
          ...validatedData,
          updatedAt: new Date()
        })
        .where(eq(journalEntries.id, entryId))
        .returning();

      // Reprocess for memory if content changed
      if (validatedData.content) {
        await memoryService.processMessage(userId, validatedData.content, 'journal_topic');
      }

      res.json({
        success: true,
        entry: updatedEntry,
        message: "Journal entry updated successfully"
      });

    } catch (error) {
      console.error('Error updating journal entry:', error);
      res.status(500).json({ 
        error: "Failed to update journal entry",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteJournalEntry(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const entryId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(entryId)) {
        return res.status(400).json({ error: "Invalid entry ID" });
      }

      // Verify ownership and delete
      const [deletedEntry] = await db.delete(journalEntries)
        .where(and(
          eq(journalEntries.id, entryId),
          eq(journalEntries.userId, userId)
        ))
        .returning();

      if (!deletedEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      res.json({
        success: true,
        message: "Journal entry deleted successfully"
      });

    } catch (error) {
      console.error('Error deleting journal entry:', error);
      res.status(500).json({ 
        error: "Failed to delete journal entry",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Generate AI reflection prompts
   */
  async generateReflectionPrompt(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = reflectionPromptSchema.parse(req.body);
      const { entryId, context, promptType } = validatedData;

      // Get user information
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get recent entries for context
      const recentEntries = await db.select()
        .from(journalEntries)
        .where(eq(journalEntries.userId, userId))
        .orderBy(desc(journalEntries.createdAt))
        .limit(5);

      // Get specific entry if provided
      let specificEntry = null;
      if (entryId) {
        [specificEntry] = await db.select()
          .from(journalEntries)
          .where(and(
            eq(journalEntries.id, entryId),
            eq(journalEntries.userId, userId)
          ));
      }

      // Generate reflection prompt using AI
      const promptContext = {
        user,
        recentEntries,
        specificEntry,
        context,
        promptType
      };

      const reflectionPrompt = await generateFlappyContent('reflectionPrompt', user, JSON.stringify(promptContext));

      res.json({
        success: true,
        prompt: reflectionPrompt.content,
        promptType,
        context: promptContext
      });

    } catch (error) {
      console.error('Error generating reflection prompt:', error);
      res.status(500).json({ 
        error: "Failed to generate reflection prompt",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Convert conversation to journal entry
   */
  async convertConversationToJournal(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const conversationId = parseInt(req.params.conversationId);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(conversationId)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }

      // Get conversation
      const [conversation] = await db.select()
        .from(conversations)
        .where(and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, userId)
        ));

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Create journal entry from conversation
      const title = await this.generateEntryTitle(conversation.userMessage);
      const content = `${conversation.userMessage}\n\n---\n\n${conversation.flappyResponse}`;
      const mood = conversation.mood || await this.detectMood(conversation.userMessage);
      const tags = conversation.messageTags || await this.extractTags(conversation.userMessage);

      const [journalEntry] = await db.insert(journalEntries)
        .values({
          userId,
          title,
          content,
          mood,
          tags,
        })
        .returning();

      // Update conversation to mark as saved
      await db.update(conversations)
        .set({
          savedAsJournal: true,
          journalEntryId: journalEntry.id
        })
        .where(eq(conversations.id, conversationId));

      res.json({
        success: true,
        journalEntry,
        message: "Conversation converted to journal entry successfully"
      });

    } catch (error) {
      console.error('Error converting conversation to journal:', error);
      res.status(500).json({ 
        error: "Failed to convert conversation to journal entry",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Get journal statistics and insights
   */
  async getJournalStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const timeframe = req.query.timeframe as string || 'month';
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Get entries in timeframe
      const entries = await db.select()
        .from(journalEntries)
        .where(and(
          eq(journalEntries.userId, userId),
          gte(journalEntries.createdAt, startDate),
          lte(journalEntries.createdAt, endDate)
        ));

      // Calculate statistics
      const stats = {
        totalEntries: entries.length,
        averageLength: entries.reduce((sum, entry) => sum + entry.content.length, 0) / entries.length || 0,
        moodDistribution: this.calculateMoodDistribution(entries),
        topTags: this.calculateTopTags(entries),
        writingStreak: await this.calculateWritingStreak(userId),
        entriesPerDay: this.calculateEntriesPerDay(entries, startDate, endDate),
        insights: await this.generateJournalInsights(entries, userId)
      };

      res.json({
        success: true,
        statistics: stats,
        timeframe
      });

    } catch (error) {
      console.error('Error fetching journal statistics:', error);
      res.status(500).json({ 
        error: "Failed to fetch journal statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Helper methods

  private async generateEntryTitle(content: string): Promise<string> {
    // Extract first sentence or generate title from content
    const firstSentence = content.split('.')[0];
    if (firstSentence.length > 50) {
      return firstSentence.substring(0, 47) + '...';
    }
    return firstSentence || 'Untitled Entry';
  }

  private async detectMood(content: string): Promise<string> {
    // Simple mood detection - could be enhanced with AI
    const positiveWords = ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'upset', 'terrible', 'awful'];
    const calmWords = ['peaceful', 'calm', 'relaxed', 'serene', 'content'];

    const lowerContent = content.toLowerCase();
    
    if (positiveWords.some(word => lowerContent.includes(word))) return 'happy';
    if (negativeWords.some(word => lowerContent.includes(word))) return 'sad';
    if (calmWords.some(word => lowerContent.includes(word))) return 'calm';
    
    return 'neutral';
  }

  private async extractTags(content: string): Promise<string[]> {
    // Simple tag extraction - could be enhanced with AI
    const commonTags = ['work', 'family', 'health', 'travel', 'goals', 'relationships', 'personal'];
    const lowerContent = content.toLowerCase();
    
    return commonTags.filter(tag => lowerContent.includes(tag));
  }

  private async linkToSource(entryId: number, source: string, sourceId: number): Promise<void> {
    // Link journal entry to its source conversation/message
    switch (source) {
      case 'conversation':
        await db.update(conversations)
          .set({ journalEntryId: entryId, savedAsJournal: true })
          .where(eq(conversations.id, sourceId));
        break;
      case 'sms':
        await db.update(smsMessages)
          .set({ journalEntryId: entryId, isJournalEntry: true })
          .where(eq(smsMessages.id, sourceId));
        break;
      case 'email':
        await db.update(emails)
          .set({ isJournalEntry: true })
          .where(eq(emails.id, sourceId));
        break;
    }
  }

  private async generateEntryInsights(entry: any): Promise<any> {
    // Generate AI insights for the journal entry
    return {
      themes: await this.extractTags(entry.content),
      sentiment: entry.mood,
      wordCount: entry.content.split(' ').length,
      readingTime: Math.ceil(entry.content.split(' ').length / 200) // Average reading speed
    };
  }

  private async getRelatedEntryData(entryId: number, userId: number): Promise<any> {
    // Get related conversations and memories
    const relatedConversations = await db.select()
      .from(conversations)
      .where(and(
        eq(conversations.userId, userId),
        eq(conversations.journalEntryId, entryId)
      ));

    const relatedMemories = await db.select()
      .from(conversationMemories)
      .where(eq(conversationMemories.userId, userId))
      .limit(5);

    return {
      conversations: relatedConversations,
      memories: relatedMemories
    };
  }

  private async getJournalEntriesCount(userId: number, params: any): Promise<number> {
    // Get total count for pagination
    const conditions = [eq(journalEntries.userId, userId)];
    
    if (params.mood) {
      conditions.push(eq(journalEntries.mood, params.mood));
    }
    
    if (params.startDate) {
      conditions.push(gte(journalEntries.createdAt, new Date(params.startDate)));
    }
    
    if (params.endDate) {
      conditions.push(lte(journalEntries.createdAt, new Date(params.endDate)));
    }

    const result = await db.select({ count: journalEntries.id })
      .from(journalEntries)
      .where(and(...conditions));
    
    return result.length;
  }

  private calculateMoodDistribution(entries: any[]): any {
    const distribution = { happy: 0, calm: 0, neutral: 0, sad: 0, frustrated: 0 };
    entries.forEach(entry => {
      if (entry.mood && distribution.hasOwnProperty(entry.mood)) {
        distribution[entry.mood]++;
      }
    });
    return distribution;
  }

  private calculateTopTags(entries: any[]): string[] {
    const tagCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  private async calculateWritingStreak(userId: number): Promise<number> {
    // Calculate consecutive days of journaling
    const entries = await db.select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of entries) {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  private calculateEntriesPerDay(entries: any[], startDate: Date, endDate: Date): number {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return entries.length / days;
  }

  private async generateJournalInsights(entries: any[], userId: number): Promise<string[]> {
    // Generate AI-powered insights about journaling patterns
    const insights = [];
    
    if (entries.length > 0) {
      const avgLength = entries.reduce((sum, entry) => sum + entry.content.length, 0) / entries.length;
      if (avgLength > 500) {
        insights.push("You tend to write detailed, thoughtful entries");
      }
      
      const moodCounts = this.calculateMoodDistribution(entries);
      const dominantMood = Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];
      insights.push(`Your most common mood while journaling is ${dominantMood}`);
    }
    
    return insights;
  }
}

// Export singleton instance
export const journalManagementSystem = new CompleteJournalManagementSystem();

