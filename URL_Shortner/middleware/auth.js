import { getUser } from "../service/auth.js";



function redirectToLoggedInUserOnly(req, res, next) {
    // console.log("Cookies:", req.cookies)
    const userId = req.cookies.uid;
    // console.log("User ID from cookie:", userId)
    if (!userId) {
        return res.redirect('/login')
    } else {

        const user = getUser(userId)
        console.log("User:", user)
        if (!user) {
            return res.redirect('/login')
        }
        req.user = user;
    }
    next()
}


export { redirectToLoggedInUserOnly }