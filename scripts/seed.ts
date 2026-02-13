// scripts/seed.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import { projects } from '../lib/db/schema';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Upload an image to Cloudinary
 * @param imagePath - Path to the image file (local path or URL)
 * @param folder - Cloudinary folder name
 * @returns Object with secure_url and public_id, or null if upload fails
 */
async function uploadToCloudinary(
  imagePath: string,
  folder: string = 'projects'
): Promise<{ url: string; publicId: string } | null> {
  try {
    // Check if the path is a local file path
    const isLocalPath = fs.existsSync(imagePath);
    
    if (!isLocalPath) {
      console.warn(`⚠️  Image not found, skipping: ${imagePath}`);
      return null;
    }
    
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto' as const,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    };

    // Upload from local file
    const result = await cloudinary.uploader.upload(imagePath, uploadOptions);

    console.log(`✓ Uploaded: ${result.public_id}`);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Error uploading ${imagePath}:`, error);
    return null;
  }
}

/**
 * Sample project data structure using local portfolio images
 * With Indonesian context
 */
const sampleProjects = [
  {
    title: "Mr. W House",
    category: "Home Renovation",
    location: "Komplek Perumahan Mandar Bintaro, Tangerang Selatan",
    year: "2025",
    area: "277m2",
    completion: "2025",
    description: "Renovasi seluruh area rumah & tampilan fasad dengan konsep minimalis, membuat terlihat modern dan berkarakter.",
    beforeImagePath: "",
    afterImagePath: path.join(process.cwd(), 'public/portfolio/Bintaro/cover.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/Bintaro/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/Bintaro/gallery2.jpg'),
      path.join(process.cwd(), 'public/portfolio/Bintaro/gallery3.jpg'),
      path.join(process.cwd(), 'public/portfolio/Bintaro/gallery4.jpg'),
    ],
    tags: ["Modern", "Minimalist"],
  },
  {
    title: "Mr.Y House",
    category: "Home Renovation",
    location: "Olivia, Alam Sutera",
    year: "2025",
    area: "350m2",
    completion: "2025",
    description: "Proyek renovasi rumah di kawasan Olivia Alam Sutera ini dirancang Modern Minimalist untuk menghadirkan hunian memiliki karakter yang kuat dan relevan dengan gaya hidup penghuninya.",
    beforeImagePath: "",
    afterImagePath: path.join(process.cwd(), 'public/portfolio/Alsut/after.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/Alsut/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/Alsut/gallery2.jpg'),
      path.join(process.cwd(), 'public/portfolio/Alsut/gallery3.jpg'),
      path.join(process.cwd(), 'public/portfolio/Alsut/gallery4.jpg'),
    ],
    tags: ["Modern", "Minimalist"],
  },
  {
    title: "Mr.R House",
    category: "Renovasi Total",
    location: "Puri Bintaro Residence, Tangerang Selatan",
    year: "2024",
    area: "60m",
    completion: "2023",
    description: "Full Renovasi (Facade, Backyard, Living Room, Bathroom, & Bedroom)",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/1/before.jpg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/1/after.jpeg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/1/gallery1.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery2.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery3.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery4.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery5.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery6.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery7.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery8.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery9.jpeg'),
      path.join(process.cwd(), 'public/portfolio/1/gallery10.jpeg'),
    ],
    tags: ["Modern", "Mewah", "Berkelanjutan"],
  },
  {
    title: "Mr. ET House",
    category: "Landscape",
    location: "Golden Park 2, Cisauk",
    year: "2024",
    area: "20m²",
    completion: "2024",
    description: "Renovasi taman depan ini dirancang dengan pendekatan landscape minimalis yang menekankan kesederhanaan bentuk, kerapian komposisi, dan welcoming sejak area depan rumah.",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/2/before.jpg'), // Empty string for projects without before image
    afterImagePath: path.join(process.cwd(), 'public/portfolio/2/after.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/2/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/2/gallery2.jpg'),
      path.join(process.cwd(), 'public/portfolio/2/gallery3.jpg'),
      path.join(process.cwd(), 'public/portfolio/2/gallery4.jpg'),
    ], // Empty array for projects without gallery images
    tags: ["Minimalis", "Tropis", "Modern"],
  },
  {
    title: "D&B House",
    category: "Home Renovation",
    location: "Taman Century, Bekasi Barat",
    year: "2023",
    area: "50m²",
    completion: "2023",
    description: "Merenovasi ruangan existing menjadi laundry area dan pengecatan full area.",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/6/before.jpg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/6/after.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/6/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery2.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery3.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery4.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery5.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery6.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery7.jpg'),
      path.join(process.cwd(), 'public/portfolio/6/gallery8.jpg'),
    ],
    tags: ["RenovasiRumah"],
  },
  {
    title: "Mrs. D House",
    category: "Renovasi Rumah",
    location: "Simplicity Residence, BSD",
    year: "2023",
    area: "75m²",
    completion: "2023",
    description: "Renovasi Backyard & Carport",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/3/before.jpg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/3/after.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/3/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/3/gallery2.jpg'),
      path.join(process.cwd(), 'public/portfolio/3/gallery3.jpg'),
      path.join(process.cwd(), 'public/portfolio/3/gallery4.jpg'),
      path.join(process.cwd(), 'public/portfolio/3/gallery5.jpg'),
    ],
    tags: ["Minimalis", "Tropis", "Modern"],
  },
  {
    title: "AS House",
    category: "Renovasi Dapur & Kamar Mandi",
    location: "Komplek Maharta, Tangerang Selatan",
    year: "2022",
    area: "12m²",
    completion: "2022",
    description: "Transformasi dapur dan kamar mandi dengan fungsionalitas optimal.",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/5/before.jpg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/5/after.png'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/5/gallery1.png'),
    ],
    tags: ["RenovasiRumah"],
  },
  {
    title: "Desain Tangga Rumah Tinggal",
    category: "Desain Interior",
    location: "Depok",
    year: "2023",
    area: "150m² / 15T",
    completion: "2023",
    description: "Desain ulang tangga utama dengan material kayu jati dan kaca tempered, menciptakan focal point yang elegan di ruang tamu.",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/4/before.jpg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/4/after.jpg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/4/gallery1.jpg'),
      path.join(process.cwd(), 'public/portfolio/4/gallery2.jpg'),
    ],
    tags: ["Kayu Jati", "Minimalis", "Elegan"],
  },
  {
    title: "FZD House",
    category: "Landscape",
    location: "Griya Kedaung Asri - Ciputat, Tangerang Selatan",
    year: "2025",
    area: "16m²",
    completion: "2025",
    description: "Renovasi area taman depan ini mengusung konsep taman kering dengan penambahan bench sebagai elemen fungsional.",
    beforeImagePath: "",
    afterImagePath: path.join(process.cwd(), 'public/portfolio/7/after.jpeg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/7/gallery1.jpeg'),
      path.join(process.cwd(), 'public/portfolio/7/gallery2.jpeg'),
      path.join(process.cwd(), 'public/portfolio/7/gallery3.jpeg'),
      path.join(process.cwd(), 'public/portfolio/7/gallery4.jpeg'),
    ],
    tags: ["Minimalis", "Elegan"],
  },
  {
    title: "On Going Project - Mr. AF House",
    category: "Home Renovation",
    location: "River Valley Residence - Cirendeu, Lebak Bulus",
    year: "2026",
    area: "165m²",
    completion: "2026",
    description: "Full Renovation & Interior",
    beforeImagePath: "",
    afterImagePath: path.join(process.cwd(), 'public/portfolio/9/after.jpeg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/9/gallery1.jpeg'),
      path.join(process.cwd(), 'public/portfolio/9/gallery2.jpeg'),
      path.join(process.cwd(), 'public/portfolio/9/gallery3.jpeg'),
      path.join(process.cwd(), 'public/portfolio/9/gallery4.jpeg'),
    ],
    tags: ["Renovation"],
  },
  {
    title: "On Going Project - Mr.WM House",
    category: "Design & Build",
    location: "Griya Rajawali Bintaro, Tangerang Selatan",
    year: "2026",
    area: "90m²",
    completion: "2026",
    description: "Proyek renovasi total rumah lama ini masih dalam tahap pengerjaan, dengan konsep minimalis modern yang menekankan bentuk sederhana, tata ruang fungsional, dan detail yang rapi.",
    beforeImagePath: path.join(process.cwd(), 'public/portfolio/8/before.jpeg'),
    afterImagePath: path.join(process.cwd(), 'public/portfolio/8/after.jpeg'),
    galleryImagePaths: [
      path.join(process.cwd(), 'public/portfolio/8/gallery3.jpeg'),
      path.join(process.cwd(), 'public/portfolio/8/gallery4.jpeg'),
      path.join(process.cwd(), 'public/portfolio/8/gallery2.jpeg'),
      path.join(process.cwd(), 'public/portfolio/8/gallery1.jpeg'),
    ],
    tags: ["Modern", "Minimalist", "House"],
  },
];

async function seedProjects() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing projects (optional - comment out if you want to keep existing data)
    console.log('Clearing existing projects...');
    await db.delete(projects);
    console.log('✓ Existing projects cleared\n');

    let successfulSeeds = 0;

    for (const [index, project] of sampleProjects.entries()) {
      console.log(`\n📦 Processing project ${index + 1}/${sampleProjects.length}: ${project.title}`);

      // Upload before image (only if it exists)
      let beforeImage = null;
      if (project.beforeImagePath) {
        console.log('Uploading before image...');
        beforeImage = await uploadToCloudinary(
          project.beforeImagePath,
          `projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`
        );
      }

      // Upload after image
      console.log('Uploading after image...');
      const afterImage = await uploadToCloudinary(
        project.afterImagePath,
        `projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`
      );

      // Upload gallery images
      console.log(`Uploading gallery images...`);
      const galleryImages = [];
      const galleryPublicIds = [];

      for (const imagePath of project.galleryImagePaths) {
        const uploaded = await uploadToCloudinary(
          imagePath,
          `projects/${project.title.toLowerCase().replace(/\s+/g, '-')}/gallery`
        );
        if (uploaded) {
          galleryImages.push(uploaded.url);
          galleryPublicIds.push(uploaded.publicId);
        }
      }

      // Only insert if we have at least the after image
      if (afterImage) {
        // Insert into database
        console.log('Saving to database...');
        await db.insert(projects).values({
          title: project.title,
          category: project.category,
          location: project.location,
          year: project.year,
          area: project.area,
          completion: project.completion,
          description: project.description,
          beforeImage: beforeImage?.url || null,
          beforeImagePublicId: beforeImage?.publicId || null,
          afterImage: afterImage.url,
          afterImagePublicId: afterImage.publicId,
          galleryImages: galleryImages,
          galleryImagePublicIds: galleryPublicIds,
          tags: project.tags,
        });

        console.log(`✓ Project "${project.title}" seeded successfully!`);
        successfulSeeds++;
      } else {
        console.warn(`⚠️  Skipping project "${project.title}" due to missing required after image`);
      }
    }

    console.log('\n\n✅ Database seeding completed!');
    console.log(`📊 Total projects processed: ${sampleProjects.length}`);
    console.log(`📊 Successfully seeded: ${successfulSeeds}`);
    console.log(`📊 Skipped: ${sampleProjects.length - successfulSeeds}`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedProjects()
  .then(() => {
    console.log('\n👋 Seeding process finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });