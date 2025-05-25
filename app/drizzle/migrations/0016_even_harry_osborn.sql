ALTER TABLE "chitchat-v2_account" DROP CONSTRAINT "chitchat-v2_account_user_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_session" DROP CONSTRAINT "chitchat-v2_session_user_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_chats" DROP CONSTRAINT "chitchat-v2_chats_user_id_1_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_chats" DROP CONSTRAINT "chitchat-v2_chats_user_id_2_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_messages" DROP CONSTRAINT "chitchat-v2_messages_sender_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_messages" DROP CONSTRAINT "chitchat-v2_messages_receiver_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_account" ADD CONSTRAINT "chitchat-v2_account_user_id_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_session" ADD CONSTRAINT "chitchat-v2_session_user_id_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_chats" ADD CONSTRAINT "chitchat-v2_chats_user_id_1_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id_1") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_chats" ADD CONSTRAINT "chitchat-v2_chats_user_id_2_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id_2") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_messages" ADD CONSTRAINT "chitchat-v2_messages_sender_id_chitchat-v2_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_messages" ADD CONSTRAINT "chitchat-v2_messages_receiver_id_chitchat-v2_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
