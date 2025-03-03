ALTER TABLE "challenges" RENAME COLUMN "testCaseSource" TO "test_case_source";--> statement-breakpoint
ALTER TABLE "challenges" RENAME COLUMN "releaseDate" TO "release_date";--> statement-breakpoint
ALTER TABLE "user_submissions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_submissions" RENAME COLUMN "challengeId" TO "challenge_id";--> statement-breakpoint
ALTER TABLE "user_submissions" RENAME COLUMN "runtimeDuration" TO "runtime_duration";--> statement-breakpoint
ALTER TABLE "user_submissions" RENAME COLUMN "numberOfSubmissions" TO "number_of_submissions";--> statement-breakpoint
ALTER TABLE "user_submissions" RENAME COLUMN "timeTaken" TO "time_taken";