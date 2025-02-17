ALTER TABLE "chitchat-v2_messages" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "chitchat-v2_messages" ALTER COLUMN "updated_at" SET DEFAULT now();