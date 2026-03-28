import express from 'express'
import urlRoute from './routes/url.js';
import connection from './connection.js';
import URL from './models/url.js';
import path from 'path'
import staticRouter from './routes/staticRouter.js';
import userRouter from './routes/user.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const PORT = 8000;


//ROUTES
app.use('/url', urlRoute);
app.use('/',staticRouter);
app.use('/user',userRouter);


// setting up Ejs 
app.set('view engine','ejs')  // This tells Express: “When I render pages, use the EJS template engine.”
// So when you write: res.render("home")
// Express automatically looks for: home.ejs
app.set('views',path.resolve('./views'))  //This tells Express:  “My template files are inside the views folder.”



// CONNECTION
connection('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log('Error', e))


app.get('url/:shortId', async (req, res) => {

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


