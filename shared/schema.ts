import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userMessage: text("user_message").notNull(),
  flappyResponse: text("flappy_response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  conversationType: text("conversation_type").default("general").notNull(), // general, journal, etc.
  savedAsJournal: boolean("saved_as_journal").default(false).notNull(),
  journalEntryId: integer("journal_entry_id"), // If saved as a journal entry
  messageTags: json("message_tags").$type<string[]>(),
  mood: text("mood"), // happy, calm, neutral, sad, frustrated
  reflectionPrompt: text("reflection_prompt"), // Interactive reflection prompt for follow-up questions
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  smsConsent: boolean("sms_consent").default(false).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  premiumUntil: timestamp("premium_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  preferences: json("preferences").$type<UserPreferences>(),
  paymentDetails: json("payment_details").$type<PaymentDetails>(),
  // Password reset fields
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  mood: text("mood"), // happy, calm, neutral, sad, frustrated
  tags: json("tags").$type<string[]>(),
  imageUrl: text("image_url"),
  emailId: text("email_id"), // To track which email this entry is responding to
});

// Payment methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  cardBrand: text("card_brand").notNull(), // visa, mastercard, etc.
  cardLast4: text("card_last4").notNull(),
  cardExpMonth: integer("card_exp_month").notNull(),
  cardExpYear: integer("card_exp_year").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Billing transactions table
export const billingTransactions = pgTable("billing_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeInvoiceId: text("stripe_invoice_id"),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").default("usd").notNull(),
  status: text("status").notNull(), // succeeded, failed, pending
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Emails table to track sent emails
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  type: text("type").notNull(), // daily_inspiration, journal_acknowledgment, weekly_insight, inbound, conversation_reply
  isRead: boolean("is_read").default(false),
  messageId: text("message_id"), // Email message ID for tracking
  conversationId: text("conversation_id"), // Conversation thread ID
  direction: text("direction"), // "inbound" or "outbound"
  isJournalEntry: boolean("is_journal_entry").default(false),
  to: text("to"), // Recipient email address
  from: text("from"), // Sender email address
  mood: text("mood"), // Detected mood from content
  tags: json("tags").$type<string[]>(), // Extracted tags
});

// SMS messages table to track SMS conversations
export const smsMessages = pgTable("sms_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  phoneNumber: text("phone_number").notNull(), // User's phone number
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  direction: text("direction").notNull(), // "inbound" or "outbound"
  twilioSid: text("twilio_sid"), // Twilio message SID for tracking
  isJournalEntry: boolean("is_journal_entry").default(false), // Is this message a journal entry
  journalEntryId: integer("journal_entry_id"), // Reference to created journal entry if applicable
  conversationId: text("conversation_id"), // Unique identifier for conversation thread
});

// Conversation memory table to track interaction history
export const conversationMemories = pgTable("conversation_memories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // "email", "sms", "journal_topic", "conversation"
  topic: text("topic"), // Extracted topic or theme
  sentiment: text("sentiment"), // Extracted sentiment
  importance: integer("importance").default(1), // 1-5 scale of importance
  lastDiscussed: timestamp("last_discussed").defaultNow().notNull(),
  frequency: integer("frequency").default(1), // How many times this has been discussed
  firstMentionedAt: timestamp("first_mentioned_at").defaultNow().notNull(),
  context: text("context").notNull(), // Brief context about this topic
  relatedEntryIds: json("related_entry_ids").$type<number[]>(), // IDs of related journal entries
  isResolved: boolean("is_resolved").default(false), // Whether this topic has been resolved
  category: text("category"), // Category such as work, relationships, health, etc.
  emotionalTone: text("emotional_tone"), // More nuanced emotional analysis
  growthOpportunity: text("growth_opportunity"), // Potential area for personal growth related to this topic
});

// Email queue table for asynchronous processing
export const emailQueue = pgTable("email_queue", {
  id: serial("id").primaryKey(),
  payload: jsonb("payload").notNull(),
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  processAttempts: integer("process_attempts").default(0).notNull(),
  errorMessage: text("error_message"),
  processedAt: timestamp("processed_at"),
});

// Types for JSON fields
export type UserPreferences = {
  emailFrequency: "daily" | "weekdays" | "weekends" | "weekly";
  marketingEmails: boolean;
  receiveInsights: boolean;
  theme?: "light" | "dark" | "system";
  receiveSms?: boolean;
  smsConsent?: boolean;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  emailDeliveryTime?: string; // Time of day for daily emails, format: "HH:MM" in 24hr format
  disableDailyEmails?: boolean; // Option to turn off daily inspirations
};

export type PaymentDetails = {
  lastFour: string;
  cardBrand?: string;
  billingDate: number;
  expiryMonth: number;
  expiryYear: number;
};

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users)
  .omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true, 
    preferences: true,
    isPremium: true,
    premiumUntil: true,
    resetToken: true,
    resetTokenExpires: true,
    paymentDetails: true
  })
  .extend({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional().refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Please enter a valid phone number in E.164 format (e.g., +14155552671)"
    }),
    smsConsent: z.boolean().optional(),
  });

export const insertJournalEntrySchema = createInsertSchema(journalEntries)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    content: z.string().min(1, { message: "Journal entry cannot be empty" }),
    title: z.string().optional(),
    mood: z.enum(["happy", "calm", "neutral", "sad", "frustrated"]).optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
    emailId: z.string().optional(),
  });

export const insertEmailSchema = createInsertSchema(emails)
  .omit({ id: true, sentAt: true, isRead: true })
  .extend({
    subject: z.string().min(1, { message: "Email subject cannot be empty" }),
    content: z.string().min(1, { message: "Email content cannot be empty" }),
    type: z.enum(["daily_inspiration", "journal_acknowledgment", "weekly_insight", "inbound", "conversation_reply"]),
    direction: z.enum(["inbound", "outbound"]).optional(),
    conversationId: z.string().optional(),
    messageId: z.string().optional(),
    isJournalEntry: z.boolean().default(false).optional(),
    to: z.string().optional(),
    from: z.string().optional(),
    mood: z.string().optional(),
    tags: z.array(z.string()).optional(),
  });

export const insertSmsMessageSchema = createInsertSchema(smsMessages)
  .omit({ id: true, sentAt: true })
  .extend({
    content: z.string().min(1, { message: "Message content cannot be empty" }),
    direction: z.enum(["inbound", "outbound"]),
    isJournalEntry: z.boolean().default(false).optional(),
    conversationId: z.string().optional(),
  });

export const insertConversationMemorySchema = createInsertSchema(conversationMemories)
  .omit({ id: true, lastDiscussed: true, firstMentionedAt: true })
  .extend({
    type: z.enum(["email", "sms", "journal_topic", "conversation"]),
    topic: z.string().min(1, { message: "Topic cannot be empty" }),
    sentiment: z.string().optional(),
    importance: z.number().int().min(1).max(5).default(1),
    frequency: z.number().int().min(1).default(1),
    context: z.string().min(1, { message: "Context cannot be empty" }),
    relatedEntryIds: z.array(z.number()).optional(),
    isResolved: z.boolean().default(false).optional(),
  });

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods)
  .omit({ id: true, createdAt: true })
  .extend({
    cardBrand: z.string().min(1, { message: "Card brand cannot be empty" }),
    cardLast4: z.string().length(4, { message: "Card last 4 digits must be 4 characters" }),
    cardExpMonth: z.number().int().min(1).max(12),
    cardExpYear: z.number().int().min(new Date().getFullYear()),
  });

export const insertBillingTransactionSchema = createInsertSchema(billingTransactions)
  .omit({ id: true, createdAt: true })
  .extend({
    amount: z.number().int().positive(),
    status: z.enum(["succeeded", "failed", "pending"]),
  });

export const updateUserPreferencesSchema = z.object({
  emailFrequency: z.enum(["daily", "weekdays", "weekends", "weekly"]),
  marketingEmails: z.boolean().default(false),
  receiveInsights: z.boolean().default(true),
  bio: z.string().max(160).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  receiveSms: z.boolean().default(false).optional(),
  smsConsent: z.boolean().default(false).optional(),
  emailDeliveryTime: z.string().optional(),
  disableDailyEmails: z.boolean().optional(),
  phoneNumber: z.string().optional().refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
    message: "Please enter a valid phone number in E.164 format (e.g., +14155552671)"
  }),
});

// Export types for use in application
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type Email = typeof emails.$inferSelect;
export type SmsMessage = typeof smsMessages.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type BillingTransaction = typeof billingTransactions.$inferSelect;
export type ConversationMemory = typeof conversationMemories.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type EmailQueueItem = typeof emailQueue.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type InsertBillingTransaction = z.infer<typeof insertBillingTransactionSchema>;
export type InsertConversationMemory = z.infer<typeof insertConversationMemorySchema>;
export type UpdateUserPreferences = z.infer<typeof updateUserPreferencesSchema>;

// Conversation schema
export const insertConversationSchema = createInsertSchema(conversations)
  .omit({ id: true, createdAt: true, journalEntryId: true })
  .extend({
    userMessage: z.string().min(1, { message: "Message cannot be empty" }),
    flappyResponse: z.string().min(1, { message: "Response cannot be empty" }),
    conversationType: z.enum(["general", "journal"]).default("general"),
    savedAsJournal: z.boolean().default(false),
  });

export const insertEmailQueueSchema = createInsertSchema(emailQueue)
  .omit({ id: true, createdAt: true, updatedAt: true, processedAt: true, processAttempts: true })
  .extend({
    payload: z.record(z.any()),
    status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
    errorMessage: z.string().optional(),
  });

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertEmailQueue = z.infer<typeof insertEmailQueueSchema>;
