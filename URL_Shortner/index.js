import express from 'express'
import urlRoute from './routes/url.js';
import connection from './connection.js';
import URL from './models/url.js';
import path from 'path'
import staticRouter from './routes/staticRouter.js';
import userRouter from './routes/user.js';
import cookieparser from 'cookie-parser'
import { redirectToLoggedInUserOnly } from './middleware/auth.js';


const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }))
const PORT = 8000;



// setting up Ejs 
app.set('view engine', 'ejs')  //Set EJS as the template engine
app.set('views', path.resolve('./views'))  //Tell Express where the view files are stored
// path.resolve()->function converts a relative path into an absolute path.

//ROUTES
app.use('/url', urlRoute);
app.use('/', staticRouter);
app.use('/user', userRouter);





// CONNECTION
connection('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log('Error', e))


app.get('/url/:shortId', async (req, res) => {

    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: { timeStamp: Date.now() }
        }
    })

    res.redirect(entry.redirectUrl)
})

app.listen(PORT, () => (
    console.log(`Server Listen at Port number ${PORT}`)

))


