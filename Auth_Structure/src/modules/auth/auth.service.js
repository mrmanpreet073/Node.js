import apiError from "../../common/utils/apiError.js"
import { generateResetToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.modals.js"



const register = async ({ name, email, password, role }) => {
    const exists = await User.findOne({ email })
    if (exists) {
        throw apiError.conflict('email already exists');
    }
    const { rawToken, hashedToken } = generateResetToken()
    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })
    // send mail here 

    const userObj = user.toObject();
    delete userObj.password
    delete userObj.verificationToken

    return userObj


}

export { register }