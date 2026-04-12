import  express  from "express";
import AuthenticationController from "./controller.js";
const authenticationController = new AuthenticationController()

const authRouter = express.Router();

authRouter.post('/signup',authenticationController.handleSignUp.bind(authenticationController))




export default authRouter