import { pgTable, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Core tables
export const coreValues = pgTable('core_values', {
  id: text('id').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  activeIdx: uniqueIndex('idx_core_values_active').on(table.isActive),
}));

export const supportingValues = pgTable('supporting_values', {
  id: text('id').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  activeIdx: uniqueIndex('idx_supporting_values_active').on(table.isActive),
}));

export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  activeIdx: uniqueIndex('idx_authors_active').on(table.isActive),
}));

export const quotes = pgTable('quotes', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  authorId: text('author_id').references(() => authors.id),
  source: text('source'),
  category: text('category'),
  tags: text('tags').array(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  activeIdx: uniqueIndex('idx_quotes_active').on(table.isActive),
  authorIdx: uniqueIndex('idx_quotes_author').on(table.authorId),
}));

// Relationship tables
export const coreValueSupportingValues = pgTable('core_value_supporting_values', {
  id: text('id').primaryKey(),
  coreValueId: text('core_value_id').notNull().references(() => coreValues.id, { onDelete: 'cascade' }),
  supportingValueId: text('supporting_value_id').notNull().references(() => supportingValues.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueRelation: uniqueIndex('unique_core_supporting').on(table.coreValueId, table.supportingValueId),
  coreIdx: uniqueIndex('idx_cv_sv_core').on(table.coreValueId),
  supportingIdx: uniqueIndex('idx_cv_sv_supporting').on(table.supportingValueId),
}));

export const coreValueQuotes = pgTable('core_value_quotes', {
  id: text('id').primaryKey(),
  coreValueId: text('core_value_id').notNull().references(() => coreValues.id, { onDelete: 'cascade' }),
  quoteId: text('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueRelation: uniqueIndex('unique_core_quote').on(table.coreValueId, table.quoteId),
  coreIdx: uniqueIndex('idx_cv_quotes_core').on(table.coreValueId),
  quoteIdx: uniqueIndex('idx_cv_quotes_quote').on(table.quoteId),
}));

export const quotePosts = pgTable('quote_posts', {
  id: text('id').primaryKey(),
  coreValueId: text('core_value_id').notNull().references(() => coreValues.id),
  supportingValueId: text('supporting_value_id').notNull().references(() => supportingValues.id),
  quoteId: text('quote_id').notNull().references(() => quotes.id),
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  metaPostId: text('meta_post_id'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  publishedIdx: uniqueIndex('idx_quote_posts_published').on(table.isPublished),
  scheduledIdx: uniqueIndex('idx_quote_posts_scheduled').on(table.scheduledFor),
}));

// Relations
export const coreValuesRelations = relations(coreValues, ({ many }) => ({
  supportingValueRelations: many(coreValueSupportingValues),
  quoteRelations: many(coreValueQuotes),
  quotePosts: many(quotePosts),
}));

export const supportingValuesRelations = relations(supportingValues, ({ many }) => ({
  coreValueRelations: many(coreValueSupportingValues),
  quotePosts: many(quotePosts),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  author: one(authors, {
    fields: [quotes.authorId],
    references: [authors.id],
  }),
  coreValueRelations: many(coreValueQuotes),
  quotePosts: many(quotePosts),
}));

export const coreValueSupportingValuesRelations = relations(coreValueSupportingValues, ({ one }) => ({
  coreValue: one(coreValues, {
    fields: [coreValueSupportingValues.coreValueId],
    references: [coreValues.id],
  }),
  supportingValue: one(supportingValues, {
    fields: [coreValueSupportingValues.supportingValueId],
    references: [supportingValues.id],
  }),
}));

export const coreValueQuotesRelations = relations(coreValueQuotes, ({ one }) => ({
  coreValue: one(coreValues, {
    fields: [coreValueQuotes.coreValueId],
    references: [coreValues.id],
  }),
  quote: one(quotes, {
    fields: [coreValueQuotes.quoteId],
    references: [quotes.id],
  }),
}));

export const quotePostsRelations = relations(quotePosts, ({ one }) => ({
  coreValue: one(coreValues, {
    fields: [quotePosts.coreValueId],
    references: [coreValues.id],
  }),
  supportingValue: one(supportingValues, {
    fields: [quotePosts.supportingValueId],
    references: [supportingValues.id],
  }),
  quote: one(quotes, {
    fields: [quotePosts.quoteId],
    references: [quotes.id],
  }),
}));

// Type exports for use in application
export type CoreValue = typeof coreValues.$inferSelect;
export type NewCoreValue = typeof coreValues.$inferInsert;

export type SupportingValue = typeof supportingValues.$inferSelect;
export type NewSupportingValue = typeof supportingValues.$inferInsert;

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export type CoreValueSupportingValue = typeof coreValueSupportingValues.$inferSelect;
export type NewCoreValueSupportingValue = typeof coreValueSupportingValues.$inferInsert;

export type CoreValueQuote = typeof coreValueQuotes.$inferSelect;
export type NewCoreValueQuote = typeof coreValueQuotes.$inferInsert;

export type QuotePost = typeof quotePosts.$inferSelect;
export type NewQuotePost = typeof quotePosts.$inferInsert;