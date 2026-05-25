import type { ObjectSchema } from "joi";
import joi from "joi"
import BaseDto from "../../../common/DTO/baseDto.js";

type ResetPasswordDtoType = {
    password: string;
};


class ResetPasswordDto extends BaseDto {

    static schema: ObjectSchema<ResetPasswordDtoType> = joi.object({

        password: joi.string()
            .min(8)
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .message(
                "Password must contain at least one uppercase letter and one digit",
            )
            .required(),

    });

}

export default ResetPasswordDto;