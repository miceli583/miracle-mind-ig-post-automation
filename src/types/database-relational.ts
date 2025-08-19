export interface CoreValue {
  id: string;
  value: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportingValue {
  id: string;
  value: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  text: string;
  authorId?: string;
  source?: string;
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Relationship tables
export interface CoreValueSupportingValue {
  id: string;
  coreValueId: string;
  supportingValueId: string;
  createdAt: Date;
}

export interface CoreValueQuote {
  id: string;
  coreValueId: string;
  quoteId: string;
  createdAt: Date;
}

export interface QuotePost {
  id: string;
  coreValueId: string;
  supportingValueId: string;
  quoteId: string;
  isPublished: boolean;
  publishedAt?: Date;
  scheduledFor?: Date;
  metaPostId?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced views with relationships
export interface QuoteWithAuthor extends Quote {
  author?: Author;
}

export interface CoreValueWithRelations extends CoreValue {
  supportingValues: SupportingValue[];
  quotes: QuoteWithAuthor[];
}

export interface QuotePostWithData extends QuotePost {
  coreValue: CoreValue;
  supportingValue: SupportingValue;
  quote: QuoteWithAuthor;
}

export interface DatabaseSchema {
  coreValues: CoreValue[];
  supportingValues: SupportingValue[];
  authors: Author[];
  quotes: Quote[];
  coreValueSupportingValues: CoreValueSupportingValue[];
  coreValueQuotes: CoreValueQuote[];
  quotePosts: QuotePost[];
}

// Input types for creating records
export type CreateCoreValueInput = Omit<CoreValue, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCoreValueInput = Partial<Omit<CoreValue, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateSupportingValueInput = Omit<SupportingValue, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSupportingValueInput = Partial<Omit<SupportingValue, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAuthorInput = Omit<Author, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAuthorInput = Partial<Omit<Author, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateQuoteInput = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuoteInput = Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateQuotePostInput = Omit<QuotePost, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuotePostInput = Partial<Omit<QuotePost, 'id' | 'createdAt' | 'updatedAt'>>;