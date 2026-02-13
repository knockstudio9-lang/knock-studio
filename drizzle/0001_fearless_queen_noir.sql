ALTER TABLE "contact_submissions" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "image_public_ids" jsonb DEFAULT '[]'::jsonb;