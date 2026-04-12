import express from 'express'
import authRouter from './auth/router.js';


function createApplication() {
    const app = express()
    
    app.use(express.json())
    app.use('/auth', authRouter)
    app.get('/', (req, res) => {
        return res.json({ message: "welcome" });
    })
    return app
}

export { createApplication }