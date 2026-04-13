import jwt from 'jsonwebtoken'

export interface userPayload {
    id: string,
    email: string
}

const SECRET = "SECRET "

export function generateToken(payload: userPayload) {
    const token = jwt.sign(payload, SECRET,{ expiresIn: '7d' })
    return token
}

export function verifyToken(token: string) {
    try {
        const payload = jwt.verify(token, SECRET) as userPayload
        return payload
    }
    catch (err) {
        return null
    }
}