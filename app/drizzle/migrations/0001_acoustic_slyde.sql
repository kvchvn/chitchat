CREATE TABLE IF NOT EXISTS "chitchat-v2_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL
);
--> statement-breakpoint
DROP TABLE "chitchat-v2_post";