CREATE TYPE "public"."role" AS ENUM('customer', 'seller', 'admin', 'support');--> statement-breakpoint
CREATE TABLE "authUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'customer',
	"isVerified" boolean DEFAULT false NOT NULL,
	"verificationToken" varchar(255),
	"verification_token_expiry" timestamp,
	"refreshToken" varchar(255),
	"resetPasswordToken" varchar(255),
	"reset_password_expiry" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "authUsers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
