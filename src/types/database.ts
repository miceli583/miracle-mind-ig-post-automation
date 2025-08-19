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

export interface Quote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface QuotePostWithData extends QuotePost {
  coreValue: CoreValue;
  supportingValue: SupportingValue;
  quote: Quote;
}

export interface DatabaseSchema {
  coreValues: CoreValue[];
  supportingValues: SupportingValue[];
  quotes: Quote[];
  quotePosts: QuotePost[];
}

export type CreateCoreValueInput = Omit<CoreValue, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCoreValueInput = Partial<Omit<CoreValue, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateSupportingValueInput = Omit<SupportingValue, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSupportingValueInput = Partial<Omit<SupportingValue, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateQuoteInput = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuoteInput = Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateQuotePostInput = Omit<QuotePost, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuotePostInput = Partial<Omit<QuotePost, 'id' | 'createdAt' | 'updatedAt'>>;