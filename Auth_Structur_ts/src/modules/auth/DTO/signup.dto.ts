import type { ObjectSchema } from "joi";
import joi from "joi"
import BaseDto from "../../../common/DTO/baseDto.js";

type signUpDtoType = {
    name: string;
    email: string;
    password: string;
    role: string;
};

class signUpDto extends BaseDto {
    static schema: ObjectSchema<signUpDtoType> = joi.object({
        name: joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),

        email: joi.string()
            .email()
            .lowercase()
            .required(),

        password: joi.string()
            .min(8)
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .message( "Password must contain at least one uppercase letter and one digit",)
            .required(),

        role: joi.string()
            .valid("customer", "seller")
            .default("customer"),
    })
}
export default signUpDto