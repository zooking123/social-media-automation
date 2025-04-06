import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const facebookSettings = pgTable("facebook_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  pageId: text("page_id"),
  uploadFrequency: integer("upload_frequency").default(60),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  status: text("status").notNull().default("pending"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const captions = pgTable("captions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  plan: text("plan").notNull().default("trial"),
  status: text("status").notNull().default("active"),
  expiresAt: timestamp("expires_at"),
  storage: integer("storage").notNull().default(512), // in MB
  tasks: integer("tasks").notNull().default(100),
});

export const usageMetrics = pgTable("usage_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storageUsed: integer("storage_used").notNull().default(0), // in bytes
  tasksUsed: integer("tasks_used").notNull().default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertFacebookSettingsSchema = createInsertSchema(facebookSettings).pick({
  userId: true,
  accessToken: true,
  pageId: true,
  uploadFrequency: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  userId: true,
  title: true,
  filename: true,
  filesize: true,
  status: true,
  scheduledFor: true,
});

export const insertCaptionSchema = createInsertSchema(captions).pick({
  userId: true,
  content: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  plan: true,
  status: true,
  expiresAt: true,
  storage: true,
  tasks: true,
});

export const insertUsageMetricsSchema = createInsertSchema(usageMetrics).pick({
  userId: true,
  storageUsed: true,
  tasksUsed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFacebookSettings = z.infer<typeof insertFacebookSettingsSchema>;
export type FacebookSettings = typeof facebookSettings.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertCaption = z.infer<typeof insertCaptionSchema>;
export type Caption = typeof captions.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertUsageMetrics = z.infer<typeof insertUsageMetricsSchema>;
export type UsageMetrics = typeof usageMetrics.$inferSelect;
