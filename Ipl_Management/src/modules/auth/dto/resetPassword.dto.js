import Joi from 'joi'
import baseDto from "../../../common/dto/baseDto.js";


class resetPasswordDto extends baseDto {
    static schema = Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[A-Z])(?=.*\d)/)
      .message(
        "Password must contain at least one uppercase letter and one digit",
      )
      .required(),
  });
}
export default resetPasswordDto