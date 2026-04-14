import { text, timestamp, boolean, integer, uuid, pgTable, varchar } from "drizzle-orm/pg-core";
//                                creates user table in db
export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    //             Mongoose uses _id automatically
    firstName: varchar('first_name', { length: 45 }).notNull(),// → required: true in Mongoose
    lastName: varchar('last_name', { length: 45 }),

    email: varchar('email', { length: 322 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),// → default: false in Mongoose
    //                                     ---------------
    password: varchar('password', { length: 66 }).notNull(),
    salt: text('salt').notNull(),
    
    accessToken: varchar('access_token', { length: 512 }),   // optional — null by default
    refreshToken: varchar('refresh_token', { length: 512 }), // optional — null by default


    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()) // → Mongoose's { timestamps: true } handles this behind the scenes

});
