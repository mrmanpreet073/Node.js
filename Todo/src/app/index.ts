import express from 'express'
import type { Application } from 'express'
import router from '../todo/Routes.js'


//                                             .-> Application is a TypeScript type that represents the Express application instance.
//                                             |   TypeScript understands that app is an Express application object.
export function createServerApplication(): Application {
    const app = express()

    app.use(express.json())
//  -----------------------
//          |
//           > What it actually does

//             . When a client sends data to your server in JSON format, this middleware:
//             . Reads the request body
//             . Parses the JSON
//             . Converts it into a JavaScript object
//             . Stores it in req.body
//          |
//           > When you need it

//             .You use it when your API receives JSON data, for example:
//             .POST request
//             .PUT request
//             .PATCH request

    app.use('/todos', router)
// ---------------------------
//             |
//              > It tells Express:
//                .“Use this router for all requests that start with /todos.”
//                .So any route defined inside router will automatically be prefixed with /todos.

    return app
}