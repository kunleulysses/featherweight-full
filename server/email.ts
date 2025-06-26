import { User, Email, InsertEmail } from "@shared/schema";
import { storage } from "./storage";
import { generateFlappyContent, FlappyContentType, FlappyContent } from "./venice-ai";
import { memoryService } from "./memory-service";
import sgMail from "@sendgrid/mail";

// Configure SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn('SendGrid API key is not configured. Email functionality will be limited.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid initialized successfully');
}

// Email configuration - using different subdomains for sending vs receiving
const FROM_EMAIL = "flappy@em8032.featherweight.world"; // Verified domain for authentication (CNAME)
const REPLY_TO_EMAIL = "flappy@parse.featherweight.world"; // Domain with MX record for inbound parse
const FROM_NAME = "Flappy from Featherweight";

// Log the FROM_EMAIL to ensure it's correctly set
console.log("Using email FROM address:", FROM_EMAIL);

// Export email service functions
export const emailService = {
  // Send a single email using SendGrid
  async sendEmail(
    to: string, 
    subject: string, 
    content: string, 
    isPremium: boolean = false,
    inReplyTo?: string,
    references?: string
  ): Promise<{ messageId: string }> {
    console.log('=== EMAIL SENDING PROCESS STARTED ===');
    console.log(`Target email: ${to}`);
    console.log(`Email subject: ${subject}`);
    console.log(`Content length: ${content.length} characters`);
    
    try {
      // Validate the email address format
      if (!to || typeof to !== 'string' || !to.includes('@') || to.startsWith('mime-version:')) {
        throw new Error(`Invalid recipient email address: ${to}`);
      }
      if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️ SendGrid API key is not configured. Cannot send email.');
        const localId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        console.log(`Generated local message ID: ${localId}`);
        return { messageId: localId };
      }
      
      // Generate a unique message ID for threading
      const messageId = `flappy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@featherweight.world`;
      
      console.log('Formatting HTML content');
      const htmlContent = formatEmailHTML(content, isPremium);
      
      console.log('Preparing text content');
      const textContent = content + (!isPremium ? '\n\n[Advertisement: Upgrade to premium for ad-free experiences]' : '');
      
      console.log(`FROM_EMAIL: ${FROM_EMAIL}`);
      console.log(`FROM_NAME: ${FROM_NAME}`);
      console.log(`Preparing to send email to: ${to}, subject: ${subject}`);
      
      const msg = {
        to,
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },
        replyTo: REPLY_TO_EMAIL, // Using friendly email address for replies
        subject,
        text: textContent,
        html: htmlContent,
        trackingSettings: {
          clickTracking: {
            enable: true
          },
          openTracking: {
            enable: true
          }
        },
        mailSettings: {
          footer: {
            enable: true,
            text: 'Featherweight - Your Journaling Companion\nReply to this email to continue your conversation with Flappy\n\nTo unsubscribe from these emails, visit: https://featherweight.world/unsubscribe',
            html: `<p style="color: #9E9E9E; font-size: 12px;">
              Featherweight - Your Journaling Companion<br>
              Reply to this email to continue your conversation with Flappy<br><br>
              <a href="https://featherweight.world/unsubscribe?id=${messageId}" style="color: #9E9E9E;">Unsubscribe</a> or manage your 
              <a href="https://featherweight.world/preferences" style="color: #9E9E9E;">email preferences</a>
            </p>`
          }
        },
        // Adding custom headers for threading and deliverability
        headers: {
          "X-Entity-Ref-ID": messageId,
          "Message-ID": `<${messageId}>`,
          ...(inReplyTo && { "In-Reply-To": `<${inReplyTo}>` }),
          ...(references && { "References": references }),
          "List-Unsubscribe": `<https://featherweight.world/unsubscribe?id=${messageId}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "Feedback-ID": `${isPremium ? 'premium' : 'free'}:featherweight:${messageId}`
        }
      };
      
      console.log('Email message object prepared, attempting to send via SendGrid');
      
      try {
        const [response] = await sgMail.send(msg);
        console.log('=== EMAIL SENT SUCCESSFULLY ===');
        console.log(`Status code: ${response?.statusCode}`);
        console.log(`Message ID: ${response?.headers?.['x-message-id'] || messageId}`);
        console.log(`Headers: ${JSON.stringify(response?.headers || {})}`);
        
        // Use SendGrid message ID if available, otherwise use our generated one
        const finalMessageId = response?.headers?.['x-message-id'] || messageId;
        return { messageId: finalMessageId };
      } catch (sendGridError: any) {
        console.error('⚠️ SendGrid API error:');
        console.error(`Status Code: ${sendGridError?.code || 'unknown'}`);
        console.error(`Response: ${sendGridError?.response?.body ? JSON.stringify(sendGridError.response.body) : 'No response body'}`);
        console.error(`Message: ${sendGridError?.message || 'No error message'}`);
        
        // If we have response details, log more information
        if (sendGridError?.response) {
          console.error(`Response status: ${sendGridError.response.statusCode}`);
          console.error(`Response headers: ${JSON.stringify(sendGridError.response.headers || {})}`);
        }
        
        throw new Error(`SendGrid API error: ${sendGridError?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('⚠️ General email sending error:');
      console.error(`Type: ${error?.constructor?.name || 'Unknown error type'}`);
      console.error(`Message: ${error?.message || 'No error message'}`);
      console.error(`Stack: ${error?.stack || 'No stack trace'}`);
      console.error(`Details: ${JSON.stringify(error || {})}`);
      
      throw new Error(`Failed to send email: ${error?.message || 'Unknown error'}`);
    }
  },
  
  // Send Flappy-generated content to a user
  async sendFlappyEmail(
    user: User, 
    contentType: FlappyContentType, 
    context?: string,
    conversationId?: string,
    inReplyTo?: string,
    references?: string
  ): Promise<Email> {
    console.log(`🤖 Generating Flappy email with content type: ${contentType}`);
    console.log(`📝 Context length: ${context?.length || 0} characters`);
    console.log(`🔄 Conversation ID: ${conversationId || 'none'}`);
    console.log(`📧 In-Reply-To: ${inReplyTo || 'none'}`);
    
    // Create user info object for better personalization
    const userInfo = {
      username: user.username,
      email: user.email,
      userId: user.id,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isFirstMessage: false // This is a response, not a first message
    };
    
    // Generate content from Flappy with proper user context
    const flappyResponse = await generateFlappyContent(contentType, context, userInfo);
    
    console.log(`✅ Generated Flappy response:`);
    console.log(`   Subject: ${flappyResponse.subject}`);
    console.log(`   Content length: ${flappyResponse.content.length} characters`);
    
    // Use the subject from the AI response instead of hardcoded ones
    const subject = flappyResponse.subject;
    
    // Add a friendly signature
    const signature = "\n\nFeathery thoughts,\nFlappy 🦢";
    const fullContent = `${flappyResponse.content}${signature}`;
    
    // Create an email record first in pending state
    const emailData: InsertEmail = {
      userId: user.id,
      subject,
      content: fullContent,
      sentAt: new Date(),
      type: contentType === 'journalResponse' ? "journal_acknowledgment" : "conversation_reply",
      isRead: false,
      messageId: '', // Will be filled in after sending
      conversationId: conversationId || undefined,
      direction: 'outbound',
      isJournalEntry: false,
      to: user.email,
      from: FROM_EMAIL
    };
    
    try {
      // Send the email with threading headers
      const { messageId } = await this.sendEmail(
        user.email,
        subject,
        fullContent,
        user.isPremium, // Premium users don't get ads
        inReplyTo,
        references
      );
      
      // Update the message ID
      emailData.messageId = messageId;
      
      // Save to database
      const email = await storage.createEmail(emailData);
      console.log(`✅ Email ${email.id} saved to database with message ID: ${messageId}`);
      
      return email;
    } catch (error) {
      console.error('❌ Failed to send Flappy email:', error);
      throw error;
    }
  },
  
  // Process an incoming email (reply or new)
  async processIncomingEmail(
    from: string, 
    subject: string, 
    content: string, 
    incomingMessageId?: string,
    inReplyTo?: string,
    references?: string
  ): Promise<void> {
    console.log('🌟 === INCOMING EMAIL PROCESSING STARTED === 🌟');
    console.log(`📧 SENDER: ${from}`);
    console.log(`📝 SUBJECT: ${subject}`);
    console.log(`📊 CONTENT LENGTH: ${content.length} characters`);
    console.log(`🔄 REPLY-TO MESSAGE ID: ${inReplyTo || 'Not a reply'}`);
    console.log(`📄 CONTENT PREVIEW: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    
    // Clean up content (remove signatures, quoting, etc.)
    const cleanContent = cleanEmailContent(content);
    
    // Check if this is a reply to a previous email
    const isReply = !!inReplyTo || subject.toLowerCase().startsWith('re:');
    
    try {
      // Step 1: Find the user by email address
      console.log('👤 STEP 1: Looking up user by email address');
      console.log(`🔍 Searching for user with email: ${from}`);
      const user = await storage.getUserByEmail(from);
      
      if (!user) {
        console.log(`❓ No user found for email: ${from}`);
        
        // Send a welcome message to this email address
        console.log('📤 Sending welcome email to unregistered user');
        
        try {
          const welcomeMessage = `
Hello from Featherweight!

It looks like you've discovered Flappy, your personal journaling companion. 
I'm a friendly pelican AI who can help you maintain a journal through email.

To get started, simply reply to this email with your thoughts, feelings, or experiences,
and I'll help you save them as journal entries. You can also ask me questions or just chat!

Looking forward to our conversations,

Flappy 🦢
`;
          
          await this.sendEmail(
            from,
            'Welcome to Featherweight - Your Personal Journaling Companion',
            welcomeMessage,
            false
          );
          
          console.log(`✅ Welcome email sent successfully to ${from}`);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${from}:`, emailError);
        }
        
        return;
      }
      
      console.log(`✅ Found user: ID=${user.id}, Username=${user.username}, Premium=${user.isPremium}`);
      
      // Check if it looks like a journal entry (when not a reply, and a certain length)
      const shouldBeJournal = !isReply && await this.shouldSaveAsJournal(cleanContent);
      
      if (shouldBeJournal) {
        console.log('📓 Treating email as a journal entry');
        
        // Extract mood and tags from content
        const mood = detectMood(cleanContent);
        const tags = extractTags(cleanContent);
        
        console.log(`🔍 Detected mood: ${mood}`);
        console.log(`🔍 Extracted tags: ${tags.join(', ')}`);
        
        // Create journal entry
        const entry = await storage.createJournalEntry({
          userId: user.id,
          title: subject || "Journal Entry",
          content: cleanContent,
          createdAt: new Date(),
          updatedAt: new Date(),
          mood,
          tags,
          imageUrl: null,
          isPrivate: false
        });
        
        console.log(`✅ Journal entry created with ID: ${entry.id}`);
        
        // Process the content for memories
        await memoryService.processMessage(user.id, cleanContent, 'journal_topic');
        
        // Send acknowledgment email using the correct content type
        await this.sendFlappyEmail(user, 'journalResponse', cleanContent);
        console.log('✅ Journal acknowledgment email sent');
        
        // Create a record of the incoming email
        await storage.createEmail({
          userId: user.id,
          subject,
          content: cleanContent,
          type: 'journal_acknowledgment',
          messageId: incomingMessageId || `incoming-${Date.now()}`,
          tags,
          direction: 'inbound',
          isJournalEntry: true,
          to: REPLY_TO_EMAIL,
          from: user.email
        });
        
        console.log('✅ Email record saved in database');
      } else {
        console.log('💬 Treating email as a conversation message');
        
        // Generate a conversation ID for threading if this is a new conversation
        let conversationId = '';
        if (isReply && inReplyTo) {
          // Try to find previous email by message ID to maintain conversation thread
          const previousThreadEmails = await storage.getEmails(user.id, {
            messageId: inReplyTo
          });
          
          if (previousThreadEmails && previousThreadEmails.length > 0) {
            // Use the conversation ID from the previous email
            conversationId = previousThreadEmails[0].conversationId || '';
          }
        }
        
        // If no conversation ID from previous email, generate a new one
        if (!conversationId) {
          conversationId = memoryService.generateConversationId();
        }
        
        console.log(`🔄 Using conversation ID: ${conversationId}`);
        
        // Save the incoming email first
        const incomingEmail = await storage.createEmail({
          userId: user.id,
          to: REPLY_TO_EMAIL,
          from: user.email,
          subject,
          content: cleanContent,
          sentAt: new Date(),
          type: 'inbound',
          isRead: true,
          direction: 'inbound',
          isJournalEntry: false,
          messageId: incomingMessageId || `incoming-${Date.now()}`,
          conversationId,
          mood: detectMood(cleanContent),
          tags: extractTags(cleanContent)
        });
        
        console.log(`✅ Incoming email saved with ID: ${incomingEmail.id}`);
        
        // Process the content for memories
        await memoryService.processMessage(user.id, cleanContent, 'email');
        
        // Get recent conversation history for this conversation thread
        const recentEmails = await storage.getEmails(user.id, {
          conversationId,
          limit: 5
        });
        
        // Build conversation context from recent emails
        let conversationHistory = '';
        if (recentEmails && recentEmails.length > 0) {
          conversationHistory = recentEmails
            .filter(email => email.id !== incomingEmail.id) // Exclude the current email
            .sort((a, b) => new Date(a.sentAt || a.createdAt).getTime() - new Date(b.sentAt || b.createdAt).getTime())
            .map(email => {
              const sender = email.direction === 'inbound' ? user.username || 'User' : 'Flappy';
              return `${sender}: ${email.content}`;
            })
            .join('\n\n');
        }
        
        // Get relevant memories to include in the response
        const relevantMemories = await memoryService.getRelevantMemories(user.id, cleanContent);
        const memoryContext = memoryService.formatMemoriesForPrompt(relevantMemories);
        
        console.log(`🧠 Found ${relevantMemories.length} relevant memories to include in response`);
        console.log(`📚 Conversation history length: ${conversationHistory.length} characters`);
        
        // Build full context for Flappy's response
        const fullContext = [
          conversationHistory ? `Recent conversation:\n${conversationHistory}` : '',
          `Current message: ${cleanContent}`,
          memoryContext ? `Relevant memories:\n${memoryContext}` : ''
        ].filter(Boolean).join('\n\n');
        
        console.log(`📋 Full context for AI response: ${fullContext.length} characters`);
        
        // Construct proper threading headers for Flappy's reply
        const incomingUserMessageId = incomingMessageId || `incoming-${Date.now()}@featherweight.world`;
        const inReplyToForFlappysEmail = incomingUserMessageId.replace(/^<|>$/g, '');
        
        // Build References header for Flappy's email
        let referencesForFlappysEmail = references ? references.trim() : '';
        if (referencesForFlappysEmail) {
          referencesForFlappysEmail += ` <${inReplyToForFlappysEmail}>`;
        } else {
          referencesForFlappysEmail = `<${inReplyToForFlappysEmail}>`;
        }

        // Send response email with conversation context and proper threading
        // Use 'emailConversation' content type for proper conversation handling
        const flappyEmail = await this.sendFlappyEmail(
          user, 
          'emailConversation', 
          fullContext,
          conversationId,
          inReplyToForFlappysEmail,
          referencesForFlappysEmail
        );
        
        console.log(`✅ Conversation response email sent with ID: ${flappyEmail.id}`);
        console.log('🎉 === EMAIL CONVERSATION PROCESSING COMPLETED === 🎉');
      }
    } catch (error) {
      console.error('❌ Error processing incoming email:', error);
      throw error;
    }
  },

  // Helper function to determine if content should be saved as a journal entry
  async shouldSaveAsJournal(content: string): Promise<boolean> {
    // Simple heuristics for now - can be enhanced with AI classification later
    const wordCount = content.split(/\s+/).length;
    
    // If it's very short (less than 10 words), probably not a journal entry
    if (wordCount < 10) {
      return false;
    }
    
    // If it's a question or very short message, treat as conversation
    const trimmedContent = content.trim().toLowerCase();
    if (trimmedContent.endsWith('?') && wordCount < 20) {
      return false;
    }
    
    // If it contains greeting words, likely a conversation
    const greetingWords = ['hi', 'hello', 'hey', 'thanks', 'thank you'];
    if (greetingWords.some(word => trimmedContent.startsWith(word))) {
      return false;
    }
    
    // If it's longer than 30 words, likely a journal entry
    if (wordCount > 30) {
      return true;
    }
    
    // For medium length content, check for journal-like indicators
    const journalIndicators = [
      'today', 'yesterday', 'feeling', 'felt', 'think', 'thought', 
      'happened', 'experience', 'learned', 'realized', 'grateful',
      'worried', 'excited', 'anxious', 'happy', 'sad', 'angry'
    ];
    
    const hasJournalIndicators = journalIndicators.some(indicator => 
      trimmedContent.includes(indicator)
    );
    
    return hasJournalIndicators;
  }
};

// Helper functions for email processing

/**
 * Clean email content by removing signatures, quoted text, etc.
 */
function cleanEmailContent(content: string): string {
  let cleaned = content;
  
  // Remove common email signatures and footers
  const signaturePatterns = [
    /--\s*\n[\s\S]*$/m, // Standard email signature delimiter
    /Sent from my iPhone[\s\S]*$/i,
    /Sent from my Android[\s\S]*$/i,
    /Get Outlook for iOS[\s\S]*$/i,
    /Best regards[\s\S]*$/i,
    /Kind regards[\s\S]*$/i,
    /Sincerely[\s\S]*$/i,
  ];
  
  signaturePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove quoted text (lines starting with >)
  const lines = cleaned.split('\n');
  const nonQuotedLines = lines.filter(line => !line.trim().startsWith('>'));
  cleaned = nonQuotedLines.join('\n');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Detect mood from email content
 */
function detectMood(content: string): string {
  const lowerContent = content.toLowerCase();
  
  // Positive mood indicators
  const positiveWords = ['happy', 'excited', 'grateful', 'amazing', 'wonderful', 'great', 'fantastic', 'love', 'joy'];
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  
  // Negative mood indicators
  const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'terrible', 'awful', 'hate', 'depressed'];
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  // Neutral mood indicators
  const neutralWords = ['okay', 'fine', 'normal', 'usual', 'regular'];
  const neutralCount = neutralWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return 'negative';
  } else if (neutralCount > 0) {
    return 'neutral';
  } else {
    return 'neutral'; // Default
  }
}

/**
 * Extract tags from email content
 */
function extractTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Topic-based tags
  const topicMap = {
    'work': ['work', 'job', 'career', 'office', 'meeting', 'project', 'boss', 'colleague'],
    'family': ['family', 'mom', 'dad', 'parent', 'child', 'sibling', 'brother', 'sister'],
    'relationship': ['relationship', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'marriage', 'dating'],
    'health': ['health', 'doctor', 'medicine', 'exercise', 'fitness', 'diet', 'sleep'],
    'travel': ['travel', 'trip', 'vacation', 'flight', 'hotel', 'destination'],
    'learning': ['learn', 'study', 'school', 'university', 'course', 'book', 'education'],
    'hobby': ['hobby', 'music', 'art', 'sport', 'game', 'reading', 'cooking']
  };
  
  Object.entries(topicMap).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  // Mood-based tags
  if (lowerContent.includes('grateful') || lowerContent.includes('thankful')) {
    tags.push('gratitude');
  }
  
  if (lowerContent.includes('goal') || lowerContent.includes('plan') || lowerContent.includes('future')) {
    tags.push('planning');
  }
  
  if (lowerContent.includes('memory') || lowerContent.includes('remember') || lowerContent.includes('past')) {
    tags.push('reflection');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Format email content as HTML
 */
function formatEmailHTML(content: string, isPremium: boolean): string {
  // Convert line breaks to HTML
  let htmlContent = content.replace(/\n/g, '<br>');
  
  // Basic HTML structure
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from Flappy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .content {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .signature {
      margin-top: 20px;
      font-style: italic;
      color: #666;
    }
    .ad {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
      font-size: 14px;
      color: #1976d2;
    }
  </style>
</head>
<body>
  <div class="content">
    ${htmlContent}
  </div>
  ${!isPremium ? '<div class="ad">💎 Upgrade to Premium for ad-free experiences and exclusive features! <a href="https://featherweight.world/upgrade">Learn more</a></div>' : ''}
</body>
</html>`;
  
  return html;
}

