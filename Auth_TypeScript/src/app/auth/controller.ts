import type { Request, Response } from "express";
import { signinModel, signupModel } from "./modals.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./utils/token.js";

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
                email: email.toLowerCase(),
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

            const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()))

            if (!user) return res.status(404).json({ message: "Invalid email or password " })
            if (!user.password) return res.status(500).json({ message: "User password missing" });


            // verify password 
            const salt = user.salt
            const hashPass = createHmac('sha256', salt).update(password).digest('hex')

            if (user.password !== hashPass) return res.status(401).json({ message: `Invalid email or password` })

            const accessToken = generateAccessToken({ id: user.id, email: user.email })
            const refreshToken = generateRefreshToken({ id: user.id, email: user.email })
            const hashedRefreshToken = createHmac('sha256', salt)
                .update(refreshToken)
                .digest('hex');

            await db
                .update(usersTable)
                .set({ refreshToken: hashedRefreshToken })
                .where(eq(usersTable.id, user.id));

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.json({ message: 'Signin Success', user: { id: user.id, name: user.firstName }, accessToken })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public handleMe = async (req: Request, res: Response) => {

        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })
        const id = req.user?.id

        const [user] = await db.select({
            id: usersTable.id,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            email: usersTable.email,
        }).from(usersTable).where(eq(usersTable.id, id))

        if (!user) return res.status(404).json({ error: 'User not found' })

        return res.json({ data: user })
    }
    public handleRefresh = async (req: Request, res: Response) => {
        const oldToken = req.cookies?.refreshToken;

        if (!oldToken) {
            return res.status(401).json({ error: "Token is missing" });
        }

        const decoded = verifyRefreshToken(oldToken);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // 1. Fetch only necessary fields
        const [user] = await db
            .select({
                id: usersTable.id,
                salt: usersTable.salt,
                refreshToken: usersTable.refreshToken,
                firstName: usersTable.firstName,
                email: usersTable.email
            })
            .from(usersTable)
            .where(eq(usersTable.id, decoded.id));

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Verify hashed token
        const hashedOldToken = createHmac('sha256', user.salt)
            .update(oldToken)
            .digest('hex');

        if (!user.refreshToken || user.refreshToken !== hashedOldToken) {
            // SECURITY SENSEI: If reuse is detected, you might want to 
            // clear user.refreshToken entirely here to kill all sessions.
            return res.status(401).json({ error: "Token reuse detected or invalid token" });
        }

        // 3. Generate New Pair
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

        const hashedNewToken = createHmac('sha256', user.salt)
            .update(newRefreshToken)
            .digest('hex');

        // 4. Update DB & Respond
        await db
            .update(usersTable)
            .set({ refreshToken: hashedNewToken })
            .where(eq(usersTable.id, user.id));

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: 'Refresh successful',
            user: { id: user.id, name: user.firstName },
            accessToken
        });
    }
}

export default AuthenticationController;