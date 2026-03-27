import express from 'express'
import router from './routes/url.js';
import connection from './connection.js';
import URL from './models/url.js';


const app = express();
app.use(express.json());
const PORT = 8000;


connection('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log('Error', e))


app.use('/url', router)

app.get('/:shortId', async (req, res) => {

    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: { timestamps: Date.now() }
        }
    })

    res.redirect(entry.redirectUrl)
})

app.listen(PORT, () => (
    console.log(`Server Listen at Port number ${PORT}`)

))


