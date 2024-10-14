DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "chitchat-v2_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"is_new_user" boolean DEFAULT true,
	CONSTRAINT "chitchat-v2_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "chitchat-v2_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_friend_requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"receiver_id" varchar(255) NOT NULL,
	"status" "status"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_friends" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_1" varchar(255) NOT NULL,
	"user_2" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chitchat-v2_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_account" ADD CONSTRAINT "chitchat-v2_account_user_id_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_session" ADD CONSTRAINT "chitchat-v2_session_user_id_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friend_requests" ADD CONSTRAINT "chitchat-v2_friend_requests_sender_id_chitchat-v2_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friend_requests" ADD CONSTRAINT "chitchat-v2_friend_requests_receiver_id_chitchat-v2_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friends" ADD CONSTRAINT "chitchat-v2_friends_user_1_chitchat-v2_user_id_fk" FOREIGN KEY ("user_1") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friends" ADD CONSTRAINT "chitchat-v2_friends_user_2_chitchat-v2_user_id_fk" FOREIGN KEY ("user_2") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "chitchat-v2_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "chitchat-v2_session" USING btree ("user_id");