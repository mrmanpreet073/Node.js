import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/apiResponse.js";



const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.signUp(req.body);

        ApiResponse.created(res, "SignUp Successful", result)

    } catch (error) {
        next(error)
    }
}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token as string //“Trust me — treat this value as a string.”
        //                             ---------
        const result = await authService.verifyEmail(token);

        ApiResponse.ok(res, "Verify Email Successful", result)

    } catch (error) {
        next(error)
    }
}
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        

        ApiResponse.ok(res, "Login Successful", result)

    } catch (error) {
        next(error)
    }
}


export { signUp , verifyEmail,login}