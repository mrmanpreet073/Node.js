import type { Request, Response } from "express";
import { signinModel, signupModel } from "./modals.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import { generateToken } from "./utils/token.js";

class AuthenticationController {
    public handleSignUp = async (req: Request, res: Response) => {
        try {
            // validate with Zod
            const validationResult = signupModel.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Body validation Failed",
                    error: validationResult.error.issues
                });
            }

            const { firstName, lastName, email, password } = validationResult.data;

            // check if user exists
            const existance = await db.select().from(usersTable).where(eq(usersTable.email, email));
            if (existance.length > 0) {
                return res.status(400).json({  // ✅ return added
                    message: "User with this email already exists",
                    error: "Duplicate Entry"
                });
            }

            // hash password
            const salt = randomBytes(32).toString('hex');
            const hash = createHmac('sha256', salt).update(password).digest('hex');

            // insert user
            const [result] = await db.insert(usersTable).values({
                firstName,
                lastName,
                email,
                password: hash,
                salt
            }).returning({ id: usersTable.id });

            return res.status(201).json({
                message: 'User has been created successfully',
                data: { id: result?.id }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public handleSignIn = async (req: Request, res: Response) => {
        try {
            const validationResult = signinModel.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Body validation Failed",
                    error: validationResult.error.issues
                });
            }
            const { email, password } = validationResult.data;

            const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

            if (!user) return res.status(404).json({ message: "Invalid email or password "})
            // verify password 
            const salt = user.salt
            const hashPass = createHmac('sha256', salt).update(password).digest('hex')

            if (user.password !== hashPass) return res.status(401).json({ message: `Invalid email or password` })

            const token = generateToken({ id: user.id, email: user.email })

            return res.json({ message: 'Signin Success', data: { token } })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default AuthenticationController;