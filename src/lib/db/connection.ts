import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is required. ' +
    'Please set up your Supabase database connection string.'
  );
}

// Create the connection
const client = postgres(connectionString, {
  prepare: false, // Required for Supabase
});

// Create and export the Drizzle database instance
export const db = drizzle(client, { schema });

// Export the client for direct queries if needed
export { client };

// Type exports
export type Database = typeof db;