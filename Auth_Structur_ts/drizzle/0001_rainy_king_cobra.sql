CREATE TYPE "public"."role" AS ENUM('customer', 'seller', 'admin', 'support');--> statement-breakpoint
CREATE TABLE "authUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'customer',
	"isVerified" varchar(5) DEFAULT 'false' NOT NULL,
	"verificationToken" varchar(255),
	"refreshToken" varchar(255),
	"resetPasswordToken" varchar(255),
	"reserPasswordExpiry" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "authUsers_email_unique" UNIQUE("email")
);
