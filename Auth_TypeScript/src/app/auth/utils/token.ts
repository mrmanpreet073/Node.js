import jwt from 'jsonwebtoken'

export interface userPayload {
    id: string,
    email: string
}

const accessSECRET = "accessSECRET"
const refreshSECRET = "refreshSECRET"

export function generateAccessToken(payload: userPayload) {
    return jwt.sign(payload, accessSECRET, { expiresIn: '5m' })
}

export function generateRefreshToken(payload: userPayload) {
    return jwt.sign(payload, refreshSECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, accessSECRET) as userPayload
    } catch {
        return null
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, refreshSECRET) as userPayload
    } catch {
        return null
    }
}