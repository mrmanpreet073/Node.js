import type { Request, Response } from "express";
import { signinModel, signupModel } from "./modals.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto"


class AuthenticationController {
    public async handleSignUp(req: Request, res: Response) {
        // validates the feilds data with ZOD validation
        const validationResult = signupModel.safeParse(req.body);
        // if any error
        if (validationResult.error) return res.status(400).json({ message: "Body validation Failed ", error: validationResult.error.issues });
        // destructuring the values
        const { firstName, lastName, email, password } = validationResult.data;
        // check if user exists 
        const existannce = await db.select().from(usersTable).where(eq(usersTable.email, email));
        // if yes then throw error 
        if (existannce.length > 0) res.status(400).json({ message: "User with this email already exist", error: "Duplicate Entery" });

        // hash the password using salt 
        const salt = randomBytes(32).toString('hex');
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: usersTable.id })


        return res.status(201).json({ message: 'user has been created successfully', data: { id: result?.id } })


    }
}

export default AuthenticationController