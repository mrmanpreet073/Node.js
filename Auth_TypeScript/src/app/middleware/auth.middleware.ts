import type { NextFunction, Response, Request } from "express"
import { verifyAccessToken } from "../auth/utils/token.js";



export const authenticationMiddleware = () => {
    return function (req: Request, res: Response, next: NextFunction) {

        const header = req.headers['authorization'];
        if (!header) return next()
        // ✅ add space to be strict
        if (!header?.startsWith('Bearer ')) return res.status(400).json({ error: 'authorization header must start with Bearer' })

        const token = header.split(" ")[1];

        if (!token) return res.status(400).json({ error: "authorization header must start with Bearer and followed by token" })

        const decodedValues = verifyAccessToken(token);
        if (!decodedValues) {
            return res.status(401).json({ error: 'Invalid or expired token' })
        }
        req.user = decodedValues;
        next()
    }

}

export const restrictAuthenticationMiddleware = () => {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })
        return next()
    }
}