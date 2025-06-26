import { storage } from "./storage";
import { emailService } from "./email";
import { simpleParser } from "mailparser";
import { EmailQueueItem } from "@shared/schema";
import { EmailContentExtractor } from "./email-content-extractor";
import { GmailContentParser } from "./gmail-content-parser";

// Process interval in milliseconds (check for new emails every 10 seconds)
const PROCESS_INTERVAL = 10000;

// Maximum number of attempts to process an email before giving up
const MAX_ATTEMPTS = 5;

// Set to track processed emails to prevent duplicates
const processedEmails = new Set<string>();

/**
 * Process a single email from the queue with enhanced error handling
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
        
        // Debug: Show first 500 chars of multipart data
        console.log(`🔍 Multipart data preview: ${bufferString.substring(0, 500)}...`);
        
        // Use Gmail-specific content parser for better extraction
        const extracted = GmailContentParser.parseContent(bufferString);
        
        console.log(`🔍 Gmail parsing results:`);
        console.log(`   Sender: ${extracted.sender}`);
        console.log(`   Subject: ${extracted.subject}`);
        console.log(`   Content length: ${extracted.content.length} characters`);
        console.log(`   Content preview: ${extracted.content.substring(0, 100)}...`);
        console.log(`   In-Reply-To: ${extracted.inReplyTo || 'none'}`);

        // Extract additional headers for proper threading
        await emailService.processIncomingEmail(
          extracted.sender,
          extracted.subject,
          extracted.content,
          extracted.messageId,
          extracted.inReplyTo,
          extracted.references
        );
        
        await storage.markEmailCompleted(queueItem.id);
        return true;
      } else {
        // Handle as regular MIME email
        const parsedEmail = await simpleParser(buffer);
        await emailService.processIncomingEmail(
          parsedEmail.from?.text || 'unknown@example.com',
          parsedEmail.subject || 'No Subject',
          parsedEmail.text || parsedEmail.html || '',
          parsedEmail.messageId?.replace(/^<|>$/g, ''),
          parsedEmail.inReplyTo?.replace(/^<|>$/g, ''),
          parsedEmail.references ? (Array.isArray(parsedEmail.references) ? parsedEmail.references.join(' ') : parsedEmail.references) : undefined
        );
        
        await storage.markEmailCompleted(queueItem.id);
        return true;
      }
      
    } else if (payload && payload.buffer) {
      // If we have base64 encoded buffer data
      console.log(`🔍 Detected buffer payload format`);
      const buffer = Buffer.from(payload.buffer as string, 'base64');
      console.log(`🔍 Buffer size: ${buffer.length} bytes`);
      await processRawEmail(buffer);
      await storage.markEmailCompleted(queueItem.id);
      return true;
      
    } else if (payload && payload.text && payload.from && payload.subject) {
      // Handle direct JSON payload (e.g., from manual testing or other sources)
      console.log(`🔍 Processing direct JSON payload`);
      await emailService.processIncomingEmail(
        payload.from,
        payload.subject,
        payload.text,
        payload.inReplyTo
      );
      
    } else if (typeof payload === 'string') {
      // Handle string payload (might be raw email content)
      console.log(`🔍 Processing string payload`);
      await processEmailFromText(payload);
      
    } else {
      console.warn(`⚠️ Unknown payload format:`, typeof payload);
      console.warn(`⚠️ Payload preview:`, JSON.stringify(payload).substring(0, 200));
      
      // Try to extract basic fields from payload
      const from = extractField(payload, ['from', 'sender', 'email']);
      const subject = extractField(payload, ['subject', 'title']);
      const text = extractField(payload, ['text', 'body', 'content', 'message']);
      
      if (from && text) {
        console.log(`🔍 Extracted basic fields from unknown payload format`);
        await emailService.processIncomingEmail(from, subject || 'No Subject', text);
      } else {
        throw new Error(`Unable to process payload format: ${typeof payload}`);
      }
    }
    
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
 * Process a raw email buffer using mailparser
 */
async function processRawEmail(buffer: Buffer): Promise<void> {
  try {
    const parsedEmail = await simpleParser(buffer);
    
    const from = parsedEmail.from?.text || 'unknown@example.com';
    const subject = parsedEmail.subject || 'No Subject';
    const text = parsedEmail.text || parsedEmail.html || '';
    const inReplyTo = parsedEmail.inReplyTo || undefined;
    
    console.log(`📧 Parsed email from: ${from}, subject: ${subject}, content length: ${text.length}`);
    
    await emailService.processIncomingEmail(from, subject, text, inReplyTo);
  } catch (error) {
    console.error(`❌ Error parsing raw email:`, error);
    throw error;
  }
}

/**
 * Process email from text content
 */
async function processEmailFromText(text: string): Promise<void> {
  try {
    // Try to parse as JSON first
    const emailData = JSON.parse(text);
    
    const from = emailData.from || emailData.sender || 'unknown@example.com';
    const subject = emailData.subject || emailData.title || 'No Subject';
    const content = emailData.text || emailData.body || emailData.content || '';
    const inReplyTo = emailData.inReplyTo || emailData['in-reply-to'] || undefined;
    
    await emailService.processIncomingEmail(from, subject, content, inReplyTo);
  } catch (error) {
    // If not JSON, treat as raw email content
    console.log(`🔍 Processing as raw email text`);
    await processRawEmail(Buffer.from(text, 'utf8'));
  }
}

/**
 * Process an email from parsed email data
 */
async function processEmailFromParsed(parsed: any): Promise<void> {
  const from = parsed.from || 'unknown@example.com';
  const subject = parsed.subject || 'No Subject';
  const text = parsed.text || parsed.body || '';
  const inReplyTo = parsed.inReplyTo || undefined;
  
  await emailService.processIncomingEmail(from, subject, text, inReplyTo);
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
  console.log(`🚀 Starting email processing service...`);
  
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
 * Helper function to extract headers from various payload formats
 */
function extractHeaders(payload: any): Record<string, string> | null {
  if (payload && payload.headers) {
    if (typeof payload.headers === 'string') {
      try {
        return JSON.parse(payload.headers);
      } catch {
        return null;
      }
    }
    return payload.headers;
  }
  return null;
}

/**
 * Helper function to extract In-Reply-To from payload or headers
 */
function extractInReplyTo(payload: any, headers: Record<string, string> | null): string {
  // Check payload first
  if (payload && payload.inReplyTo) {
    return payload.inReplyTo;
  }
  
  // Check headers
  if (headers) {
    const inReplyTo = headers['In-Reply-To'] || headers['in-reply-to'];
    if (inReplyTo) {
      // Extract message ID from angle brackets if present
      const match = inReplyTo.match(/<([^>]+)>/);
      return match ? match[1] : inReplyTo;
    }
  }
  
  return '';
}

/**
 * Helper function to extract a sender's email address from various formats
 */
function extractSenderEmail(from: string): string {
  if (!from) return 'unknown@example.com';
  
  // Extract email from "Name <email@domain.com>" format
  const emailMatch = from.match(/<([^>]+)>/);
  if (emailMatch) {
    return emailMatch[1];
  }
  
  // Check if it's already just an email
  if (from.includes('@')) {
    return from.trim();
  }
  
  return 'unknown@example.com';
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