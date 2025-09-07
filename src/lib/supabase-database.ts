/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import type {
  CoreValue,
  SupportingValue,
  Author,
  Quote,
  QuotePost,
  QuotePostWithData,
  CoreValueWithRelations,
  QuoteWithAuthor,
  CreateCoreValueInput,
  CreateSupportingValueInput,
  CreateAuthorInput,
  CreateQuoteInput,
  CreateQuotePostInput,
  CoreValueSupportingValue,
  CoreValueQuote,
} from '@/types/database-relational';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false }
  }
);

// Core Values
export async function getCoreValues(): Promise<CoreValue[]> {
  const { data, error } = await supabase
    .from('core_values')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch core values: ${error.message}`);
  
  return data.map(cv => ({
    ...cv,
    isActive: cv.is_active,
    createdAt: new Date(cv.created_at),
    updatedAt: new Date(cv.updated_at)
  }));
}

export async function getCoreValueWithRelations(id: string): Promise<CoreValueWithRelations | null> {
  // Get core value
  const { data: coreValue, error: cvError } = await supabase
    .from('core_values')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (cvError || !coreValue) return null;

  // Get related supporting values
  const { data: supportingValues, error: svError } = await supabase
    .from('core_value_supporting_values')
    .select(`
      supporting_values (
        id,
        value,
        description,
        is_active,
        created_at,
        updated_at
      )
    `)
    .eq('core_value_id', id);

  if (svError) throw new Error(`Failed to fetch supporting values: ${svError.message}`);

  // Get related quotes with authors
  const { data: quotes, error: quotesError } = await supabase
    .from('core_value_quotes')
    .select(`
      quotes (
        id,
        text,
        author_id,
        source,
        category,
        tags,
        is_active,
        created_at,
        updated_at,
        authors (
          id,
          name,
          is_active,
          created_at,
          updated_at
        )
      )
    `)
    .eq('core_value_id', id);

  if (quotesError) throw new Error(`Failed to fetch quotes: ${quotesError.message}`);

  return {
    ...coreValue,
    isActive: coreValue.is_active,
    createdAt: new Date(coreValue.created_at),
    updatedAt: new Date(coreValue.updated_at),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    supportingValues: supportingValues?.map(sv => ({
      ...sv.supporting_values,
      isActive: (sv.supporting_values as any).is_active,
      createdAt: new Date((sv.supporting_values as any).created_at),
      updatedAt: new Date((sv.supporting_values as any).updated_at)
    })) || [],
    quotes: quotes?.map(q => ({
      ...q.quotes,
      authorId: (q.quotes as any).author_id,
      isActive: (q.quotes as any).is_active,
      createdAt: new Date((q.quotes as any).created_at),
      updatedAt: new Date((q.quotes as any).updated_at),
      author: (q.quotes as any).authors ? {
        ...(q.quotes as any).authors,
        isActive: (q.quotes as any).authors.is_active,
        createdAt: new Date((q.quotes as any).authors.created_at),
        updatedAt: new Date((q.quotes as any).authors.updated_at)
      } : undefined
    })) || []
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}

export async function createCoreValue(input: CreateCoreValueInput): Promise<CoreValue> {
  const { data, error } = await supabase
    .from('core_values')
    .insert({
      id: crypto.randomUUID(),
      value: input.value,
      description: input.description,
      is_active: input.isActive
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create core value: ${error.message}`);

  return {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

// Supporting Values
export async function getSupportingValues(): Promise<SupportingValue[]> {
  const { data, error } = await supabase
    .from('supporting_values')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch supporting values: ${error.message}`);

  return data.map(sv => ({
    ...sv,
    isActive: sv.is_active,
    createdAt: new Date(sv.created_at),
    updatedAt: new Date(sv.updated_at)
  }));
}

// Authors
export async function getAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch authors: ${error.message}`);

  return data.map(author => ({
    ...author,
    isActive: author.is_active,
    createdAt: new Date(author.created_at),
    updatedAt: new Date(author.updated_at)
  }));
}

// Quotes
export async function getQuotes(): Promise<QuoteWithAuthor[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      authors (
        id,
        name,
        is_active,
        created_at,
        updated_at
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch quotes: ${error.message}`);

  return data.map(quote => ({
    ...quote,
    authorId: quote.author_id,
    isActive: quote.is_active,
    createdAt: new Date(quote.created_at),
    updatedAt: new Date(quote.updated_at),
    author: quote.authors ? {
      ...quote.authors,
      isActive: quote.authors.is_active,
      createdAt: new Date(quote.authors.created_at),
      updatedAt: new Date(quote.authors.updated_at)
    } : undefined
  }));
}

// Quote Posts
export async function getQuotePosts(): Promise<QuotePostWithData[]> {
  const { data, error } = await supabase
    .from('quote_posts')
    .select(`
      *,
      core_values (
        id,
        value,
        description,
        is_active,
        created_at,
        updated_at
      ),
      supporting_values (
        id,
        value,
        description,
        is_active,
        created_at,
        updated_at
      ),
      quotes (
        id,
        text,
        author_id,
        source,
        category,
        tags,
        is_active,
        created_at,
        updated_at,
        authors (
          id,
          name,
          is_active,
          created_at,
          updated_at
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch quote posts: ${error.message}`);

  return data.map(post => ({
    ...post,
    coreValueId: post.core_value_id,
    supportingValueId: post.supporting_value_id,
    quoteId: post.quote_id,
    isPublished: post.is_published,
    publishedAt: post.published_at ? new Date(post.published_at) : undefined,
    scheduledFor: post.scheduled_for ? new Date(post.scheduled_for) : undefined,
    metaPostId: post.meta_post_id,
    imageUrl: post.image_url,
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
    coreValue: {
      ...post.core_values,
      isActive: post.core_values.is_active,
      createdAt: new Date(post.core_values.created_at),
      updatedAt: new Date(post.core_values.updated_at)
    },
    supportingValue: {
      ...post.supporting_values,
      isActive: post.supporting_values.is_active,
      createdAt: new Date(post.supporting_values.created_at),
      updatedAt: new Date(post.supporting_values.updated_at)
    },
    quote: {
      ...post.quotes,
      authorId: post.quotes.author_id,
      isActive: post.quotes.is_active,
      createdAt: new Date(post.quotes.created_at),
      updatedAt: new Date(post.quotes.updated_at),
      author: post.quotes.authors ? {
        ...post.quotes.authors,
        isActive: post.quotes.authors.is_active,
        createdAt: new Date(post.quotes.authors.created_at),
        updatedAt: new Date(post.quotes.authors.updated_at)
      } : undefined
    }
  }));
}

export async function createQuotePost(input: CreateQuotePostInput): Promise<QuotePost> {
  const { data, error } = await supabase
    .from('quote_posts')
    .insert({
      id: crypto.randomUUID(),
      core_value_id: input.coreValueId,
      supporting_value_id: input.supportingValueId,
      quote_id: input.quoteId,
      is_published: input.isPublished || false,
      published_at: input.publishedAt,
      scheduled_for: input.scheduledFor,
      meta_post_id: input.metaPostId,
      image_url: input.imageUrl
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create quote post: ${error.message}`);

  return {
    ...data,
    coreValueId: data.core_value_id,
    supportingValueId: data.supporting_value_id,
    quoteId: data.quote_id,
    isPublished: data.is_published,
    publishedAt: data.published_at ? new Date(data.published_at) : undefined,
    scheduledFor: data.scheduled_for ? new Date(data.scheduled_for) : undefined,
    metaPostId: data.meta_post_id,
    imageUrl: data.image_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function getRandomQuotePostData(): Promise<{
  coreValue: CoreValue;
  supportingValue: SupportingValue;
  quote: QuoteWithAuthor;
} | null> {
  try {
    // Get all active core values
    const coreValues = await getCoreValues();
    if (coreValues.length === 0) return null;

    // Pick a random core value
    const randomCoreValue = coreValues[Math.floor(Math.random() * coreValues.length)];

    // Get supporting values for this core value
    const { data: svData, error: svError } = await supabase
      .from('core_value_supporting_values')
      .select(`
        supporting_values (
          id,
          value,
          description,
          is_active,
          created_at,
          updated_at
        )
      `)
      .eq('core_value_id', randomCoreValue.id);

    if (svError) throw svError;

    const availableSupportingValues = svData
      ?.filter(sv => (sv.supporting_values as any)?.is_active)
      .map(sv => ({
        ...(sv.supporting_values as any),
        isActive: (sv.supporting_values as any).is_active,
        createdAt: new Date((sv.supporting_values as any).created_at),
        updatedAt: new Date((sv.supporting_values as any).updated_at)
      })) || [];

    if (availableSupportingValues.length === 0) return null;

    // Pick a random supporting value
    const randomSupportingValue = availableSupportingValues[Math.floor(Math.random() * availableSupportingValues.length)];

    // Get quotes for this core value
    const { data: quotesData, error: quotesError } = await supabase
      .from('core_value_quotes')
      .select(`
        quotes (
          id,
          text,
          author_id,
          source,
          category,
          tags,
          is_active,
          created_at,
          updated_at,
          authors (
            id,
            name,
            is_active,
            created_at,
            updated_at
          )
        )
      `)
      .eq('core_value_id', randomCoreValue.id);

    if (quotesError) throw quotesError;

    const availableQuotes = quotesData
      ?.filter(q => (q.quotes as any)?.is_active)
      .map(q => ({
        ...(q.quotes as any),
        authorId: (q.quotes as any).author_id,
        isActive: (q.quotes as any).is_active,
        createdAt: new Date((q.quotes as any).created_at),
        updatedAt: new Date((q.quotes as any).updated_at),
        author: (q.quotes as any).authors ? {
          ...((q.quotes as any).authors),
          isActive: ((q.quotes as any).authors as any).is_active,
          createdAt: new Date(((q.quotes as any).authors as any).created_at),
          updatedAt: new Date(((q.quotes as any).authors as any).updated_at)
        } : undefined
      })) || [];

    if (availableQuotes.length === 0) return null;

    // Pick a random quote
    const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

    return {
      coreValue: randomCoreValue,
      supportingValue: randomSupportingValue,
      quote: randomQuote
    };

  } catch (error) {
    console.error('Error in getRandomQuotePostData:', error);
    return null;
  }
}

// ==============================================================================
// COMPLETE CRUD OPERATIONS - Missing functions from database-relational.ts
// ==============================================================================

// Core Values - Additional CRUD operations
export async function updateCoreValue(id: string, input: Partial<CreateCoreValueInput>): Promise<CoreValue | null> {
  const { data, error } = await supabase
    .from('core_values')
    .update({
      value: input.value,
      description: input.description,
      is_active: input.isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw new Error(`Failed to update core value: ${error.message}`);
  }

  return {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function archiveCoreValue(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('core_values')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to archive core value:', error.message);
    return false;
  }
  return true;
}

export async function deleteCoreValue(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('core_values')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete core value:', error.message);
    return false;
  }
  return true;
}

// Supporting Values - Additional CRUD operations
export async function getSupportingValuesForCore(coreValueId: string): Promise<SupportingValue[]> {
  const { data, error } = await supabase
    .from('core_value_supporting_values')
    .select(`
      supporting_values (
        id,
        value,
        description,
        is_active,
        created_at,
        updated_at
      )
    `)
    .eq('core_value_id', coreValueId);

  if (error) throw new Error(`Failed to fetch supporting values: ${error.message}`);

  return (data?.filter((sv: any) => sv.supporting_values?.is_active).map((sv: any) => ({
    ...sv.supporting_values,
    isActive: sv.supporting_values.is_active,
    createdAt: new Date(sv.supporting_values.created_at),
    updatedAt: new Date(sv.supporting_values.updated_at)
  })) as SupportingValue[]) || [];
}

export async function createSupportingValue(input: CreateSupportingValueInput & { coreValueId?: string; coreValueIds?: string[] }): Promise<SupportingValue> {
  const { coreValueId, coreValueIds, ...supportingValueData } = input;
  
  const { data, error } = await supabase
    .from('supporting_values')
    .insert({
      id: crypto.randomUUID(),
      value: supportingValueData.value,
      description: supportingValueData.description,
      is_active: supportingValueData.isActive || true
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create supporting value: ${error.message}`);

  const supportingValue = {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };

  // Create relationships
  const coreValueIdsToLink = coreValueIds || (coreValueId ? [coreValueId] : []);
  for (const cvId of coreValueIdsToLink) {
    await createCoreValueSupportingValueRelation(cvId, supportingValue.id);
  }

  return supportingValue;
}

export async function updateSupportingValue(id: string, input: Partial<CreateSupportingValueInput> & { coreValueIds?: string[] }): Promise<SupportingValue | null> {
  const { coreValueIds, ...supportingValueData } = input;
  
  const { data, error } = await supabase
    .from('supporting_values')
    .update({
      value: supportingValueData.value,
      description: supportingValueData.description,
      is_active: supportingValueData.isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to update supporting value: ${error.message}`);
  }

  // Update relationships if provided
  if (coreValueIds !== undefined) {
    // Remove existing relationships
    await supabase
      .from('core_value_supporting_values')
      .delete()
      .eq('supporting_value_id', id);
    
    // Add new relationships
    for (const coreValueId of coreValueIds) {
      await createCoreValueSupportingValueRelation(coreValueId, id);
    }
  }

  return {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function archiveSupportingValue(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('supporting_values')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to archive supporting value:', error.message);
    return false;
  }
  return true;
}

export async function deleteSupportingValue(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('supporting_values')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete supporting value:', error.message);
    return false;
  }
  return true;
}

// Authors - Additional CRUD operations
export async function createAuthor(input: CreateAuthorInput): Promise<Author> {
  const { data, error } = await supabase
    .from('authors')
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      is_active: input.isActive || true
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create author: ${error.message}`);

  return {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function updateAuthor(id: string, input: Partial<CreateAuthorInput>): Promise<Author | null> {
  const { data, error } = await supabase
    .from('authors')
    .update({
      name: input.name,
      is_active: input.isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to update author: ${error.message}`);
  }

  return {
    ...data,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function archiveAuthor(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('authors')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to archive author:', error.message);
    return false;
  }
  return true;
}

export async function deleteAuthor(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('authors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete author:', error.message);
    return false;
  }
  return true;
}

// Quotes - Additional CRUD operations
export async function getQuotesForCore(coreValueId: string): Promise<QuoteWithAuthor[]> {
  const { data, error } = await supabase
    .from('core_value_quotes')
    .select(`
      quotes (
        id,
        text,
        author_id,
        source,
        category,
        tags,
        is_active,
        created_at,
        updated_at,
        authors (
          id,
          name,
          is_active,
          created_at,
          updated_at
        )
      )
    `)
    .eq('core_value_id', coreValueId);

  if (error) throw new Error(`Failed to fetch quotes: ${error.message}`);

  return (data?.filter((q: any) => q.quotes?.is_active).map((q: any) => ({
    ...q.quotes,
    authorId: q.quotes.author_id,
    isActive: q.quotes.is_active,
    createdAt: new Date(q.quotes.created_at),
    updatedAt: new Date(q.quotes.updated_at),
    author: q.quotes.authors ? {
      ...q.quotes.authors,
      isActive: q.quotes.authors.is_active,
      createdAt: new Date(q.quotes.authors.created_at),
      updatedAt: new Date(q.quotes.authors.updated_at)
    } : undefined
  })) as QuoteWithAuthor[]) || [];
}

export async function createQuote(input: CreateQuoteInput & { coreValueId?: string; coreValueIds?: string[] }): Promise<Quote> {
  const { coreValueId, coreValueIds, ...quoteData } = input;
  
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      id: crypto.randomUUID(),
      text: quoteData.text,
      author_id: quoteData.authorId,
      source: quoteData.source,
      category: quoteData.category,
      tags: quoteData.tags,
      is_active: quoteData.isActive || true
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create quote: ${error.message}`);

  const quote = {
    ...data,
    authorId: data.author_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };

  // Create relationships
  const coreValueIdsToLink = coreValueIds || (coreValueId ? [coreValueId] : []);
  for (const cvId of coreValueIdsToLink) {
    await createCoreValueQuoteRelation(cvId, quote.id);
  }

  return quote;
}

export async function updateQuote(id: string, input: Partial<CreateQuoteInput> & { coreValueIds?: string[] }): Promise<Quote | null> {
  const { coreValueIds, ...updateData } = input;
  
  const { data, error } = await supabase
    .from('quotes')
    .update({
      text: updateData.text,
      author_id: updateData.authorId,
      source: updateData.source,
      category: updateData.category,
      tags: updateData.tags,
      is_active: updateData.isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to update quote: ${error.message}`);
  }

  // Update relationships if provided
  if (coreValueIds !== undefined) {
    // Remove existing relationships
    await supabase
      .from('core_value_quotes')
      .delete()
      .eq('quote_id', id);
    
    // Add new relationships
    for (const coreValueId of coreValueIds) {
      await createCoreValueQuoteRelation(coreValueId, id);
    }
  }

  return {
    ...data,
    authorId: data.author_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function archiveQuote(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('quotes')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to archive quote:', error.message);
    return false;
  }
  return true;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete quote:', error.message);
    return false;
  }
  return true;
}

// Relationship Management
export async function createCoreValueSupportingValueRelation(coreValueId: string, supportingValueId: string): Promise<CoreValueSupportingValue> {
  // Check if relationship already exists
  const { data: existing } = await supabase
    .from('core_value_supporting_values')
    .select('*')
    .eq('core_value_id', coreValueId)
    .eq('supporting_value_id', supportingValueId)
    .single();

  if (existing) {
    return {
      ...existing,
      coreValueId: existing.core_value_id,
      supportingValueId: existing.supporting_value_id,
      createdAt: new Date(existing.created_at)
    };
  }

  const { data, error } = await supabase
    .from('core_value_supporting_values')
    .insert({
      id: crypto.randomUUID(),
      core_value_id: coreValueId,
      supporting_value_id: supportingValueId
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create core-supporting value relationship: ${error.message}`);

  return {
    ...data,
    coreValueId: data.core_value_id,
    supportingValueId: data.supporting_value_id,
    createdAt: new Date(data.created_at)
  };
}

export async function createCoreValueQuoteRelation(coreValueId: string, quoteId: string): Promise<CoreValueQuote> {
  // Check if relationship already exists
  const { data: existing } = await supabase
    .from('core_value_quotes')
    .select('*')
    .eq('core_value_id', coreValueId)
    .eq('quote_id', quoteId)
    .single();

  if (existing) {
    return {
      ...existing,
      coreValueId: existing.core_value_id,
      quoteId: existing.quote_id,
      createdAt: new Date(existing.created_at)
    };
  }

  const { data, error } = await supabase
    .from('core_value_quotes')
    .insert({
      id: crypto.randomUUID(),
      core_value_id: coreValueId,
      quote_id: quoteId
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create core-quote relationship: ${error.message}`);

  return {
    ...data,
    coreValueId: data.core_value_id,
    quoteId: data.quote_id,
    createdAt: new Date(data.created_at)
  };
}

// Data Analysis and Seeding
export async function seedDatabase(): Promise<void> {
  // Check if database already has data
  const { count } = await supabase
    .from('core_values')
    .select('id', { count: 'exact', head: true });
  
  if (count && count > 0) {
    console.log('Database already contains data, skipping seed');
    return;
  }

  console.log('Database is empty, but seeding should be done via migration scripts');
  // Note: Actual seeding should use the migration scripts we created
}

// CSV Import and Data Migration
export async function seedFromNotionCSV(): Promise<void> {
  console.log('CSV seeding should be handled by migration scripts that read from JSON and populate Supabase');
  // This would require implementing CSV parsing and bulk insert logic
  throw new Error('CSV seeding not implemented for Supabase - use migration scripts instead');
}

// Utility functions for data analysis
export async function analyzeDatabase(): Promise<{
  coreValues: number;
  supportingValues: number;
  authors: number;
  quotes: number;
  relationships: number;
  posts: number;
}> {
  const [coreValues, supportingValues, authors, quotes, relationships, posts] = await Promise.all([
    supabase.from('core_values').select('id', { count: 'exact', head: true }),
    supabase.from('supporting_values').select('id', { count: 'exact', head: true }),
    supabase.from('authors').select('id', { count: 'exact', head: true }),
    supabase.from('quotes').select('id', { count: 'exact', head: true }),
    supabase.from('core_value_supporting_values').select('id', { count: 'exact', head: true }),
    supabase.from('quote_posts').select('id', { count: 'exact', head: true })
  ]);

  return {
    coreValues: coreValues.count || 0,
    supportingValues: supportingValues.count || 0,
    authors: authors.count || 0,
    quotes: quotes.count || 0,
    relationships: relationships.count || 0,
    posts: posts.count || 0
  };
}