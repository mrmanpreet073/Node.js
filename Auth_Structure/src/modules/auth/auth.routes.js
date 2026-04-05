import express from 'express'
import registerDto from './dto/register.dto';


const router = express.Router();

router.post('/',validate(registerDto),controller.register)


export default router;