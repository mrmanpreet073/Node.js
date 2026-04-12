import type { Request,Response } from "express";
import { signinModel } from "./modals.js";


class AuthenticationController {
    public async handleSignUp(req:Request,res:Response){
        const validationResult = signinModel.safeParse(req.body);
        if(validationResult.error) return res.status(400).json({message:"Body validation Failed ",error:validationResult.error.issues});

        

    }
}