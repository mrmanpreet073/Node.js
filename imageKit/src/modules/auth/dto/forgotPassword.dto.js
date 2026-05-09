import joi from 'joi'
import baseDto from '../../../common/dto/baseDto.js';


class forgotPasswordDto extends baseDto {
    static schema = joi.object({
        email: joi.string().email().lowercase().required(),
    })
}

export default forgotPasswordDto