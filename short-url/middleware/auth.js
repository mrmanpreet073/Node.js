
// middleware/auth.js
import { getUser } from "../service/auth.js";

async function restrictToLoggedInUserOnly(req, res, next) {
    // 1. Get the Header
    const authHeader = req.headers["authorization"];

    // 2. Check if it exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // return res.status(401).json({ error: "Unauthorized: Login required" });
       return res.redirect("/login?error=Unauthorized. Please login to access this page."); // ✅ frontend redirects
    }

    // 3. Extract the token (Split "Bearer <token>")
    const token = authHeader.split(" ")[1];
    const user = getUser(token);

    if (!user) {
        // return res.status(401).json({ error: "Invalid or Expired Token" });
        return res.redirect("/login?error=Invalid or expired token. Please login again."); // ✅ frontend redirects
    }

    req.user = user;
    next();
}























// async function restrictToLoggedInUserOnly(req, res, next) {
//     const userUid = req.cookies?.uid;

//     if (!userUid) {
//         return res.redirect("/login");
//     }
//     const user = getUser(userUid);

//     if (!user) {
//         res.clearCookie("uid"); 
//         return res.redirect("/login");
//     }

//     req.user = user;
//     next();
// }

export default restrictToLoggedInUserOnly;