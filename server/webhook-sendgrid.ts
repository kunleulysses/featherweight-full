import { Request, Response } from "express";
import { EmailContentExtractor } from "./email-content-extractor";
import { GmailContentParser } from "./gmail-content-parser";
import { storage } from "./storage";

/**
 * Enhanced SendGrid webhook handler with comprehensive content extraction
 */
export async function handleSendGridWebhook(req: Request, res: Response) {
  console.log('🔔 === SENDGRID WEBHOOK RECEIVED === 🔔');
  console.log(`Request received at: ${new Date().toISOString()}`);
  console.log(`Content-Type: ${req.headers['content-type']}`);
  console.log(`Content-Length: ${req.headers['content-length']}`);
  
  try {
    let extractedData: {
      sender: string;
      subject: string;
      content: string;
      inReplyTo?: string;
    };

    // Handle different content types
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      console.log('📋 Processing multipart/form-data');
      
      // Handle multipart form data directly from req.body object  
      if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        console.log('📊 Direct form data extraction SUCCESS');
        console.log('Available fields:', Object.keys(req.body));
        console.log('Raw form data:', JSON.stringify(req.body, null, 2));
        
        extractedData = {
          sender: req.body.from || 'unknown@example.com',
          subject: req.body.subject || 'No Subject', 
          content: req.body.text || req.body.body || req.body.subject || '',
          inReplyTo: req.body['in-reply-to'] || req.body.inReplyTo
        };
        
        console.log(`✅ SUCCESSFUL Direct extraction:`, extractedData);
      } else {
        console.log('❌ Form data extraction failed, req.body:', req.body);
        console.log('❌ req.body type:', typeof req.body);
        console.log('❌ req.body keys:', req.body ? Object.keys(req.body) : 'no body');
        
        // Fallback to buffer parsing
        const bufferString = req.body ? req.body.toString() : '';
        console.log(`📊 Buffer fallback - length: ${bufferString.length} characters`);
        
        if (bufferString.length === 0) {
          console.log('❌ Empty buffer received');
          return res.status(400).json({ error: 'Empty request body' });
        }
        
        extractedData = GmailContentParser.parseContent(bufferString);
      }
      
    } else if (contentType.includes('application/json')) {
      console.log('📋 Processing JSON webhook data');
      const data = req.body;
      
      extractedData = {
        sender: data.from || data.sender?.email || 'unknown@example.com',
        subject: data.subject || 'No Subject',
        content: data.text || data.body || '',
        inReplyTo: data.headers?.['In-Reply-To'] || data['in-reply-to']
      };
      
    } else {
      console.log('📋 Processing raw/unknown content type');
      const rawBody = req.body ? req.body.toString() : '';
      
      // Try to extract from raw body
      extractedData = EmailContentExtractor.extractFromMultipart(rawBody);
    }
    
    console.log(`✅ Content extracted:`, {
      sender: extractedData.sender,
      subject: extractedData.subject,
      contentLength: extractedData.content.length,
      contentPreview: extractedData.content.substring(0, 100),
      inReplyTo: extractedData.inReplyTo
    });
    
    // Validate extracted content
    if (!extractedData.content || extractedData.content.trim().length === 0) {
      console.log('❌ No meaningful content extracted from email');
      return res.status(400).json({ 
        error: 'No content could be extracted from the email',
        debug: {
          sender: extractedData.sender,
          subject: extractedData.subject,
          contentType: contentType
        }
      });
    }
    
    // Find user by email
    const emailAddress = extractedData.sender.toLowerCase();
    let user;
    
    // Try to extract email from "Name <email@domain.com>" format
    const emailMatch = emailAddress.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : emailAddress;
    
    user = await storage.getUserByEmail(cleanEmail);
    
    if (!user) {
      console.log(`❌ No user found for email: ${cleanEmail}`);
      return res.status(404).json({ 
        error: 'User not found for email address',
        email: cleanEmail
      });
    }
    
    console.log(`✅ Found user: ${user.username} (ID: ${user.id})`);
    
    // Save the inbound email
    const savedEmail = await storage.createEmail({
      userId: user.id,
      subject: extractedData.subject,
      content: extractedData.content,
      type: 'inbound' as any
    });
    
    console.log(`✅ Saved inbound email (ID: ${savedEmail.id})`);
    
    // Process the email content and generate contextual response
    try {
      const conversationService = await import('./conversation-service.js');
      
      const conversation = await conversationService.conversationService.processMessage(
        user.id, 
        extractedData.content,
        false // Don't auto-save as journal - let user decide
      );
      
      console.log(`✅ Generated contextual response successfully`);
      
      return res.json({
        success: true,
        message: 'Email processed successfully and contextual response generated',
        emailId: savedEmail.id,
        conversationId: conversation?.id,
        responseGenerated: true,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (conversationError: any) {
      console.error('❌ Error in conversation processing:', conversationError);
      
      // Still return success for email processing even if conversation fails
      return res.json({
        success: true,
        message: 'Email processed successfully, conversation response pending',
        emailId: savedEmail.id,
        responseGenerated: false,
        conversationError: conversationError.message,
        user: {
          id: user.id,
          username: user.username
        }
      });
    }
    
  } catch (error: any) {
    console.error('❌ Error processing SendGrid webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing email',
      message: error?.message || 'Unknown error'
    });
  }
}