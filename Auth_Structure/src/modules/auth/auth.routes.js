import express from 'express'
import registerDto from './dto/register.dto.js';
import * as  controller from './auth.controller.js'
import validate from '../../common/middleware/validateDto.js';
import loginDto from './dto/login.dto.js';
import { authenticate } from './auth.middleware.js';
import resetPasswordDto from './dto/resetPassword.dto.js';
import forgotPasswordDto from './dto/forgotPassword.dto.js';


const router = express.Router();

router.post('/',validate(registerDto),controller.register);
router.get("/verify-email/:token", controller.verifyEmail);
router.post("/forgot-password",validate(forgotPasswordDto), controller.forgotPassword);
router.put("/reset-password/:token",validate(resetPasswordDto), controller.resetPassword);
router.post("/login",validate(loginDto),controller.login);
router.post("/logout",authenticate,controller.logout);
router.post("/refresh",controller.refresh);
router.get("/me", authenticate, controller.getMe);


export default router;