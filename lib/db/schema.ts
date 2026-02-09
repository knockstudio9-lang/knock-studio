// lib/db/schema.ts
import { pgTable, text, integer, timestamp, varchar, jsonb, serial, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: varchar('image', { length: 500 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // 'user' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations (if needed in the future)
export const usersRelations = relations(users, ({ many }) => ({
  // Add relations to other tables if needed
}));

// Your existing projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  year: varchar('year', { length: 10 }).notNull(),
  area: varchar('area', { length: 50 }).notNull(),
  completion: varchar('completion', { length: 10 }).notNull(),
  description: text('description').notNull(),
  beforeImage: varchar('before_image', { length: 500 }),
  beforeImagePublicId: varchar('before_image_public_id', { length: 500 }),
  afterImage: varchar('after_image', { length: 500 }).notNull(),
  afterImagePublicId: varchar('after_image_public_id', { length: 500 }),
  galleryImages: jsonb('gallery_images').$type<string[]>().default([]),
  galleryImagePublicIds: jsonb('gallery_image_public_ids').$type<string[]>().default([]),
  tags: jsonb('tags').$type<string[]>().notNull(),
  client: varchar('client', { length: 255 }),
  scope: text('scope'),
  budget: varchar('budget', { length: 100 }),
  team: text('team'),
  status: varchar('status', { length: 20 }).default('published'),
  featured: boolean('featured').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;