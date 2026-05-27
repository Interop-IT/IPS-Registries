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
  website?: string;
  product?: string;
  primaryContact?: string;
  contactInfo?: string;
}

export const vendorResultSchema = z.object({
  company: z.string(),
  profile: z.string(),
  actor: z.string(),
  year: z.string(),
  event: z.string(),
  website: z.string().optional(),
  product: z.string().optional(),
  primaryContact: z.string().optional(),
  contactInfo: z.string().optional(),
});

export type InsertVendorResult = z.infer<typeof vendorResultSchema>;

// IPS Implementation Registry (organized by jurisdiction)
export interface IpsImplementation {
  jurisdiction: string;
  projectName?: string;
  primaryContact?: string;
  contactEmail?: string;
  infoWebsite?: string;
  approach?: string;
  dataDomainsLink?: string;
}

export const ipsImplementationSchema = z.object({
  jurisdiction: z.string(),
  projectName: z.string().optional(),
  primaryContact: z.string().optional(),
  contactEmail: z.string().optional(),
  infoWebsite: z.string().optional(),
  approach: z.string().optional(),
  dataDomainsLink: z.string().optional(),
});

export type InsertIpsImplementation = z.infer<typeof ipsImplementationSchema>;

// Helper: split a contact / email field that may contain newlines, semicolons,
// commas, or bullet-dash prefixes ("- name"). Returns trimmed unique values.
export function splitContactList(raw?: string): string[] {
  if (!raw) return [];
  const parts = raw
    .split(/[\n;]+|,(?=\s*[A-Za-z0-9])/g)
    .map((p) => p.replace(/^\s*[-•*]\s*/, "").trim())
    .filter((p) => p.length > 0);
  return Array.from(new Set(parts));
}

// Distinct contact "people" count for an implementation. We treat a
// paired primary-contact name + email as a single person, so the count
// is the larger of the two split lists (handles 0/1/many on either side).
export function distinctContactCount(
  primaryContact?: string,
  contactEmail?: string,
): number {
  return Math.max(
    splitContactList(primaryContact).length,
    splitContactList(contactEmail).length,
  );
}
