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
