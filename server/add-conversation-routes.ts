import { db } from "./db";
import { conversations, journalEntries } from "../shared/schema";
import { eq } from "drizzle-orm";
import { generateFlappyContent } from "./venice-ai";
import { memoryService } from "./memory-service";

/**
 * Add conversation routes to Express app
 */
export function addConversationRoutes(app) {
  // Chat with Flappy endpoint
  app.post("/api/conversation", async (req, res) => {
    // Check if user is authenticated - make sure we send a proper JSON response
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        message: "Unauthorized", 
        success: false,
        error: "Please log in to chat with Flappy"
      });
    }
    
    try {
      const { message, createJournalEntry = false } = req.body;
      
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Get recent conversation history for this user to provide context
      const userConversations = await db.select()
        .from(conversations)
        .where(eq(conversations.userId, req.user.id))
        .orderBy(conversations.createdAt, 'desc')
        .limit(5);
      
      // Build conversation history context
      const conversationHistory = userConversations.map(conv => ({
        userMessage: conv.userMessage,
        flappyResponse: conv.flappyResponse,
        timestamp: conv.createdAt
      }));
      
      // Get recent memories to enhance the context
      const userMemories = await memoryService.getRelevantMemories(req.user.id, message, 3);
      
      // Force chat mode with enhanced context for better follow-up questions
      const flappyResponse = await generateFlappyContent(
        'chatConversation',
        message,
        req.user,
        {
          conversationHistory,
          userMemories,
          shouldGenerateReflectionPrompt: true
        }
      );
      
      // Save the conversation to the database including the reflection prompt
      const [conversation] = await db.insert(conversations)
        .values({
          userId: req.user.id,
          userMessage: message,
          flappyResponse: flappyResponse.content,
          conversationType: 'chat',
          savedAsJournal: createJournalEntry,
          messageTags: extractTags(message),
          mood: detectMood(message),
          reflectionPrompt: flappyResponse.reflectionPrompt || null
        })
        .returning();
      
      // Return the response text and reflection prompt
      return res.status(200).json({ 
        response: flappyResponse.content,
        reflectionPrompt: flappyResponse.reflectionPrompt,
        conversationId: conversation.id,
        success: true
      });
    } catch (error) {
      console.error("Error in conversation handler:", error);
      return res.status(500).json({ 
        message: "Failed to process conversation",
        success: false
      });
    }
  });

  // Create a new conversation
  app.post("/api/direct-conversation", async (req, res) => {
    // Check if user is authenticated (user exists in the request)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { content, save_as_journal = false } = req.body;
      
      if (!content || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Generate Flappy's response
      const flappyResponse = await generateFlappyContent(
        save_as_journal ? 'journalResponse' : 'emailConversation',
        req.user,
        content
      );
      
      console.log(`Generated response: ${flappyResponse.content.substring(0, 50)}...`);
      
      // Format tags from content if any
      const tags = extractTags(content);
      
      // Determine mood from content
      const mood = detectMood(content);
      
      // Save conversation to database
      const [conversation] = await db.insert(conversations)
        .values({
          userId: req.user.id,
          userMessage: content,
          flappyResponse: flappyResponse.content,
          conversationType: save_as_journal ? 'journal' : 'general',
          savedAsJournal: save_as_journal,
          messageTags: tags,
          mood: mood
        })
        .returning();
      
      // If this should be saved as a journal entry, create one
      if (save_as_journal) {
        const [journalEntry] = await db.insert(journalEntries)
          .values({
            userId: req.user.id,
            title: flappyResponse.subject || `Journal Entry ${new Date().toLocaleDateString()}`,
            content: content,
            mood: mood,
            tags: tags
          })
          .returning();
        
        // Update the conversation with the journal entry ID
        await db.update(conversations)
          .set({ journalEntryId: journalEntry.id })
          .where(eq(conversations.id, conversation.id));
        
        // Update the conversation object for the response
        conversation.journalEntryId = journalEntry.id;
      }
      
      return res.status(201).json(conversation);
    } catch (error) {
      console.error("Error in direct conversation handler:", error);
      return res.status(500).json({ message: "Failed to process conversation" });
    }
  });
  
  // Get all conversations for the current user
  app.get("/api/direct-conversation", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userConversations = await db.select()
        .from(conversations)
        .where(eq(conversations.userId, req.user.id))
        .orderBy(conversations.createdAt, 'desc');
      
      return res.json(userConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  
  // Save conversation as journal entry
  app.post("/api/direct-conversation/:id/save-journal", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const conversationId = parseInt(req.params.id);
      
      // Get the conversation
      const [conversation] = await db.select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      if (conversation.savedAsJournal) {
        return res.status(400).json({ message: "Conversation is already saved as a journal entry" });
      }
      
      // Create a journal entry
      const [journalEntry] = await db.insert(journalEntries)
        .values({
          userId: req.user.id,
          title: `Conversation from ${new Date(conversation.createdAt).toLocaleDateString()}`,
          content: conversation.userMessage,
          mood: conversation.mood || undefined,
          tags: conversation.messageTags || []
        })
        .returning();
      
      // Update the conversation
      const [updatedConversation] = await db.update(conversations)
        .set({
          savedAsJournal: true,
          journalEntryId: journalEntry.id
        })
        .where(eq(conversations.id, conversationId))
        .returning();
      
      return res.json(updatedConversation);
    } catch (error) {
      console.error("Error saving conversation as journal:", error);
      return res.status(500).json({ message: "Failed to save conversation as journal" });
    }
  });
}

/**
 * Extract tags from content
 */
function extractTags(content) {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  
  if (!matches) return [];
  
  return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
}

/**
 * Detect mood from content
 */
function detectMood(content) {
  const lowerContent = content.toLowerCase();
  
  // Simple mood detection
  if (lowerContent.includes('happy') || 
      lowerContent.includes('joy') || 
      lowerContent.includes('excited')) {
    return 'happy';
  } else if (lowerContent.includes('calm') || 
             lowerContent.includes('peaceful') || 
             lowerContent.includes('relaxed')) {
    return 'calm';
  } else if (lowerContent.includes('sad') || 
             lowerContent.includes('unhappy') || 
             lowerContent.includes('depressed')) {
    return 'sad';
  } else if (lowerContent.includes('angry') || 
             lowerContent.includes('frustrated') || 
             lowerContent.includes('annoyed')) {
    return 'frustrated';
  }
  
  return 'neutral';
}