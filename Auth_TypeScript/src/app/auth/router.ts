import  express  from "express";
import AuthenticationController from "./controller.js";
import { restrictAuthenticationMiddleware } from "../middleware/auth.middleware.js";
const authenticationController = new AuthenticationController()

const authRouter = express.Router();

authRouter.post('/signup',authenticationController.handleSignUp)
authRouter.post('/signin',authenticationController.handleSignIn)
authRouter.post('/refresh',authenticationController.handleRefresh)
authRouter.post('/me',restrictAuthenticationMiddleware(),authenticationController.handleMe)




export default authRouter