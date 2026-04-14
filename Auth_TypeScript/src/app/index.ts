import express from 'express'
import authRouter from './auth/router.js';
import { authenticationMiddleware } from './middleware/auth.middleware.js';
import cookieParser from 'cookie-parser';


function createApplication() {
    const app = express()
    app.use(authenticationMiddleware())
    
    app.use(express.json())
    app.use(cookieParser());
    app.use('/auth', authRouter)
    app.get('/', (req, res) => {
        return res.json({ message: "welcome" });
    })
    return app
}

export { createApplication }