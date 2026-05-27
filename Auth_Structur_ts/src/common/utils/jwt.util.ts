import crypto from "crypto";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET as string;

// Create raw token and hashed token

const generateRandomToken = (): { rawToken: string; hashedToken: string; } => {

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    return { rawToken, hashedToken };
};

const generateAccessToken = (payload: string | object | Buffer): string => {

    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    } as SignOptions);
};

const verifyAccessToken = (token: string): string | JwtPayload => {

    return jwt.verify(token, ACCESS_SECRET);
};

const generateRefreshToken = (payload: string | object | Buffer): string => {

    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "15m"
    } as SignOptions);
};

const verifyRefreshToken = (token: string): string | JwtPayload => {

    return jwt.verify(token, REFRESH_SECRET);
};

export {
    generateRandomToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};