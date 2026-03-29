import express from 'express' 
import URL from '../models/url.js';
import { redirectToLoggedInUserOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/',redirectToLoggedInUserOnly, async  (req,res)=>{

    const urls = await URL.find({ createdBy: req.user._id });
    return res.render('home',{
        allUrls:urls
    })
})
router.get('/signup' ,async  (req,res)=>{

    const urls =await  URL.find({})
    return res.render('signup',)
})
router.get('/login' ,async  (req,res)=>{

    const urls =await  URL.find({})
    return res.render('login',)
})
export default router