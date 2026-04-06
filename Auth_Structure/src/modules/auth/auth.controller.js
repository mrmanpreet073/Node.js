import ApiResponse from "../../common/utils/apiResponse.js";
import * as authservice from './auth.service.js'


const register = async (req, res) => {
    console.log('req.body at controller ',req.body);
    
    const user = await authservice.register(req.body);
    ApiResponse.created( res,"Registration successful. Please verify your email.", user );
}

export { register }