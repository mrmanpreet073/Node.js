import type { ObjectSchema } from "joi";
import BaseDto from "../../../common/DTO/baseDto.js";
import joi from "joi"

type ForgotPasswordDtoType = {
    email: string;
};


class ForgotPasswordDto extends BaseDto {

    static schema: ObjectSchema<ForgotPasswordDtoType> = joi.object({

        email: joi.string()
            .email()
            .lowercase()
            .required(),

    });

}

export default ForgotPasswordDto;