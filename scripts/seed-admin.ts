import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  const email = 'admin@biotiful.erp';
  const password = 'admin-password-123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Seeding admin user...');

  try {
    await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
    });
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

main();
