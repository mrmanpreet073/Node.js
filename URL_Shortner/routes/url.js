import express from 'express' 
import {generateShortUlr , getAnalasys} from '../controllers/url.js'; 

const router = express.Router();

router.post('/',generateShortUlr)
router.get('/analysis/:shortId',getAnalasys)


export default router