import express from 'express';
import cookieparser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes.js';
import apiError from './common/utils/apiError.js';
import ownerRouter from './modules/IPL/routes/owner.routes.js';
import PlayerRouter from './modules/IPL/routes/player.routes.js';
import teamRouter from './modules/IPL/routes/team.route.js';
import tsRouter from './modules/IPL/routes/teamSponser.routes.js';
import playerStatsRouter from './modules/IPL/routes/playerStats.routes.js';


const app = express();
app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({extended:true}))


app.use('/api/auth',authRouter) 
app.use('/api/owner',ownerRouter) 
app.use('/api/player',PlayerRouter) 
app.use('/api/team',teamRouter) 
app.use('/api/teamSponser',tsRouter) 
app.use('/api/playerStats',playerStatsRouter) 



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
