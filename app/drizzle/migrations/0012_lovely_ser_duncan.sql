ALTER TABLE "chitchat-v2_chats" ADD COLUMN "blocked_by" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_chats" ADD CONSTRAINT "chitchat-v2_chats_blocked_by_chitchat-v2_user_id_fk" FOREIGN KEY ("blocked_by") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
