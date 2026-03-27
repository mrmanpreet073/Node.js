import {nanoid} from 'nanoid'
import URL from '../models/url.js';

async function generateShortUlr (req, res){

    const body = req.body;
    if(!body) return res.status(400).json({error:"url required"})

    const shortId = nanoid(8);
    
    await URL.create({
        shortId:shortId,
        redirectUrl:body.url,
        visitHistory:[]
    })

    return res.json({id:shortId})

} 

export default generateShortUlr ;