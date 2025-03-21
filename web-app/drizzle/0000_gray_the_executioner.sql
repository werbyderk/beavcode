CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('complete', 'attempted');--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenges_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"difficulty" "challenge_difficulty" NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(5000) NOT NULL,
	"testCaseSource" text,
	"releaseDate" date
);
--> statement-breakpoint
CREATE TABLE "user_submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"challengeId" integer NOT NULL,
	"runtimeDuration" integer NOT NULL,
	"numberOfSubmissions" integer DEFAULT 0 NOT NULL,
	"timeTaken" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(20) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"streak_count" integer DEFAULT 0,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
