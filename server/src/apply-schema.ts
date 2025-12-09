import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Fix: Prioritize DATABASE_PUBLIC_URL if available, or try to construct it manually if needed.
// However, 'railway run' might inject the private one.
// Let's print what we have.

console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
// Don't log full credentials for security, just the host
const dbUrl = process.env.DATABASE_URL || '';
const isInternal = dbUrl.includes('.railway.internal');
console.log('Database Host Type:', isInternal ? 'Internal (Private)' : 'External (Public)');

if (isInternal) {
    console.warn('⚠️ WARNING: using internal Railway URL locally. This will likely fail.');
    console.warn('👉 Use `railway run --service IPL-AUCTION ...` to run it in the cloud context, OR use the public TCP proxy URL locally.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applySchema() {
    try {
        console.log('🔄 Applying database schema...');

        // Fix: schema.sql is in the SAME directory as this script (src/)
        const schemaPath = path.join(__dirname, 'schema.sql');
        console.log('Reading schema from:', schemaPath);

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the SQL
        await pool.query(schemaSql);

        console.log('✅ Database schema applied successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error applying schema:', error);
        process.exit(1);
    }
}

applySchema();
