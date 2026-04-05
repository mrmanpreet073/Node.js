import 'dotenv/config'
import connectDb from './src/common/db'
import app from './src/app.js'


const PORT = process.env.PORT || 5000

async function start() {

    await connectDb()

    app.listen(PORT, () => {
        console.log('Server Running on PORT ', PORT);

    })
}

start().catch((error) => {
    console.error('failed to start the server',error);
    process.exit(1)
})


