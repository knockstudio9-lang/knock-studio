CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"service" varchar(100) NOT NULL,
	"area" varchar(100) NOT NULL,
	"budget" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'new',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
