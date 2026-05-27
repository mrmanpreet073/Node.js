import { eq } from "drizzle-orm";
import { generateAccessToken, generateRandomToken, generateRefreshToken } from "../../common/utils/jwt.util.js";
import { authUsers } from "../../db/authSchema.js";
import { db } from "../../db/index.js";
import ApiError from "../../common/utils/apiError.js";
import type { signUpDtoType } from "./DTO/signup.dto.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../common/config/email.js";
import crypto from "crypto";
import type { LoginDtoType } from "./DTO/login.dto.js";


const signUp = async (userdata: signUpDtoType) => {

    const { name, email, password, role } = userdata;

    const { rawToken, hashedToken } = generateRandomToken();


    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email))

    if (user) {
        throw ApiError.conflict("User Already Existed ")
    }

    const [result] = await db.insert(authUsers)
        .values({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken: hashedToken,
            verificationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
        })
        .returning();


    try {
        await sendVerificationEmail(email, rawToken);
    } catch (error) {
        console.error("Failed to send verification email. Please try again later.", error);
    }

    return {
        user: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
        },
    }
}

const verifyEmail = async (rawToken: string) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const [user] = await db
        .select()
        .from(authUsers)
        .where(eq(authUsers.verificationToken, hashedToken));

    if (!user) {
        throw ApiError.badRequest("Invalid verification token");
    }

    if (
        user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()
    ) {
        throw ApiError.badRequest("Verification token expired");
    }

    const [result] = await db.update(authUsers)
        .set({
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null
        })
        .where(eq(authUsers.verificationToken, hashedToken))
        .returning();

    return {
        user: {
            id: result.id,
            name: result.name,
            email: result.email
        },
    };
};

const login = async (userData: LoginDtoType) => {

    const { email, password } = userData;

    const [user] = await db
        .select()
        .from(authUsers)
        .where(eq(authUsers.email, email))

    if (!user) {
        throw ApiError.badRequest("Invalid email or password")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw ApiError.badRequest("Wrong Credentials")
    }

    if (!user.isVerified) {
        throw ApiError.forbidden("Please verify your email first");
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    const refreshToken = generateRefreshToken({
        id: user.id
    })

    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
        
    const [update] = await db.update(authUsers)
        .set({
            refreshToken: hashedRefreshToken
        })
        .where(eq(authUsers.email, email))
        .returning();

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken
    }

}

export { signUp, verifyEmail, login }