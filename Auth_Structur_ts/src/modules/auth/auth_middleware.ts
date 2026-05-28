import type { NextFunction, Request, Response } from "express";
import ApiError from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.util.js";
import { authUsers } from "../../db/authSchema.js";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";

type TokenPayload = {
    id: number;
    email: string;
    role: string;
};

const authenticate = async (req: Request, res: Response, next: NextFunction
) => {

    let token;

    const authHeader = req.headers.authorization;

    if (
        authHeader &&
        authHeader.toLowerCase().startsWith("bearer ")
    ) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        throw ApiError.unauthorized("Missing token");
    }

    const decoded = verifyAccessToken(token) as TokenPayload;

    if (!decoded) {
        throw ApiError.unauthorized("Invalid token");
    }

    const [user] = await db
        .select()
        .from(authUsers)
        .where(eq(authUsers.id, decoded.id));

    if (!user) {
        throw ApiError.unauthorized("User no longer exists");
    }

    req.user = decoded;

    next();
};

export {authenticate}