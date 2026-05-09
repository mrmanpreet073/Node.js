import express from 'express';
import cookieparser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes.js';
import apiError from './common/utils/apiError.js';



const app = express();
app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({extended:true}))


app.use('/api/auth',authRouter) 



app.use((req, res, next) => {
    next(apiError.NotFound(`Route ${req.originalUrl} not found`));
});
// -----  -> all() means the route will match all HTTP methods:   So this handler works for any request type.
// app.all("{*path}", (req, res) => {
// //      --------  -> This is a wildcard route pattern.It matches any path that was not matched by earlier routes. 
//   throw apiError.NotFound(`Route ${req.originalUrl} not found`);
//   //                              -----------------  -> Contains the exact URL requested by the client.
// });
// Why this code is used
// It ensures that invalid routes return a proper 404 error instead of hanging or returning unexpected responses.

export default app;
