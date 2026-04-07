import { ref } from "process";
import { sendVerificationEmail } from "../../common/config/email.js";
import apiError from "../../common/utils/apiError.js"
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyReferhToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.modals.js"
import crypto from 'crypto'


// token Hashing Function 

const hash = (token) => crypto.createHash("sha256").update(token).digest("hex");


//  Register the User --------------------------------------
const register = async (userData) => {
    const { name, email, password, role } = userData;

    // 1. Check existence
    const exists = await User.findOne({ email });
    if (exists) {
        throw apiError.conflict('Email already exists');
    }

    // 2. Prepare tokens
    const { rawToken, hashedToken } = generateResetToken();

    // 3. Create User
    const user = await User.create({
        name,
        email,
        password, // This will be hashed by your pre-save hook
        role,
        verificationToken: hashedToken
    });

    // 4. Send Email (Try/Catch is good here)
    try {
        await sendVerificationEmail(email, rawToken);
    } catch (err) {
        // Log it, but maybe don't crash the whole request
        console.error("Email failed:", err.message);
        // You could add a flag: user.emailError = true;
    }

    // 5. Clean up the response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    delete userObj.refreshToken; // Good to clear these too

    return userObj;
};

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

    const accessToken = generateAccessToken({ id: user._id, role: user.role })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = hash(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject()
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken }


}

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId,{refreshToken:null})
}

const refreshToken = async (token) => {

    if (!token) {
        throw apiError.unauthorized('Refreshtoken missing ')
    }
    let decoded
    //verify the refreshtoken 
    try {
        // 1. Verify the token (this throws if expired/invalid)
         decoded = verifyReferhToken(token);
        console.log('decoded refresh token payload', decoded);

    } catch (err) {
        throw apiError.unauthorized('Invalid or expired refresh token...');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) throw apiError.unauthorized('user no longer exist')

    // verify if the refresh token match 
    if (user.refreshToken !== hash(token)) throw apiError.unauthorized('"Invalid refresh token — please log in again"')

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role })
    const newRefreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = hash(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return {
        user: userObj,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
}

export { register, verifyEmail, login, refreshToken ,logout}