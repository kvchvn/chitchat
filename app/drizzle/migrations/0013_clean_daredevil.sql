DROP TABLE "chitchat-v2_message_likes";--> statement-breakpoint
ALTER TABLE "chitchat-v2_messages" ADD COLUMN "is_liked" boolean DEFAULT false NOT NULL;