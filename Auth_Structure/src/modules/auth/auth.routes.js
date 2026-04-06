import express from 'express'
import registerDto from './dto/register.dto.js';
import * as  controller from './auth.controller.js'
import validate from '../../common/middleware/validateDto.js';


const router = express.Router();

router.post('/',validate(registerDto),controller.register);
router.get("/verify-email/:token", controller.verifyEmail);
router.get("/login", controller.login);



export default router;