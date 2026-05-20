// service/auth.js
import jwt from 'jsonwebtoken';
const secret = "SUdg87T*W&T*";

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

export { setUser, getUser };




// const userSesion = new Map()

// function setUser(id,user)
// {
//     userSesion.set(id,user)
// }
// function getUser(id)
// {
// return userSesion.get(id)
// }