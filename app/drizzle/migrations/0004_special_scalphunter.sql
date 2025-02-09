CREATE TABLE IF NOT EXISTS "chitchat-v2_chats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id_1" varchar(255) NOT NULL,
	"user_id_2" varchar(255) NOT NULL
);
--> statement-breakpoint
DROP TABLE "chitchat-v2_friend_requests";--> statement-breakpoint
DROP TABLE "chitchat-v2_friends";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_chats" ADD CONSTRAINT "chitchat-v2_chats_user_id_1_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id_1") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_chats" ADD CONSTRAINT "chitchat-v2_chats_user_id_2_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id_2") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
