import { getUser } from "../service/auth.js";

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.redirect("/login");
    }
    const user = getUser(userUid);

    if (!user) {
        res.clearCookie("uid"); 
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

export default restrictToLoggedInUserOnly;