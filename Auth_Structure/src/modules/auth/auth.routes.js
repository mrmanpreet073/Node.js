import express from 'express'
import registerDto from './dto/register.dto.js';
import * as  controller from './auth.controller.js'
import validate from '../../common/middleware/validateDto.js';
import loginDto from './dto/login.dto.js';
import { authenticate } from './auth.middleware.js';


const router = express.Router();

router.post('/',validate(registerDto),controller.register);
router.get("/verify-email/:token", controller.verifyEmail);
router.post("/login",validate(loginDto),controller.login);
router.post("/logout",authenticate,controller.logout);
router.post("/refresh",controller.refresh);



export default router;