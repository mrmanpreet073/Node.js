

import express from 'express'
import URL from '../models/url.model.js';
import redirectToLoggedInUserOnly from '../middleware/auth.js';


const router = express.Router();
router.get('/',redirectToLoggedInUserOnly,async(req,res) => {
const urls =await URL.find({ createdBy: req.user._id })
    res.render('home',{
        allUrls:urls,
        user: req.user
    })
})
router.get('/login',async(req,res) => {
    res.render('login')
})
router.get('/signup',async(req,res) => {
    res.render('signup')
})
export default router