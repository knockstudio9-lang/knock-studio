// scripts/seed-about.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { aboutValues, teamMembers } from '../lib/db/schema';

// Load environment variables
config({ path: '.env.local' });

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Sample values data
 */
const sampleValues = [
  {
    icon: "Award",
    title: "Kualitas Terbaik",
    description: "Kami berkomitmen memberikan hasil kerja dengan standar tertinggi untuk setiap proyek.",
    order: 1,
    isActive: true,
  },
  {
    icon: "Users",
    title: "Tim Profesional",
    description: "Tim kami terdiri dari desainer dan arsitek berpengalaman dengan passion dalam bidangnya.",
    order: 2,
    isActive: true,
  },
  {
    icon: "Lightbulb",
    title: "Inovasi Berkelanjutan",
    description: "Kami selalu mencari solusi kreatif dan berkelanjutan untuk setiap tantangan desain.",
    order: 3,
    isActive: true,
  },
  {
    icon: "CheckCircle",
    title: "Kepuasan Klien",
    description: "Kepuasan klien adalah prioritas utama kami, kami berusaha melampaui ekspektasi.",
    order: 4,
    isActive: true,
  },
];

/**
 * Sample team members data
 */
const sampleTeamMembers = [
  // Founder
  {
    name: "Fachry Zella Devandra",
    position: "Founder",
    image: "/about/team/profile.jpeg",
    imagePublicId: "",
    bio: null,
    isFounder: true,
    order: 1,
    isActive: true,
  },
  // Team Members
  {
    name: "Ogy Surya Ari Utama",
    position: "Project Manager",
    image: "",
    imagePublicId: "",
    bio: null,
    isFounder: false,
    order: 2,
    isActive: true,
  },
  {
    name: "Suroto",
    position: "Pelaksana",
    image: "",
    imagePublicId: "",
    bio: null,
    isFounder: false,
    order: 3,
    isActive: true,
  },
  {
    name: "Martinus",
    position: "3D Visualizer",
    image: "",
    imagePublicId: "",
    bio: null,
    isFounder: false,
    order: 4,
    isActive: true,
  },
  {
    name: "Gabby",
    position: "Interior Designer",
    image: "",
    imagePublicId: "",
    bio: null,
    isFounder: false,
    order: 5,
    isActive: true,
  },
  {
    name: "Seandi P",
    position: "Head Finance / Estimator",
    image: "",
    imagePublicId: "",
    bio: null,
    isFounder: false,
    order: 6,
    isActive: true,
  },
];

async function seedAbout() {
  console.log('🌱 Starting about page seeding...\n');

  try {
    // Clear existing values
    console.log('Clearing existing values...');
    await db.delete(aboutValues);
    console.log('✓ Existing values cleared\n');

    // Clear existing team members
    console.log('Clearing existing team members...');
    await db.delete(teamMembers);
    console.log('✓ Existing team members cleared\n');

    // Seed values
    console.log('\n\n📦 Seeding values...\n');
    let successfulValues = 0;

    for (const [index, value] of sampleValues.entries()) {
      console.log(`\n💎 Processing value ${index + 1}/${sampleValues.length}: ${value.title}`);

      // Insert into database
      console.log('Saving to database...');
      await db.insert(aboutValues).values(value);

      console.log(`✓ Value "${value.title}" seeded successfully!`);
      successfulValues++;
    }

    console.log('\n\n📊 Values seeding completed!');
    console.log(`📊 Total values processed: ${sampleValues.length}`);
    console.log(`📊 Successfully seeded: ${successfulValues}`);

    // Seed team members
    console.log('\n\n📦 Seeding team members...\n');
    let successfulTeam = 0;

    for (const [index, member] of sampleTeamMembers.entries()) {
      console.log(`\n👤 Processing team member ${index + 1}/${sampleTeamMembers.length}: ${member.name} (${member.isFounder ? 'Founder' : 'Team Member'})`);

      // Insert into database
      console.log('Saving to database...');
      await db.insert(teamMembers).values(member);

      console.log(`✓ Team member "${member.name}" seeded successfully!`);
      successfulTeam++;
    }

    console.log('\n\n✅ All seeding completed!');
    console.log(`📊 Total team members processed: ${sampleTeamMembers.length}`);
    console.log(`📊 Successfully seeded: ${successfulTeam}`);
    console.log('\n📝 Summary:');
    console.log(`   - Founder: 1`);
    console.log(`   - Team Members: ${sampleTeamMembers.length - 1}`);

  } catch (error) {
    console.error('\n❌ Error seeding about page:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedAbout()
  .then(() => {
    console.log('\n👋 About page seeding process finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });