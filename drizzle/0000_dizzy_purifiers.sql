CREATE TABLE "about_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"service" varchar(100) NOT NULL,
	"area" varchar(100),
	"budget" varchar(100),
	"details" text,
	"status" varchar(50) DEFAULT 'new',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"location" varchar(255) NOT NULL,
	"year" varchar(10) NOT NULL,
	"area" varchar(50) NOT NULL,
	"completion" varchar(20) NOT NULL,
	"description" text NOT NULL,
	"before_image" varchar(500),
	"before_image_public_id" varchar(500),
	"after_image" varchar(500),
	"after_image_public_id" varchar(500),
	"gallery_images" jsonb DEFAULT '[]'::jsonb,
	"gallery_image_public_ids" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb NOT NULL,
	"client" varchar(255),
	"scope" text,
	"budget" varchar(100),
	"team" text,
	"status" varchar(20) DEFAULT 'published',
	"featured" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_comparison_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"feature" varchar(255) NOT NULL,
	"renovation" boolean DEFAULT false,
	"visualization" boolean DEFAULT false,
	"consultation" boolean DEFAULT false,
	"estimation" boolean DEFAULT false,
	"execution" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" varchar(100) NOT NULL,
	"icon" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"duration" varchar(100) NOT NULL,
	"features" jsonb NOT NULL,
	"best_for" text NOT NULL,
	"image" varchar(500) NOT NULL,
	"image_public_id" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "services_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"site_name" varchar(255),
	"site_title" varchar(255),
	"site_description" text,
	"favicon" varchar(500),
	"favicon_public_id" varchar(500),
	"apple_touch_icon" varchar(500),
	"apple_touch_icon_public_id" varchar(500),
	"og_image" varchar(500),
	"og_image_public_id" varchar(500),
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"author" varchar(255),
	"theme_color" varchar(50) DEFAULT '#9C7E5A',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"image" varchar(500) NOT NULL,
	"image_public_id" varchar(500),
	"bio" text,
	"is_founder" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(500),
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
