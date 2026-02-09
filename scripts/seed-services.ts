// scripts/seed-services.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { services, serviceComparisonFeatures } from '../lib/db/schema';

// Load environment variables
config({ path: '.env.local' });

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Sample services data
 */
const sampleServices = [
  {
    serviceId: "home-renovation",
    icon: "Home",
    title: "Home Renovation",
    description: "Renovasi rumah skala kecil hingga menengah dengan pengerjaan rapih dan terukur.",
    duration: "1-4 bulan",
    features: [
      "Renovasi ruang tamu dan keluarga",
      "Perbaikan struktur dan finishing",
      "Upgrade material berkualitas",
      "Pengawasan langsung tim ahli",
    ],
    bestFor: "Pemilik rumah yang ingin memperbarui tampilan dan fungsi ruangan tanpa perubahan struktur besar",
    image: "/services/Service1.jpg.jpeg",
    imagePublicId: "",
    order: 1,
    isActive: true,
  },
  {
    serviceId: "design-visualization",
    icon: "Eye",
    title: "Design Visualization",
    description: "Desain denah gambar kerja dan visual 3D untuk membantu melihat dan menyesuaikan kebutuhan sebelum renovasi atau pembangunan dimulai",
    duration: "1-2 minggu",
    features: [
      "Pembuatan denah layout ruangan",
      "Visualisasi 3D rendering",
      "Multiple design options",
      "Revisi desain unlimited",
    ],
    bestFor: "Klien yang ingin melihat hasil akhir renovasi secara visual sebelum memulai pekerjaan",
    image: "/services/Service2.jpg.jpeg",
    imagePublicId: "",
    order: 2,
    isActive: true,
  },
  {
    serviceId: "consultation-survey",
    icon: "MessageSquare",
    title: "Consultation & Survey",
    description: "Konsultasi kebutuhan pembangunan atau renovasi dan survey lokasi untuk menentukan solusi terbaik.",
    duration: "1-3 hari",
    features: [
      "Konsultasi kebutuhan detail",
      "Survey dan pengukuran lokasi",
      "Analisis kondisi eksisting",
      "Rekomendasi solusi terbaik",
    ],
    bestFor: "Siapa saja yang ingin memulai proyek renovasi dengan perencanaan yang matang",
    image: "/services/Service3.jpg.jpeg",
    imagePublicId: "",
    order: 3,
    isActive: true,
  },
  {
    serviceId: "cost-estimation",
    icon: "Calculator",
    title: "Cost Estimation (RAB)",
    description: "Estimasi biaya yang jelas dan transparan agar bisa menyesuaikan budget sejak awal.",
    duration: "3-5 hari",
    features: [
      "Rincian biaya material detail",
      "Estimasi biaya tenaga kerja",
      "Breakdown per item pekerjaan",
      "Transparansi harga penuh",
    ],
    bestFor: "Pemilik rumah yang ingin mengetahui estimasi biaya renovasi secara detail dan akurat",
    image: "/services/Service4.jpg.jpeg",
    imagePublicId: "",
    order: 4,
    isActive: true,
  },
  {
    serviceId: "project-execution",
    icon: "Wrench",
    title: "Project Execution",
    description: "Pengerjaan renovasi oleh tim tukang berpengalaman dengan pengawasan langsung agar hasil sesuai rencana.",
    duration: "Sesuai skala proyek",
    features: [
      "Tim tukang berpengalaman",
      "Pengawasan langsung harian",
      "Update progress berkala",
      "Quality control ketat",
    ],
    bestFor: "Klien yang mengutamakan kualitas pengerjaan dan hasil sesuai rencana",
    image: "/services/Service5.jpg.jpeg",
    imagePublicId: "",
    order: 5,
    isActive: true,
  },
];

/**
 * Sample comparison features data
 */
const sampleComparisonFeatures = [
  {
    feature: "Konsultasi & Survey",
    renovation: true,
    visualization: true,
    consultation: true,
    estimation: true,
    execution: false,
    order: 1,
  },
  {
    feature: "Desain 3D & Layout",
    renovation: false,
    visualization: true,
    consultation: false,
    estimation: false,
    execution: false,
    order: 2,
  },
  {
    feature: "Estimasi Biaya (RAB)",
    renovation: true,
    visualization: false,
    consultation: false,
    estimation: true,
    execution: false,
    order: 3,
  },
  {
    feature: "Pengerjaan Renovasi",
    renovation: true,
    visualization: false,
    consultation: false,
    estimation: false,
    execution: true,
    order: 4,
  },
  {
    feature: "Pengawasan Proyek",
    renovation: true,
    visualization: false,
    consultation: false,
    estimation: false,
    execution: true,
    order: 5,
  },
];

async function seedServices() {
  console.log('🌱 Starting services seeding...\n');

  try {
    // Clear existing services
    console.log('Clearing existing services...');
    await db.delete(services);
    console.log('✓ Existing services cleared\n');

    // Clear existing comparison features
    console.log('Clearing existing comparison features...');
    await db.delete(serviceComparisonFeatures);
    console.log('✓ Existing comparison features cleared\n');

    let successfulSeeds = 0;

    // Seed services
    console.log('📦 Seeding services...\n');
    for (const [index, service] of sampleServices.entries()) {
      console.log(`\n🔧 Processing service ${index + 1}/${sampleServices.length}: ${service.title}`);

      // Insert into database
      console.log('Saving to database...');
      await db.insert(services).values(service);

      console.log(`✓ Service "${service.title}" seeded successfully!`);
      successfulSeeds++;
    }

    console.log('\n\n📊 Service seeding completed!');
    console.log(`📊 Total services processed: ${sampleServices.length}`);
    console.log(`📊 Successfully seeded: ${successfulSeeds}`);

    // Seed comparison features
    console.log('\n\n📦 Seeding comparison features...\n');
    let successfulFeatures = 0;

    for (const [index, feature] of sampleComparisonFeatures.entries()) {
      console.log(`\n📋 Processing feature ${index + 1}/${sampleComparisonFeatures.length}: ${feature.feature}`);

      // Insert into database
      console.log('Saving to database...');
      await db.insert(serviceComparisonFeatures).values(feature);

      console.log(`✓ Feature "${feature.feature}" seeded successfully!`);
      successfulFeatures++;
    }

    console.log('\n\n✅ All seeding completed!');
    console.log(`📊 Total features processed: ${sampleComparisonFeatures.length}`);
    console.log(`📊 Successfully seeded: ${successfulFeatures}`);

  } catch (error) {
    console.error('\n❌ Error seeding services:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedServices()
  .then(() => {
    console.log('\n👋 Service seeding process finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });