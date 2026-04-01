import User from "../models/user.model.js"
import { v4 as uuidv4 } from 'uuid';
import { setUser } from "../service/auth.js";



async function handleSignup(req, res) {
    const { username, email, password } = req.body;

    try {
        const accountExist = await User.findOne({ username, email });
        if (accountExist) {
            return res.status(400).json({ error: "Account already exists with these details" });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            return res.status(400).json({ error: "Name already exists" });
        }

        await User.create({
            username,
            email,
            password,
        });

        return res.status(201).json({ message: "User Created Successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = setUser(user);
    // console.log('Token->',token);
    
    res.cookie('uid',token);

    return res.status(200).json({ success: true, redirect: '/' });
}
export { handleSignup, handleLogin }