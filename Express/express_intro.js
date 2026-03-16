const express = require('express');


function block_1_basicServer() {
    return new Promise((resolev) => {
        const app = express()
        app.use(express.json()) // -> Understand json 
        //      . Request arrives
        //      . Middleware checks Content-Type: application/json
        //      . Reads request body
        //      . Runs JSON.parse()
        //      . Adds result to req.body
        //      . Passes control to next route

        app.get('/menu', (req, res) => {
            res.json({
                items: [
                    "thali",
                    "biryani"
                ]
            })
        })

        app.get('/search', (req, res) => {
            const { q, limit } = req.body
            res.json({
                query: q,
                limit: limit || '10'
            })
        })
        app.get('/menu/:id', (req, res) => {
            const { id } = req.params
            res.json({
                item: id,
                price: 149
            })
        })
        app.get('/order', (req, res) => {
            const order = req.body
            res.status(201).json({
                ststus: 'created',
                order
            })
        }) 

        const server = app.listen(0, async () => {
            const PORT = server.address().port;
            const base = `http://127.0.0.1:${PORT}`

            try {

                const menures = await fetch(`${base}/menu`);
                const menudata = menures.json()
                //.json() is a method of the Response object returned by the Fetch API.
                //read the response body and convert JSON data into a JavaScript object.
                console.log('Menu Result : ', JSON.stringify(menudata));

            } catch (error) {


            }
        })



    })

    async function main() {

        await block_1_basicServer()


        process.exit(0)
        // ---------------  0	Successful execution
        //        |          1    Error / failure
        //        |
        //immediately terminates the running Node.js process.
        // It stops the event loop, cancels pending operations, and exits the program.

    }
}