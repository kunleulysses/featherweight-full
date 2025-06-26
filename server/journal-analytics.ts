import { Request, Response } from "express";
import { storage } from "./storage";
import { generateFlappyContent } from "./venice-ai";
import { z } from "zod";

// Schema for generating journal summaries
const generateSummarySchema = z.object({
  timeframe: z.enum(["week", "month", "quarter", "year"]).default("month"),
  includeInsights: z.boolean().default(true),
  includeMoodAnalysis: z.boolean().default(true),
  includeThemes: z.boolean().default(true),
});

// Schema for generating tags
const generateTagsSchema = z.object({
  entryIds: z.array(z.number()).optional(),
  timeframe: z.enum(["week", "month", "quarter", "year"]).optional(),
  regenerate: z.boolean().default(false),
});

/**
 * Generate a comprehensive journal summary for a given timeframe
 */
export async function generateJournalSummary(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = generateSummarySchema.parse(req.body);
    const { timeframe, includeInsights, includeMoodAnalysis, includeThemes } = validatedData;

    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case "week":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Get journal entries for the timeframe
    const entries = await storage.getJournalEntries(userId, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (entries.length === 0) {
      return res.json({
        summary: `No journal entries found for the selected ${timeframe}.`,
        insights: [],
        moodAnalysis: null,
        themes: [],
        entryCount: 0,
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          period: timeframe
        }
      });
    }

    // Prepare content for AI analysis
    const entriesText = entries.map(entry => 
      `Entry from ${new Date(entry.createdAt).toLocaleDateString()}:\n${entry.content}`
    ).join('\n\n---\n\n');

    // Generate AI summary
    const summaryPrompt = `
    Please analyze these journal entries from the past ${timeframe} and provide a comprehensive summary.
    
    ${includeInsights ? "Include key insights and patterns you notice." : ""}
    ${includeMoodAnalysis ? "Include mood analysis and emotional trends." : ""}
    ${includeThemes ? "Include main themes and topics discussed." : ""}
    
    Journal Entries:
    ${entriesText}
    
    Please provide a thoughtful, encouraging summary that helps the user understand their growth and patterns.
    `;

    const aiResponse = await generateFlappyContent(
      summaryPrompt,
      "journalSummary",
      userId,
      []
    );

    // Extract insights, mood analysis, and themes (mock implementation)
    const insights = includeInsights ? [
      "You've shown consistent growth in self-awareness",
      "Your problem-solving approach has become more structured",
      "You're developing better emotional regulation skills"
    ] : [];

    const moodAnalysis = includeMoodAnalysis ? {
      averageMood: 7.2,
      moodTrend: "improving",
      dominantEmotions: ["contentment", "determination", "optimism"],
      challengingDays: 2,
      positiveStreak: 5
    } : null;

    const themes = includeThemes ? [
      { name: "Personal Growth", frequency: 8, sentiment: "positive" },
      { name: "Work-Life Balance", frequency: 6, sentiment: "neutral" },
      { name: "Relationships", frequency: 5, sentiment: "positive" },
      { name: "Health & Wellness", frequency: 4, sentiment: "positive" }
    ] : [];

    res.json({
      summary: aiResponse.content,
      insights,
      moodAnalysis,
      themes,
      entryCount: entries.length,
      timeframe: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        period: timeframe
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error generating journal summary:", error);
    res.status(500).json({ 
      error: "Failed to generate journal summary",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Generate or update tags for journal entries
 */
export async function generateJournalTags(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = generateTagsSchema.parse(req.body);
    const { entryIds, timeframe, regenerate } = validatedData;

    let entries;

    if (entryIds && entryIds.length > 0) {
      // Get specific entries by IDs
      entries = await Promise.all(
        entryIds.map(id => storage.getJournalEntry(userId, id))
      );
      entries = entries.filter(entry => entry !== null);
    } else if (timeframe) {
      // Get entries for timeframe
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case "week":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      entries = await storage.getJournalEntries(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } else {
      // Get recent entries if no specific criteria
      entries = await storage.getJournalEntries(userId, { limit: 10 });
    }

    if (entries.length === 0) {
      return res.json({
        message: "No entries found to generate tags for",
        updatedEntries: 0,
        generatedTags: []
      });
    }

    const updatedEntries = [];
    const allGeneratedTags = new Set<string>();

    // Process each entry for tag generation
    for (const entry of entries) {
      if (!regenerate && entry.tags && entry.tags.length > 0) {
        // Skip if entry already has tags and not regenerating
        continue;
      }

      // Generate tags using AI
      const tagPrompt = `
      Analyze this journal entry and suggest 3-5 relevant tags that capture the main themes, emotions, and topics.
      
      Tags should be:
      - Single words or short phrases (2-3 words max)
      - Relevant to the content
      - Useful for categorization and search
      - Emotionally aware
      
      Journal Entry:
      ${entry.content}
      
      Please provide only the tags, separated by commas.
      `;

      try {
        const aiResponse = await generateFlappyContent(
          tagPrompt,
          "tagGeneration",
          userId,
          []
        );

        // Parse tags from AI response
        const suggestedTags = aiResponse.content
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0 && tag.length <= 20)
          .slice(0, 5); // Limit to 5 tags

        if (suggestedTags.length > 0) {
          // Update entry with new tags
          await storage.updateJournalEntry(userId, entry.id, {
            tags: suggestedTags
          });

          updatedEntries.push({
            id: entry.id,
            title: entry.title,
            tags: suggestedTags
          });

          suggestedTags.forEach(tag => allGeneratedTags.add(tag));
        }
      } catch (error) {
        console.error(`Error generating tags for entry ${entry.id}:`, error);
        // Continue with other entries even if one fails
      }
    }

    res.json({
      message: `Successfully generated tags for ${updatedEntries.length} entries`,
      updatedEntries: updatedEntries.length,
      generatedTags: Array.from(allGeneratedTags),
      entries: updatedEntries,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error generating journal tags:", error);
    res.status(500).json({ 
      error: "Failed to generate journal tags",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Get all unique tags for a user
 */
export async function getUserTags(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all entries for the user
    const entries = await storage.getJournalEntries(userId, { limit: 1000 });
    
    // Extract and count all tags
    const tagCounts = new Map<string, number>();
    const tagEntries = new Map<string, number[]>();

    entries.forEach(entry => {
      if (entry.tags && entry.tags.length > 0) {
        entry.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase().trim();
          tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
          
          if (!tagEntries.has(normalizedTag)) {
            tagEntries.set(normalizedTag, []);
          }
          tagEntries.get(normalizedTag)!.push(entry.id);
        });
      }
    });

    // Convert to array and sort by frequency
    const tags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({
        tag,
        count,
        entryIds: tagEntries.get(tag) || []
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      tags,
      totalTags: tags.length,
      totalEntries: entries.length,
      retrievedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting user tags:", error);
    res.status(500).json({ 
      error: "Failed to retrieve tags",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Search journal entries by tags
 */
export async function searchByTags(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { tags, matchAll = false } = req.query;
    
    if (!tags) {
      return res.status(400).json({ error: "Tags parameter is required" });
    }

    const searchTags = Array.isArray(tags) ? tags : [tags];
    const normalizedTags = searchTags.map(tag => String(tag).toLowerCase().trim());

    // Get all entries for the user
    const allEntries = await storage.getJournalEntries(userId, { limit: 1000 });
    
    // Filter entries based on tags
    const matchingEntries = allEntries.filter(entry => {
      if (!entry.tags || entry.tags.length === 0) return false;
      
      const entryTags = entry.tags.map(tag => tag.toLowerCase().trim());
      
      if (matchAll) {
        // All searched tags must be present
        return normalizedTags.every(searchTag => 
          entryTags.some(entryTag => entryTag.includes(searchTag))
        );
      } else {
        // At least one searched tag must be present
        return normalizedTags.some(searchTag => 
          entryTags.some(entryTag => entryTag.includes(searchTag))
        );
      }
    });

    res.json({
      entries: matchingEntries,
      searchTags: normalizedTags,
      matchAll,
      resultCount: matchingEntries.length,
      searchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error searching by tags:", error);
    res.status(500).json({ 
      error: "Failed to search by tags",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

