import joi from 'joi';
import baseDto from '../../../common/dto/baseDto.js';

class loginDto extends baseDto{
    static schema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
  });
}

export default loginDto