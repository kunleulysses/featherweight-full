import { storage } from "./storage";
import { emailService } from "./email";
import { simpleParser } from "mailparser";
import { Buffer } from "buffer";
import { EmailQueueItem } from "@shared/schema";
import { EmailContentExtractor } from "./email-content-extractor";
import { GmailContentParser } from "./gmail-content-parser";
import { generateFlappyContent } from "./venice-ai";

// Process interval in milliseconds (check for new emails every 10 seconds)
const PROCESS_INTERVAL = 10000;

// Maximum number of attempts to process an email before giving up
const MAX_ATTEMPTS = 5;

// Set to track processed emails to prevent duplicates
const processedEmails = new Set<string>();

// Save-to-journal command patterns
const SAVE_COMMANDS = [
  /save\s+(?:this\s+)?(?:conversation|convo|chat|thread)\s+(?:to\s+)?(?:my\s+)?journal/i,
  /journal\s+(?:this|save)/i,
  /#savejournal/i,
  /add\s+(?:this\s+)?(?:to\s+)?(?:my\s+)?journal/i,
  /flappy,?\s+save\s+(?:this\s+)?(?:to\s+)?(?:my\s+)?journal/i
];

/**
 * Enhanced email processor with save-to-journal functionality
 */
export class EnhancedEmailProcessor {
  
  /**
   * Detect if an email contains a save-to-journal command
   */
  static detectSaveCommand(content: string): boolean {
    return SAVE_COMMANDS.some(pattern => pattern.test(content));
  }

  /**
   * Extract conversation thread from email content
   */
  static extractConversationThread(content: string, subject: string): string {
    // Remove common email signatures and footers
    let cleanContent = content
      .replace(/^On .* wrote:$/gm, '') // Remove "On ... wrote:" lines
      .replace(/^From:.*$/gm, '') // Remove "From:" lines
      .replace(/^Sent:.*$/gm, '') // Remove "Sent:" lines
      .replace(/^To:.*$/gm, '') // Remove "To:" lines
      .replace(/^Subject:.*$/gm, '') // Remove "Subject:" lines
      .replace(/^\s*>.*$/gm, '') // Remove quoted lines starting with >
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .trim();

    // If content is too short, include the subject for context
    if (cleanContent.length < 50 && subject) {
      cleanContent = `Subject: ${subject}\n\n${cleanContent}`;
    }

    return cleanContent;
  }

  /**
   * Generate AI summary and tags for a conversation
   */
  static async generateConversationSummary(conversationContent: string, userEmail: string): Promise<{
    summary: string;
    tags: string[];
    title: string;
  }> {
    try {
      const user = await storage.getUserByEmail(userEmail);
      if (!user) {
        throw new Error('User not found');
      }

      // Create a specialized prompt for conversation summarization
      const summaryPrompt = `You are Flappy, analyzing an email conversation to create a journal entry summary. 

Email conversation content:
"${conversationContent}"

Create a JSON response with:
1. "summary" - A concise, meaningful summary of the key insights, emotions, and topics discussed (2-3 sentences)
2. "tags" - An array of 3-5 relevant tags (e.g., ["work", "stress", "growth", "relationships"])
3. "title" - A brief, descriptive title for this journal entry (under 50 characters)

Focus on the emotional journey, key insights, and main themes. Make it personal and meaningful.

Format your response as JSON:
{
  "summary": "Your thoughtful summary here",
  "tags": ["tag1", "tag2", "tag3"],
  "title": "Meaningful Title Here"
}`;

      const response = await generateFlappyContent(
        'journalResponse',
        summaryPrompt,
        {
          username: user.username,
          email: user.email,
          userId: user.id,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined
        }
      );

      // Parse the AI response to extract summary data
      try {
        const parsed = JSON.parse(response.content);
        return {
          summary: parsed.summary || 'Email conversation saved to journal',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['conversation', 'email'],
          title: parsed.title || 'Email Conversation'
        };
      } catch (parseError) {
        console.warn('Failed to parse AI summary response, using fallback');
        return {
          summary: 'Email conversation with Flappy saved to journal',
          tags: ['conversation', 'email', 'flappy'],
          title: 'Email Conversation'
        };
      }
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      return {
        summary: 'Email conversation saved to journal',
        tags: ['conversation', 'email'],
        title: 'Email Conversation'
      };
    }
  }

  /**
   * Save conversation to journal with AI-generated summary
   */
  static async saveConversationToJournal(
    userEmail: string,
    conversationContent: string,
    originalSubject: string,
    emailThreadId?: string
  ): Promise<{ success: boolean; journalEntryId?: number; error?: string }> {
    try {
      const user = await storage.getUserByEmail(userEmail);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Generate AI summary and tags
      const { summary, tags, title } = await this.generateConversationSummary(
        conversationContent,
        userEmail
      );

      // Create journal entry
      const journalEntry = await storage.createJournalEntry({
        userId: user.id,
        content: conversationContent,
        title: title,
        mood: null, // Will be analyzed by AI later
        tags: tags,
        emailId: emailThreadId || null
      });

      console.log(`✅ Saved conversation to journal: Entry ID ${journalEntry.id}`);
      
      return { 
        success: true, 
        journalEntryId: journalEntry.id 
      };
    } catch (error) {
      console.error('Error saving conversation to journal:', error);
      return { 
        success: false, 
        error: (error as Error).message 
      };
    }
  }

  /**
   * Send confirmation email for saved journal entry
   */
  static async sendSaveConfirmation(
    userEmail: string,
    journalEntryId: number,
    summary: string,
    tags: string[],
    title: string
  ): Promise<void> {
    try {
      const user = await storage.getUserByEmail(userEmail);
      if (!user) return;

      const confirmationContent = await generateFlappyContent(
        'emailConversation',
        `The user requested to save our conversation to their journal. I've successfully saved it with the following details:

Title: "${title}"
Summary: "${summary}"
Tags: ${tags.join(', ')}

Confirm this was saved successfully and let them know they can view it in their journal dashboard. Be encouraging about their journaling practice.`,
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
        confirmationContent.subject,
        confirmationContent.content,
        'conversation_reply'
      );

      console.log(`✅ Sent save confirmation to ${userEmail}`);
    } catch (error) {
      console.error('Error sending save confirmation:', error);
    }
  }
}

/**
 * Process a single email from the queue with enhanced error handling and save functionality
 */
async function processQueuedEmail(queueItem: EmailQueueItem): Promise<boolean> {
  try {
    console.log(`📨 Processing queued email ID: ${queueItem.id}`);
    
    // Mark as processing
    await storage.markEmailProcessing(queueItem.id);
    
    // Extract payload
    const payload = queueItem.payload as any;
    
    console.log(`📦 Processing email with ID: ${queueItem.id}`);
    console.log(`📦 Payload type: ${typeof payload}`);
    
    // Check for duplicate processing
    const emailKey = generateEmailKey(queueItem);
    if (processedEmails.has(emailKey)) {
      console.log(`⚠️ Email already processed, skipping: ${emailKey}`);
      await storage.markEmailCompleted(queueItem.id);
      return true;
    }
    
    // Add to processed set
    processedEmails.add(emailKey);
    
    let emailData: {
      sender: string;
      subject: string;
      content: string;
      messageId?: string;
      inReplyTo?: string;
      references?: string;
    } | null = null;

    // Handle different payload formats
    if (payload && payload.rawMimeBase64) {
      // Handle raw MIME base64 payload from SendGrid
      console.log(`🔍 Processing payload with rawMimeBase64`);
      const buffer = Buffer.from(payload.rawMimeBase64 as string, 'base64');
      console.log(`🔍 Buffer size: ${buffer.length} bytes`);
      
      // Check if this is multipart form data (SendGrid inbound parse format)
      const bufferString = buffer.toString('utf8');
      if (bufferString.includes('Content-Disposition: form-data')) {
        console.log(`🔍 Detected multipart form data format`);
        
        // Use Gmail-specific content parser for better extraction
        const extracted = GmailContentParser.parseContent(bufferString);
        
        console.log(`🔍 Gmail parsing results:`);
        console.log(`   Sender: ${extracted.sender}`);
        console.log(`   Subject: ${extracted.subject}`);
        console.log(`   Content length: ${extracted.content.length} characters`);
        console.log(`   Content preview: ${extracted.content.substring(0, 100)}...`);
        console.log(`   In-Reply-To: ${extracted.inReplyTo || 'none'}`);

        emailData = {
          sender: extracted.sender,
          subject: extracted.subject,
          content: extracted.content,
          messageId: extracted.messageId,
          inReplyTo: extracted.inReplyTo,
          references: extracted.references
        };
      } else {
        // Handle as regular MIME email
        const parsedEmail = await simpleParser(buffer);
        emailData = {
          sender: parsedEmail.from?.text || 'unknown@example.com',
          subject: parsedEmail.subject || 'No Subject',
          content: parsedEmail.text || parsedEmail.html || '',
          messageId: parsedEmail.messageId?.replace(/^<|>$/g, ''),
          inReplyTo: parsedEmail.inReplyTo?.replace(/^<|>$/g, ''),
          references: parsedEmail.references ? (Array.isArray(parsedEmail.references) ? parsedEmail.references.join(' ') : parsedEmail.references) : undefined
        };
      }
      
    } else if (payload && payload.buffer) {
      // If we have base64 encoded buffer data
      console.log(`🔍 Detected buffer payload format`);
      const buffer = Buffer.from(payload.buffer as string, 'base64');
      console.log(`🔍 Buffer size: ${buffer.length} bytes`);
      const parsedEmail = await simpleParser(buffer);
      emailData = {
        sender: parsedEmail.from?.text || 'unknown@example.com',
        subject: parsedEmail.subject || 'No Subject',
        content: parsedEmail.text || parsedEmail.html || '',
        messageId: parsedEmail.messageId?.replace(/^<|>$/g, ''),
        inReplyTo: parsedEmail.inReplyTo?.replace(/^<|>$/g, ''),
        references: parsedEmail.references ? (Array.isArray(parsedEmail.references) ? parsedEmail.references.join(' ') : parsedEmail.references) : undefined
      };
      
    } else if (payload && payload.text && payload.from && payload.subject) {
      // Handle direct JSON payload
      console.log(`🔍 Processing direct JSON payload`);
      emailData = {
        sender: payload.from,
        subject: payload.subject,
        content: payload.text,
        inReplyTo: payload.inReplyTo
      };
      
    } else if (typeof payload === 'string') {
      // Handle string payload
      console.log(`🔍 Processing string payload`);
      try {
        const parsed = JSON.parse(payload);
        emailData = {
          sender: parsed.from || 'unknown@example.com',
          subject: parsed.subject || 'No Subject',
          content: parsed.text || parsed.body || '',
          inReplyTo: parsed.inReplyTo
        };
      } catch {
        // If not JSON, treat as raw email content
        const parsedEmail = await simpleParser(Buffer.from(payload, 'utf8'));
        emailData = {
          sender: parsedEmail.from?.text || 'unknown@example.com',
          subject: parsedEmail.subject || 'No Subject',
          content: parsedEmail.text || parsedEmail.html || '',
          messageId: parsedEmail.messageId?.replace(/^<|>$/g, ''),
          inReplyTo: parsedEmail.inReplyTo?.replace(/^<|>$/g, ''),
          references: parsedEmail.references ? (Array.isArray(parsedEmail.references) ? parsedEmail.references.join(' ') : parsedEmail.references) : undefined
        };
      }
      
    } else {
      console.warn(`⚠️ Unknown payload format:`, typeof payload);
      
      // Try to extract basic fields from payload
      const from = extractField(payload, ['from', 'sender', 'email']);
      const subject = extractField(payload, ['subject', 'title']);
      const text = extractField(payload, ['text', 'body', 'content', 'message']);
      
      if (from && text) {
        console.log(`🔍 Extracted basic fields from unknown payload format`);
        emailData = {
          sender: from,
          subject: subject || 'No Subject',
          content: text
        };
      } else {
        throw new Error(`Unable to process payload format: ${typeof payload}`);
      }
    }

    if (!emailData) {
      throw new Error('Failed to extract email data from payload');
    }

    // Check for save-to-journal command
    const hasSaveCommand = EnhancedEmailProcessor.detectSaveCommand(emailData.content);
    
    if (hasSaveCommand) {
      console.log(`💾 Detected save-to-journal command in email from ${emailData.sender}`);
      
      // Extract conversation thread
      const conversationContent = EnhancedEmailProcessor.extractConversationThread(
        emailData.content,
        emailData.subject
      );
      
      // Save to journal
      const saveResult = await EnhancedEmailProcessor.saveConversationToJournal(
        emailData.sender,
        conversationContent,
        emailData.subject,
        emailData.messageId
      );
      
      if (saveResult.success && saveResult.journalEntryId) {
        // Generate summary for confirmation
        const { summary, tags, title } = await EnhancedEmailProcessor.generateConversationSummary(
          conversationContent,
          emailData.sender
        );
        
        // Send confirmation email
        await EnhancedEmailProcessor.sendSaveConfirmation(
          emailData.sender,
          saveResult.journalEntryId,
          summary,
          tags,
          title
        );
      } else {
        console.error(`❌ Failed to save conversation to journal: ${saveResult.error}`);
        // Still process the email normally even if save failed
      }
    }

    // Process the email normally (generate response)
    await emailService.processIncomingEmail(
      emailData.sender,
      emailData.subject,
      emailData.content,
      emailData.messageId,
      emailData.inReplyTo,
      emailData.references
    );
    
    await storage.markEmailCompleted(queueItem.id);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing queued email:`, error);
    await storage.markEmailFailed(queueItem.id, (error as Error).message);
    await storage.incrementEmailAttempts(queueItem.id);
    return false;
  }
}

/**
 * Check for and process the next email in the queue
 */
async function processNextEmail(): Promise<void> {
  try {
    const nextEmail = await storage.getNextPendingEmail();
    
    if (nextEmail) {
      // Check if we've exceeded max attempts
      if (nextEmail.processAttempts >= MAX_ATTEMPTS) {
        console.log(`⚠️ Email ${nextEmail.id} has exceeded maximum attempts (${MAX_ATTEMPTS}), marking as failed`);
        await storage.markEmailFailed(nextEmail.id, `Exceeded maximum attempts (${MAX_ATTEMPTS})`);
        return;
      }
      
      console.log(`📨 Processing next email in queue: ${nextEmail.id} (attempt ${nextEmail.processAttempts + 1})`);
      const success = await processQueuedEmail(nextEmail);
      
      if (success) {
        console.log(`✅ Successfully processed email ${nextEmail.id}`);
      } else {
        console.log(`❌ Failed to process email ${nextEmail.id}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error in email processing cycle:`, error);
  }
}

/**
 * Start the email processor service
 */
export function startEmailProcessor(): void {
  console.log(`🚀 Starting enhanced email processing service...`);
  
  // Process immediately on startup
  processNextEmail();
  
  // Set up recurring processing
  setInterval(processNextEmail, PROCESS_INTERVAL);
}

/**
 * Helper function to extract a field from payload with multiple possible keys
 */
function extractField(payload: any, keys: string[]): string {
  for (const key of keys) {
    if (payload && payload[key]) {
      return payload[key];
    }
  }
  return '';
}

/**
 * Generate a unique key for an email to detect duplicates
 */
function generateEmailKey(queueItem: EmailQueueItem): string {
  const payload = queueItem.payload as any;
  const timestamp = queueItem.createdAt.getTime();
  
  // Try to create a unique key from the email content
  let keyParts = [timestamp.toString()];
  
  if (payload) {
    if (payload.from) keyParts.push(payload.from);
    if (payload.subject) keyParts.push(payload.subject);
    if (payload.messageId) keyParts.push(payload.messageId);
  }
  
  return keyParts.join('|');
}

