import User from "../models/user.js";


async function handleUserSignup(req,res){
    const {name,email,password} = req.body
    
    await User.create({
        name,
        email,
        password
    })
    return res.redirect('/',)
}
async function handleUserLogin(req, res) {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.render("login", {
            error: "Invalid credentials"
        });
    }
    if (user.password !== password) {
        return res.render("login", {
            error: "Invalid credentials"
        });
    }
    return res.redirect("/");
}

export  {handleUserSignup,handleUserLogin}