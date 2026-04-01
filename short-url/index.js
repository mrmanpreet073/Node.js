import express, { urlencoded } from 'express';
import URL from './models/url.model.js';
import connection from './connection.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import urlRoute from './routes/url.route.js';
import staticRoute from './routes/staticroute.route.js';
import userRoute from './routes/user.route.js';
import redirectToLoggedInUserOnly from './middleware/auth.js';



// PARSING
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false }));

const PORT = 5000;

//  Setting Ejs
app.set('view engine','ejs');
app.set('views',path.resolve('./views'))


// CONNECTION
connection('mongodb://127.0.0.1:27017/Surl')
.then(()=> console.log('connection Done'))
.catch((e)=>console.log('Database not connected',e))


// ROUTES
app.use('/url',redirectToLoggedInUserOnly,urlRoute)
app.use('/',staticRoute)
app.use('/user',userRoute)



// Starting Server

app.listen(PORT,() => {
    console.log('server Starts at Port :',PORT);
    
})