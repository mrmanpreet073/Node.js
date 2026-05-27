import { Router, type Request, type Response } from "express";
import validate from "../../common/middleware/validateDto.js";
import LoginDto from "./DTO/login.dto.js";
import * as authConroller from "./auth.controller.js"
import signUpDto from "./DTO/signup.dto.js";

const router = Router();

router.post("/signup", validate(signUpDto), authConroller.signUp)
router.get("/verify-email/:token", authConroller.verifyEmail) // use GET for email verification 
router.post("/login",validate(LoginDto),authConroller.login)
export default router;