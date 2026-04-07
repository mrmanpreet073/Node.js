import apiError from "../../common/utils/apiError.js";
import ApiResponse from "../../common/utils/apiResponse.js";
import * as authService from './auth.service.js'


const register = async (req, res) => {
  // console.log('req.body at controller ',req.body);
  const user = await authService.register(req.body);
  ApiResponse.created(res, "Registration successful. Please verify your email.", user);
}

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.params.token);
  ApiResponse.ok(res, "Email verified successfully");
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body)

  // Refresh token goes in httpOnly cookie — not accessible to JS
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  // Enable secure cookie only in production (HTTPS). 
    // In development it stays false so cookies work on localhost (HTTP).
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  ApiResponse.ok(res, "Login SuccessFull", { user, accessToken })
}

const refresh = async (req, res) => {

  const oldToken = req.cookies?.refreshToken;
  const { user, accessToken, refreshToken } = await authService.refreshToken(oldToken)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",// Enable secure cookie only in production (HTTPS). 
    // In development it stays false so cookies work on localhost (HTTP).
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  ApiResponse.ok(res, 'token Refresh Successfully', { accessToken })

}

export { register, verifyEmail, login, refresh }