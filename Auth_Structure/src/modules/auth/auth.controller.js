import ApiResponse from "../../common/utils/apiResponse.js";
import * as authService from './auth.service.js'


const register = async (req, res) => {
    // console.log('req.body at controller ',req.body);
    const user = await authService.register(req.body);
    ApiResponse.created( res,"Registration successful. Please verify your email.", user );
}

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.params.token);
  ApiResponse.ok(res, "Email verified successfully");
};
export { register,verifyEmail }