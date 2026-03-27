import express from 'express' 
import {generateShortUlr , getAnalasys,updateandredirect} from '../controllers/url.js'; 

const router = express.Router();

router.post('/',generateShortUlr)
router.get('/:shortId',updateandredirect)
router.get('/analysis/:shortId',getAnalasys)


export default router