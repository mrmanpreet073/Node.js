import { eq } from "drizzle-orm";
import { generateAccessToken, generateRandomToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt.util.js";
import { authUsers } from "../../db/authSchema.js";
import { db } from "../../db/index.js";
import ApiError from "../../common/utils/apiError.js";
import type { signUpDtoType } from "./DTO/signup.dto.js";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail, sendVerificationEmail } from "../../common/config/email.js";
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
        throw ApiError.internal("Failed to send verification email. Please try again later.");
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

const logout = async (userId: number) => {

    await db.update(authUsers)
        .set({
            refreshToken: null,
        })
        .where(eq(authUsers.id, userId));

    return {
        success: true
    };
};

const refresh = async (token: string) => {


    try {
        verifyRefreshToken(token);
    } catch {
        throw ApiError.badRequest(
            "Refresh token expired or invalid"
        );
    }


    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const [user] = await db
        .select()
        .from(authUsers)
        .where(eq(authUsers.refreshToken, hashedToken))

    if (!user) {
        throw ApiError.badRequest("invalid Token")
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

    await db.
        update(authUsers)
        .set({ refreshToken: hashedRefreshToken })
        .where(eq(authUsers.id, user.id))



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

const forgotPassword = async (email: string) => {

    const [user] = await db
        .select()
        .from(authUsers)
        .where(eq(authUsers.email, email));

    if (!user) {
        throw ApiError.notFound("No account with this email");
    }

    const { rawToken, hashedToken } = generateRandomToken();

    await db.update(authUsers)
        .set({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: new Date(
                Date.now() + 60 * 60 * 1000
            )
        })
        .where(eq(authUsers.id, user.id));

    try {
        await sendResetPasswordEmail(email, rawToken)
    } catch (error) {
        throw ApiError.internal("Failed to send reset password email. Please try again later.");
    }

    return {
        success: true
    };

};

const resetPassword = async (rawToken: string,newPassword: string) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const [user] = await db
        .select()
        .from(authUsers)
        .where(
            eq(authUsers.resetPasswordToken, hashedToken)
        );

    if (!user) {
        throw ApiError.badRequest( "Invalid reset token");
    }

    if ( !user.resetPasswordExpiry || user.resetPasswordExpiry < new Date())
         {
        throw ApiError.badRequest( "Reset token expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(authUsers)
        .set({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null
        })
        .where(eq(authUsers.id, user.id));

    return {
        success: true
    };
};

export { signUp, verifyEmail, login, logout, refresh,forgotPassword,resetPassword }