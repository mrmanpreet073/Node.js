import apiError from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.modals.js";


const authenticate = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(apiError.unauthorized('Authentication token missing'));
    }

    const decoded = verifyAccessToken(token); 
    if (!decoded) {
      return next(apiError.unauthorized('Invalid Token Try Login Again'));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(apiError.unauthorized('User No Longer Exists'));
    }

    //  Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};

// Higher-order function — returns middleware configured with allowed roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {  // here we compare the role passed in route with the user role
      throw apiError.forbidden(
        "You do not have permission to perform this action",
      );
    }
    next();
  };
};

export {authenticate,authorize}