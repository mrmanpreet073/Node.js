ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "salt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_token" varchar(512);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(512);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");