import User from "./auth.modals"



const register=async ({name,email,password,role})=>{
    const exists  = User.findOne({email})
    if (exists) 

}