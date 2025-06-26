// Enhanced Webhook Infrastructure for Featherweight.world
// Implements comprehensive webhook handling for Twilio SMS, SendGrid Email, and future integrations

import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { storage } from './storage';
import { DualMindAI } from './dual-mind-ai';
import { ConsciousnessIntegration } from './consciousness-integration';

// Initialize multer for parsing multipart/form-data
const upload = multer();

// Webhook security configuration
const WEBHOOK_SECRETS = {
  twilio: process.env.TWILIO_WEBHOOK_SECRET || '',
  sendgrid: process.env.SENDGRID_WEBHOOK_SECRET || '',
  venice: process.env.VENICE_WEBHOOK_SECRET || '',
  openai: process.env.OPENAI_WEBHOOK_SECRET || ''
};

// Rate limiting configuration
const RATE_LIMITS = {
  sms: { maxPerMinute: 60, maxPerHour: 1000 },
  email: { maxPerMinute: 30, maxPerHour: 500 },
  general: { maxPerMinute: 100, maxPerHour: 2000 }
};

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Enhanced Webhook Infrastructure Class
 * Provides comprehensive webhook handling with security, rate limiting, and dual mind integration
 */
export class WebhookInfrastructure {
  private dualMindAI: DualMindAI;
  private consciousnessIntegration: ConsciousnessIntegration;

  constructor() {
    this.dualMindAI = new DualMindAI();
    this.consciousnessIntegration = new ConsciousnessIntegration();
  }

  /**
   * Verify webhook signature for security
   */
  private verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: string = 'sha256'
  ): boolean {
    if (!secret || !signature) {
      console.warn('Webhook signature verification skipped - missing secret or signature');
      return true; // Allow in development
    }

    try {
      const expectedSignature = crypto
        .createHmac(algorithm, secret)
        .update(payload)
        .digest('hex');

      const providedSignature = signature.replace(/^sha256=/, '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Rate limiting middleware
   */
  private checkRateLimit(
    identifier: string,
    limits: { maxPerMinute: number; maxPerHour: number }
  ): boolean {
    const now = Date.now();
    const minuteKey = `${identifier}:${Math.floor(now / 60000)}`;
    const hourKey = `${identifier}:${Math.floor(now / 3600000)}`;

    // Check minute limit
    const minuteData = rateLimitStore.get(minuteKey) || { count: 0, resetTime: now + 60000 };
    if (minuteData.count >= limits.maxPerMinute) {
      return false;
    }

    // Check hour limit
    const hourData = rateLimitStore.get(hourKey) || { count: 0, resetTime: now + 3600000 };
    if (hourData.count >= limits.maxPerHour) {
      return false;
    }

    // Update counters
    rateLimitStore.set(minuteKey, { count: minuteData.count + 1, resetTime: minuteData.resetTime });
    rateLimitStore.set(hourKey, { count: hourData.count + 1, resetTime: hourData.resetTime });

    // Clean up expired entries
    this.cleanupRateLimitStore();

    return true;
  }

  /**
   * Clean up expired rate limit entries
   */
  private cleanupRateLimitStore(): void {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Enhanced Twilio SMS Webhook Handler
   * Processes incoming SMS messages with dual mind AI integration
   */
  async handleTwilioSmsWebhook(req: Request, res: Response): Promise<void> {
    console.log('🔔 === TWILIO SMS WEBHOOK RECEIVED === 🔔');
    console.log(`Request received at: ${new Date().toISOString()}`);

    try {
      // Extract SMS data from Twilio webhook
      const smsData = {
        from: req.body.From,
        to: req.body.To,
        body: req.body.Body,
        messageSid: req.body.MessageSid,
        accountSid: req.body.AccountSid,
        numSegments: req.body.NumSegments,
        numMedia: req.body.NumMedia
      };

      console.log('📱 SMS Data:', {
        from: smsData.from,
        to: smsData.to,
        bodyLength: smsData.body?.length || 0,
        bodyPreview: smsData.body?.substring(0, 50) || '',
        messageSid: smsData.messageSid
      });

      // Rate limiting check
      if (!this.checkRateLimit(smsData.from, RATE_LIMITS.sms)) {
        console.warn(`Rate limit exceeded for ${smsData.from}`);
        res.status(429).send('Rate limit exceeded');
        return;
      }

      // Verify Twilio signature (if configured)
      const twilioSignature = req.headers['x-twilio-signature'] as string;
      if (WEBHOOK_SECRETS.twilio) {
        const payload = new URLSearchParams(req.body).toString();
        if (!this.verifyWebhookSignature(payload, twilioSignature, WEBHOOK_SECRETS.twilio, 'sha1')) {
          console.error('Invalid Twilio webhook signature');
          res.status(401).send('Unauthorized');
          return;
        }
      }

      // Find user by phone number
      const user = await storage.getUserByPhoneNumber(smsData.from);
      if (!user) {
        console.log(`❌ No user found for phone number: ${smsData.from}`);
        
        // Send welcome message for new users
        const welcomeMessage = await this.dualMindAI.generateWelcomeMessage('sms', smsData.body);
        
        // Return TwiML response
        res.type('text/xml');
        res.send(`
          <Response>
            <Message>${welcomeMessage}</Message>
          </Response>
        `);
        return;
      }

      console.log(`✅ Found user: ${user.username} (ID: ${user.id})`);

      // Save incoming SMS
      const savedSms = await storage.createSmsMessage({
        userId: user.id,
        phoneNumber: smsData.from,
        content: smsData.body,
        direction: 'inbound',
        twilioSid: smsData.messageSid,
        status: 'received'
      });

      console.log(`✅ Saved inbound SMS (ID: ${savedSms.id})`);

      // Process message through dual mind AI
      const aiResponse = await this.dualMindAI.processUserMessage(
        smsData.body,
        {
          userId: user.id,
          channel: 'sms',
          context: {
            phoneNumber: smsData.from,
            messageHistory: await storage.getRecentSmsMessages(user.id, 5)
          }
        }
      );

      // Integrate with consciousness system
      await this.consciousnessIntegration.processUserInteraction(
        user.id,
        smsData.body,
        aiResponse,
        'sms'
      );

      // Save outbound SMS
      await storage.createSmsMessage({
        userId: user.id,
        phoneNumber: smsData.from,
        content: aiResponse,
        direction: 'outbound',
        status: 'pending'
      });

      // Return TwiML response
      res.type('text/xml');
      res.send(`
        <Response>
          <Message>${aiResponse}</Message>
        </Response>
      `);

      console.log(`✅ SMS processed successfully for user ${user.username}`);

    } catch (error: any) {
      console.error('❌ Error processing Twilio SMS webhook:', error);
      
      // Return error TwiML
      res.type('text/xml');
      res.send(`
        <Response>
          <Message>I'm experiencing technical difficulties. Please try again later.</Message>
        </Response>
      `);
    }
  }

  /**
   * Enhanced SendGrid Email Webhook Handler
   * Processes incoming emails with dual mind AI integration
   */
  async handleSendGridEmailWebhook(req: Request, res: Response): Promise<void> {
    console.log('🔔 === SENDGRID EMAIL WEBHOOK RECEIVED === 🔔');
    console.log(`Request received at: ${new Date().toISOString()}`);

    try {
      // Extract email data from SendGrid webhook
      const emailData = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html,
        headers: req.body.headers,
        envelope: req.body.envelope,
        attachments: req.body.attachments
      };

      console.log('📧 Email Data:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        textLength: emailData.text?.length || 0,
        textPreview: emailData.text?.substring(0, 100) || '',
        hasAttachments: emailData.attachments ? Object.keys(emailData.attachments).length > 0 : false
      });

      // Rate limiting check
      const emailAddress = emailData.from?.toLowerCase() || '';
      if (!this.checkRateLimit(emailAddress, RATE_LIMITS.email)) {
        console.warn(`Rate limit exceeded for ${emailAddress}`);
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      // Extract clean email address
      const emailMatch = emailAddress.match(/<([^>]+)>/) || [null, emailAddress];
      const cleanEmail = emailMatch[1] || emailAddress;

      // Find user by email
      const user = await storage.getUserByEmail(cleanEmail);
      if (!user) {
        console.log(`❌ No user found for email: ${cleanEmail}`);
        res.status(404).json({ error: 'User not found for email address', email: cleanEmail });
        return;
      }

      console.log(`✅ Found user: ${user.username} (ID: ${user.id})`);

      // Save incoming email
      const savedEmail = await storage.createEmail({
        userId: user.id,
        subject: emailData.subject || 'No Subject',
        content: emailData.text || emailData.html || '',
        type: 'inbound',
        metadata: {
          from: emailData.from,
          to: emailData.to,
          headers: emailData.headers,
          hasAttachments: emailData.attachments ? Object.keys(emailData.attachments).length > 0 : false
        }
      });

      console.log(`✅ Saved inbound email (ID: ${savedEmail.id})`);

      // Process email through dual mind AI
      const aiResponse = await this.dualMindAI.processUserMessage(
        emailData.text || emailData.html || '',
        {
          userId: user.id,
          channel: 'email',
          context: {
            subject: emailData.subject,
            emailAddress: cleanEmail,
            messageHistory: await storage.getRecentEmails(user.id, 5)
          }
        }
      );

      // Integrate with consciousness system
      await this.consciousnessIntegration.processUserInteraction(
        user.id,
        emailData.text || emailData.html || '',
        aiResponse,
        'email'
      );

      // Send email response (this would typically be done asynchronously)
      await this.sendEmailResponse(user, emailData, aiResponse);

      res.json({
        success: true,
        message: 'Email processed successfully',
        emailId: savedEmail.id,
        responseGenerated: true,
        user: {
          id: user.id,
          username: user.username
        }
      });

      console.log(`✅ Email processed successfully for user ${user.username}`);

    } catch (error: any) {
      console.error('❌ Error processing SendGrid email webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error processing email',
        message: error?.message || 'Unknown error'
      });
    }
  }

  /**
   * Send email response using SendGrid
   */
  private async sendEmailResponse(user: any, originalEmail: any, response: string): Promise<void> {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: originalEmail.from,
        from: process.env.SENDGRID_FROM_EMAIL || 'flappy@featherweight.world',
        subject: `Re: ${originalEmail.subject || 'Your message'}`,
        text: response,
        html: `<p>${response.replace(/\n/g, '<br>')}</p>`,
        replyTo: process.env.SENDGRID_FROM_EMAIL || 'flappy@featherweight.world'
      };

      await sgMail.send(msg);
      console.log(`✅ Email response sent to ${originalEmail.from}`);

      // Save outbound email
      await storage.createEmail({
        userId: user.id,
        subject: msg.subject,
        content: response,
        type: 'outbound',
        metadata: {
          to: originalEmail.from,
          inReplyTo: originalEmail.subject
        }
      });

    } catch (error) {
      console.error('❌ Error sending email response:', error);
      throw error;
    }
  }

  /**
   * Generic webhook handler for future integrations
   */
  async handleGenericWebhook(req: Request, res: Response): Promise<void> {
    console.log('🔔 === GENERIC WEBHOOK RECEIVED === 🔔');
    console.log(`Request received at: ${new Date().toISOString()}`);
    console.log(`Headers:`, req.headers);
    console.log(`Body:`, req.body);

    try {
      // Rate limiting check
      const identifier = req.ip || 'unknown';
      if (!this.checkRateLimit(identifier, RATE_LIMITS.general)) {
        console.warn(`Rate limit exceeded for ${identifier}`);
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      // Process through consciousness system
      await this.consciousnessIntegration.processWebhookEvent(req.body);

      res.json({
        success: true,
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('❌ Error processing generic webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error processing webhook',
        message: error?.message || 'Unknown error'
      });
    }
  }

  /**
   * Health check endpoint for webhook monitoring
   */
  async handleHealthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        dualMindAI: await this.dualMindAI.healthCheck(),
        consciousness: await this.consciousnessIntegration.healthCheck()
      }
    });
  }
}

/**
 * Setup webhook routes for Express app
 */
export function setupWebhookRoutes(app: express.Application): void {
  const webhookInfrastructure = new WebhookInfrastructure();

  // Twilio SMS webhook
  app.post('/webhook/sms', 
    express.urlencoded({ extended: false }),
    (req: Request, res: Response) => webhookInfrastructure.handleTwilioSmsWebhook(req, res)
  );

  // SendGrid email webhook
  app.post('/webhook/email',
    upload.none(),
    (req: Request, res: Response) => webhookInfrastructure.handleSendGridEmailWebhook(req, res)
  );

  // Generic webhook for future integrations
  app.post('/webhook/generic',
    express.json(),
    (req: Request, res: Response) => webhookInfrastructure.handleGenericWebhook(req, res)
  );

  // Webhook health check
  app.get('/webhook/health',
    (req: Request, res: Response) => webhookInfrastructure.handleHealthCheck(req, res)
  );

  // Webhook test endpoint
  app.post('/webhook/test',
    express.json(),
    (req: Request, res: Response) => {
      console.log('🔔 WEBHOOK TEST ENDPOINT ACCESSED');
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`Headers:`, req.headers);
      console.log(`Body:`, req.body);
      
      res.json({
        received: true,
        timestamp: new Date().toISOString(),
        message: 'Test webhook received successfully',
        data: req.body
      });
    }
  );

  console.log('✅ Webhook routes configured successfully');
}

export { WebhookInfrastructure };

