import express from 'express'
import type { Application } from 'express'
import router from '../todo/Routes.js'


//                                             .-> Application is a TypeScript type that represents the Express application instance.
//                                             |   TypeScript understands that app is an Express application object.
export function createServerApplication(): Application {
    const app = express()

    app.use(express.json())

    app.use('/todos', router)

    return app
}