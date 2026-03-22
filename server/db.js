// import Database from 'better-sqlite3';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const db = new Database(join(__dirname, '..', 'data', 'airapropfirm.db'));

// // Enable WAL mode for better performance
// db.pragma('journal_mode = WAL');

// // Create tables
// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     email TEXT PRIMARY KEY,
//     name TEXT NOT NULL,
//     phone TEXT DEFAULT '',
//     password TEXT NOT NULL,
//     status TEXT NOT NULL DEFAULT 'pending',
//     created_at TEXT DEFAULT (datetime('now')),
//     approved_at TEXT
//   );
// `);

// export default db;


import pg from 'pg';
const { Pool } = pg;

// Parse the DATABASE_URL to extract the database name
function parseDbUrl(url) {
  const match = url.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : 'airapropfirm';
}

// Create the database if it doesn't exist
async function ensureDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  const dbName = parseDbUrl(dbUrl);
  
  // Connect to default 'postgres' database first
  const baseUrl = dbUrl.replace(/\/[^/?]+(\?|$)/, '/postgres$1');
  const tempPool = new Pool({
    connectionString: baseUrl,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    const result = await tempPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1", [dbName]
    );
    if (result.rows.length === 0) {
      await tempPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✓ Database "${dbName}" created`);
    }
  } catch (e) {
    if (e.code !== '42P04') console.warn('DB create warning:', e.message);
  } finally {
    await tempPool.end();
  }
}

// Main connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Initialize tables
export async function initDB() {
  await ensureDatabase();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      password TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW(),
      approved_at TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS challenges (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      experience TEXT NOT NULL,
      platform TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW(),
      reviewed_at TIMESTAMP
    );
  `);

  console.log('✓ Database tables ready');
}

// Helper: run a query and return rows
export async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}

// Helper: get one row
export async function getOne(text, params) {
  const res = await pool.query(text, params);
  return res.rows[0] || null;
}

// Helper: run a mutation (INSERT/UPDATE/DELETE)
export async function run(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export default pool;
