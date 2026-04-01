
import express from 'express'
import { generateUrl, redirectUrl ,getAnalysis,deleteUrl} from '../controllers/url.controller.js';

const router = express.Router();

router.post('/',generateUrl)
router.get('/:shortId',redirectUrl)
router.get('/analysis/:shortId',getAnalysis)
router.post('/delete/:shortId',deleteUrl)

export default router