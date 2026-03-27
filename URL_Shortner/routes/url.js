import express from 'express' 
import generateShortUlr from '../controllers/url.js'; 

const router = express.Router();

router.post('/',generateShortUlr)


export default router