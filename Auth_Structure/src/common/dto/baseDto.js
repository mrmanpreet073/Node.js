import joi from 'joi'

class baseDto {

    static schema = joi.object({})

    static validate(data) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            const errors = error.map((error) => {
                return error.message
            })
            return { errors, value: null }
        } else {
            return { errors: null, value }
        }
    }
}

export default baseDto