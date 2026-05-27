import type { ObjectSchema } from "joi";
import joi from "joi"
import BaseDto from "../../../common/DTO/baseDto.js";

export type LoginDtoType = {
    email: string;
    password: string;
};

class LoginDto extends BaseDto {

    static schema: ObjectSchema<LoginDtoType> = joi.object({

        email: joi.string()
            .email()
            .lowercase()
            .required(),

        password: joi.string()
            .required(),

    });

}

export default LoginDto;