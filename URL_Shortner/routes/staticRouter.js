import express from 'express' 
import URL from '../models/url.js';

const router = express.Router();

router.get('/' ,async  (req,res)=>{

    const urls =await  URL.find({})
    return res.render('home',{
        allUrls:urls
    })
})
export default router