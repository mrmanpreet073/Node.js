import ApiResponse from "../../common/utils/apiResponse";


const register =async (req,res) => {
    const user = await authservice.register(req.body);
    ApiResponse.created(res,"user created", user)
}