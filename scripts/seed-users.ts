// scripts/seed-users.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Sample user data
 */
const sampleUsers = [
  {
    name: "Admin User",
    email: "knockpresents@gmail.com",
    password: "knock12062026", // This will be hashed
    role: "admin",
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123", // This will be hashed
    role: "user",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "john123", // This will be hashed
    role: "user",
  },
];

async function seedUsers() {
  console.log('🌱 Starting user seeding...\n');

  try {
    // Clear existing users (optional - comment out if you want to keep existing data)
    console.log('Clearing existing users...');
    await db.delete(users);
    console.log('✓ Existing users cleared\n');

    let successfulSeeds = 0;

    for (const [index, user] of sampleUsers.entries()) {
      console.log(`\n👤 Processing user ${index + 1}/${sampleUsers.length}: ${user.name}`);

      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert into database
      console.log('Saving to database...');
      await db.insert(users).values({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });

      console.log(`✓ User "${user.name}" seeded successfully!`);
      successfulSeeds++;
    }

    console.log('\n\n✅ User seeding completed!');
    console.log(`📊 Total users processed: ${sampleUsers.length}`);
    console.log(`📊 Successfully seeded: ${successfulSeeds}`);
    console.log(`📊 Skipped: ${sampleUsers.length - successfulSeeds}`);
    
    console.log('\n🔑 Login credentials:');
    sampleUsers.forEach(user => {
      console.log(`  ${user.role === 'admin' ? '👑' : '👤'} ${user.name} (${user.role}):`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Password: ${user.password}`);
    });
  } catch (error) {
    console.error('\n❌ Error seeding users:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedUsers()
  .then(() => {
    console.log('\n👋 User seeding process finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });