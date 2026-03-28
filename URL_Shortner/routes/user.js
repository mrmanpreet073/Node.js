import express from 'express'
import {handleUserSignup} from '../controllers/user.js';

const router = express.Router();

router.post('/', handleUserSignup)

export default router;