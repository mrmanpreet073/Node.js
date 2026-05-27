import { pgTable, serial, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
    "customer",
    "seller",
    "admin",
    "support"
]);

export const authUsers = pgTable("authUsers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").default("customer"),
    isVerified: boolean("isVerified").default(false).notNull(),
    verificationToken: varchar("verificationToken", { length: 255 }),
    verificationTokenExpiresAt:timestamp("verification_token_expiry"),
    refreshToken: varchar("refreshToken", { length: 255 }),
    resetPasswordToken: varchar("resetPasswordToken", { length: 255 }),
    resetPasswordExpiry: timestamp("reset_password_expiry"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})