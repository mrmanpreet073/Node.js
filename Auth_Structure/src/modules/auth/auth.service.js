import { ref } from "process";
import { sendVerificationEmail } from "../../common/config/email.js";
import apiError from "../../common/utils/apiError.js"
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.modals.js"
import crypto from 'crypto'


// token Hashing Function 

const hash = (token) => crypto.createHash("sha256").update(token).digest("hex");


//  Register the User --------------------------------------
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

    try {
        await sendVerificationEmail(email, rawToken);
    } catch (err) {
        console.error("Failed to send verification email:", err.message);
    }

    const userObj = user.toObject();
    delete userObj.password
    delete userObj.verificationToken

    return userObj

}

// verify email token and set isVerified to true-------------------------------

const verifyEmail = async (token) => {
    const trimmedToken = token.trim();
    const hashedToken = hash(trimmedToken);

    if (!trimmedToken) {
        throw apiError.badRequest('Invalid or Expired Varification Token ')
    }

    const user = await User.findOne({ verificationToken: hashedToken }).select('+verificationToken')
    if (!user) {
        const user = await User.findOne({ verificationToken: trimmedToken }).select('+verificationToken')
        if (!user) {
            throw apiError.badRequest('Invalid or Expired Varification Token ')
        }
    }

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 },
    })
}

// Login Service --------------------------
const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    console.log('user in login with email', user);

    if (!user) throw apiError.unauthorized("Invalid Email or Password")

    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw apiError.unauthorized("invalid Email or Password ")

    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = hash(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject()
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken }


}

export { register, verifyEmail,login }