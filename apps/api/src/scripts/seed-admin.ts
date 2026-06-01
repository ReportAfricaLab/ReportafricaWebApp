/**
 * Seed script: Create initial admin user for production
 *
 * Usage:
 *   npx ts-node src/scripts/seed-admin.ts
 *
 * Environment variables required:
 *   DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@reportafrica.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
const ADMIN_USERNAME = 'admin';
const ADMIN_COUNTRY = 'NG';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'reportafrica',
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Connected to database');

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  // Check if admin already exists
  const existing = await dataSource.query(
    `SELECT id FROM users WHERE email = $1`,
    [ADMIN_EMAIL],
  );

  if (existing.length > 0) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    // Update role to admin
    await dataSource.query(
      `UPDATE users SET role = 'admin', trust_level = 'investigative_reporter', trust_score = 1000 WHERE email = $1`,
      [ADMIN_EMAIL],
    );
    console.log('Updated existing user to admin role');
  } else {
    await dataSource.query(
      `INSERT INTO users (id, email, username, display_name, password, country, role, trust_level, trust_score, is_verified, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 'Admin', $3, $4, 'admin', 'investigative_reporter', 1000, true, NOW(), NOW())`,
      [ADMIN_EMAIL, ADMIN_USERNAME, hashedPassword, ADMIN_COUNTRY],
    );
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  console.log('\n=== Admin Credentials ===');
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('========================');
  console.log('\n⚠️  CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
