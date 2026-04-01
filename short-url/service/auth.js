import jwt from 'jsonwebtoken'
const secret = "SUdg87T*W&T*"

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
        },
        secret,
        { expiresIn: "24h" } // Good practice: tokens should eventually expire
    );
}
function getUser(token) {

    if (!token) return null;
    // console.log('jwt verify:', jwt.verify(token, secret));

    return jwt.verify(token, secret)
}

export { setUser, getUser }





// const userSesion = new Map()

// function setUser(id,user)
// {
//     userSesion.set(id,user)
// }
// function getUser(id)
// {
// return userSesion.get(id)
// }