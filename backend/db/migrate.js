#!/usr/bin/env node
/**
 * Database migration script for amrloksha151.me
 * 
 * Reads DATABASE_URL from backend/db/.env - NEVER hardcoded.
 * Usage: node backend/db/migrate.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Parse a .env file into an object
 */
function loadEnv(envPath) {
  let content;
  try {
    content = readFileSync(envPath, 'utf8');
  } catch (e) {
    console.error(`ERROR: Could not read .env file at ${envPath}`);
    console.error('Please ensure the .env file exists with DATABASE_URL set.');
    process.exit(1);
  }
  
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

// Load environment variables
const envPath = join(__dirname, '.env');
const env = loadEnv(envPath);

if (!env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in .env file');
  process.exit(1);
}

// Load the schema SQL file
const schemaPath = join(__dirname, 'schema.sql');
let schemaSql;
try {
  schemaSql = readFileSync(schemaPath, 'utf8');
} catch (e) {
  console.error(`ERROR: Could not read schema.sql at ${schemaPath}`);
  process.exit(1);
}

// Import the Neon client
const { neon } = await import('@neondatabase/serverless');
const sql = neon(env.DATABASE_URL);

console.log('Starting database migration...');
console.log(`Using database from: ${envPath}`);
console.log();

try {
  // Split schema into individual statements
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    // Use raw query execution
    await sql(statement);
    const firstLine = statement.split('\n')[0].slice(0, 70);
    console.log(`  OK: ${firstLine}...`);
  }
  
  console.log();
  console.log('Migration completed successfully!');
} catch (err) {
  console.error();
  console.error('Migration FAILED:', err.message);
  console.error(err);
  process.exit(1);
}
