import joi from 'joi'

class baseDto {

    static schema = joi.object({})

    static validate(data) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            const errors = error.details.map((error) => {
                return error.message
            })
            return { errors, value: null }
        } else {
            return { errors: null, value }
        }
    }
}

export default baseDto


//             {
//   error: {
//     details: [
//       {
//         message: '"email" must be a valid email',
//         path: ['email'],
//         type: 'string.email'
//       },
//       {
//         message: '"password" length must be at least 6 characters long',
//         path: ['password'],
//         type: 'string.min'
//       }
//     ]
//   }
// }