import express from 'express'
import { handleLogin, handleSignup } from '../controllers/user.controller.js';

const router = express();

router.post('/signup',handleSignup)
router.post('/login',handleLogin)
router.get("/logout", (req, res) => {
    res.clearCookie("uid"); 
    return res.redirect("/login");
});

export default router