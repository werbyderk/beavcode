ALTER TABLE "user_submissions" ADD COLUMN "completed_challenge" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DROP TYPE "public"."submission_status";