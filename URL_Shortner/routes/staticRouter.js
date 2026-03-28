import express from 'express' 
import URL from '../models/url.js';

const router = express.Router();

router.get('/' ,async  (req,res)=>{

    const urls =await  URL.find({})
    return res.render('home',{
        allUrls:urls
    })
})
router.get('/signup' ,async  (req,res)=>{

    const urls =await  URL.find({})
    return res.render('signup',)
})
export default router