ALTER TABLE "contact_submissions" ALTER COLUMN "area" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_submissions" ALTER COLUMN "budget" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "details" text;