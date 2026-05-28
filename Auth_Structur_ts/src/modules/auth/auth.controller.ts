import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/apiResponse.js";
import ApiError from "../../common/utils/apiError.js";



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
        const { user, accessToken, refreshToken } = await authService.login(req.body);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // NOTE SEND ACCESS TOKEN AS BEARER TOKEN 
        ApiResponse.ok(res, "Login SuccessFull", { user, accessToken });

    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.user.id;

        const result = await authService.logout(userId);


        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        ApiResponse.ok(res, "Logout successful", result);

    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.refreshToken;
        if (!token) {
            throw ApiError.badRequest("Refresh token missing");
        }

        const result = await authService.refresh(token);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        ApiResponse.ok(
            res,
            "Token refreshed successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req: Request,res: Response,next: NextFunction) => {

    try {

        const { email } = req.body;

        const result =await authService.forgotPassword(email);

        ApiResponse.ok(
            res,
            "Password reset email sent",
            result
        );

    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const token = req.params.token as string;

        const { password } = req.body;

        const result = await authService.resetPassword(token,password );

        ApiResponse.ok( res, "Password reset successful", result);

    } catch (error) {
        next(error);
    }
};

export { signUp, verifyEmail, login, logout, refreshToken ,forgotPassword,resetPassword}