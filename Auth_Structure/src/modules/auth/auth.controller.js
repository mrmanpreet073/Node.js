import apiError from "../../common/utils/apiError.js";
import ApiResponse from "../../common/utils/apiResponse.js";
import * as authService from './auth.service.js';

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "Registration successful. Please verify your email.", user);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    ApiResponse.ok(res, "Login SuccessFull", { user, accessToken });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const oldToken = req.cookies?.refreshToken;
    const { user, accessToken, refreshToken } = await authService.refreshToken(oldToken);

    // Refresh token rotation: naya token cookie mein set karein
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    ApiResponse.ok(res, 'token Refresh Successfully', { accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    ApiResponse.ok(res, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, "Password reset Email Sent");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const rawToken = req.params.token;
    await authService.resetPassword(rawToken, req.body.password);
    ApiResponse.ok(res, 'password reset Successfull');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res, "User profile", user);
  } catch (error) {
    next(error);
  }
};

export { register, getMe, verifyEmail, login, refresh, logout, forgotPassword, resetPassword };