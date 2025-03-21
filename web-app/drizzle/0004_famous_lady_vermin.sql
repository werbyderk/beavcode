ALTER TABLE "challenges" ALTER COLUMN "release_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_submissions" ALTER COLUMN "runtime_duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_submissions" ALTER COLUMN "number_of_submissions" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_submissions" ALTER COLUMN "time_taken" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "preview_description" varchar(2500);