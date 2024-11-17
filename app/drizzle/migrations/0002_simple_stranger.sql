ALTER TABLE "chitchat-v2_friends" RENAME COLUMN "user_1_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "chitchat-v2_friends" RENAME COLUMN "user_2_id" TO "friend_id";--> statement-breakpoint
ALTER TABLE "chitchat-v2_friends" DROP CONSTRAINT "chitchat-v2_friends_user_1_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chitchat-v2_friends" DROP CONSTRAINT "chitchat-v2_friends_user_2_id_chitchat-v2_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friends" ADD CONSTRAINT "chitchat-v2_friends_user_id_chitchat-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chitchat-v2_friends" ADD CONSTRAINT "chitchat-v2_friends_friend_id_chitchat-v2_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."chitchat-v2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
