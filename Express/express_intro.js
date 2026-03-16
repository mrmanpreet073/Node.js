const express = require('express');


function block_1_basicServer() {

    // Backend
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
            const { query, limit } = req.query
            res.json({
                query,
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
        app.post('/order', (req, res) => {
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
                // frontend

                const menures = await fetch(`${base}/menu`);
                const menudata = await menures.json() // read the request body 
                //.json() is a method of the Response object returned by the Fetch API.
                //read the response body and convert JSON data into a JavaScript object.

                console.log('GET / Menu Result : ', JSON.stringify(menudata));

                console.log("++++++++++++++++++++++++++++++++++++++++++")


                const searchres = await fetch(`${base}/search?query=biryani&limit=5`);
                const searchData = await searchres.json()
                //why use await here ----- ---------------- 
                //                       searchres.json()  returns a Promise, not the actual data.
                //                                            the browser must:
                //                                            Read the body stream
                //                                            Convert stream → text
                //                                            Run JSON.parse()
                //                                            Return the result
                //                                            Because reading the stream takes time, it is asynchronous.
                //                                            So .json() returns a Promise. that's why using await 
                //     
                console.log('GET / Search Result : ', JSON.stringify(searchData));

                console.log("++++++++++++++++++++++++++++++++++++++++++")

                const menuItemRes = await fetch(`${base}/menu/42`);
                const menuItemData = await menuItemRes.json();

                console.log('Get / Order Result : ', JSON.stringify(menuItemData));
                console.log("++++++++++++++++++++++++++++++++++++++++++")

                const orderres = await fetch(`${base}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        item: 'biryani',
                        qty: 2
                    })
                });
                const orderData = await orderres.json()

                console.log('POST / Order Result : ', JSON.stringify(orderData));



            } catch (error) {

                console.log('error:', error);

            }
            server.close(() => {
                console.log('Block 1 served ');
                resolev()
            })
        })



    })
}

async function main() {

    await block_1_basicServer()


    process.exit(0)
    // ---------------  0	Successful execution
    //        |          1    Error / failure
    //        |
    //immediately terminates the running Node.js process.
    // It stops the event loop, cancels pending operations, and exits the program.

}
main()