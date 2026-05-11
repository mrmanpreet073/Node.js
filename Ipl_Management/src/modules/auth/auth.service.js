import { ref } from "process";
import { sendResetPasswordEmail, sendVerificationEmail } from "../../common/config/email.js";
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
    console.time("DB_Register_Time"); // Start timer
    const user = await User.create({
        name,
        email,
        password, // This will be hashed by your pre-save hook
        role,
        verificationToken: hashedToken
    });
    console.timeEnd("DB_Register_Time"); // End timer and log result
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

// Verify Email
const verifyEmail = async (token) => {
    if (!token) throw apiError.badRequest('Token is required');

    const hashedToken = hash(token.trim());

    // Find user with the hashed token
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
        throw apiError.badRequest('Invalid or Expired Verification Token');
    }
    // Use the user instance we just found to update
    user.isVerified = true;
    user.verificationToken = undefined; // $unset equivalent in save()
    await user.save({ validateBeforeSave: false });
};

// Login Service --------------------------
const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    // console.log('user in login with email', user);

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
    await User.findByIdAndUpdate(userId, { refreshToken: null })
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

// Forgot Password Service --------------------------
const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw apiError.notFound('No account with this email'); // Check casing

    const { rawToken, hashedToken } = generateResetToken();

    // 1. Prepare the data, but don't save yet!
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    try {
        // 2. Try to send the email first
        await sendResetPasswordEmail(email, rawToken);

        // 3. ONLY save to DB if the email sent successfully
        await user.save();

    } catch (error) {
        // 4. Clean up if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // Don't save here, just log it and re-throw so the controller knows
        console.error('Email failed:', error.message);
        throw apiError.internal('Could not send reset email. Please try again later.');
    }
};

// Reset Password service -------------------------------------
const resetPassword = async (token, newPassword) => {
    const hashedToken = hash(token);


    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    // If no user found, the token is either wrong or expired
    if (!user) {
        throw apiError.badRequest('Invalid or expired reset token');
    }

    // Update the password 
    // Note: If you have a 'pre-save' hook to hash passwords, 
    // don't hash it here or it will be double-hashed!
    user.password = newPassword;

    // 4. Clear the reset fields so the token can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
};
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw apiError.NotFound("User not found");
  return user;
};


export { register,getMe, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword }