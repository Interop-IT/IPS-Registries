import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// IPS Vendor Result Schema
export interface VendorResult {
  company: string;
  profile: string;
  actor: string;
  year: string;
  event: string;
}

export const vendorResultSchema = z.object({
  company: z.string(),
  profile: z.string(),
  actor: z.string(),
  year: z.string(),
  event: z.string(),
});

export type InsertVendorResult = z.infer<typeof vendorResultSchema>;
