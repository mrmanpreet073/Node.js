import type { ObjectSchema, ValidationErrorItem } from "joi";
import Joi from "joi";

class BaseDto {

    static schema: ObjectSchema = Joi.object({});

    static validate<T>(data: T): { errors: string[] | null; value: T | null; } {

        const { error, value } = this.schema.validate(data, {
            abortEarly: false,   // throw all errors not just the first one
            stripUnknown: true   // remove unknown keys not defined in schema
        });

        if (error) {

            const errors = error.details.map(
                (error: ValidationErrorItem): string => error.message
            );

            return { errors, value: null };
        }

        return { errors: null, value };
    }
}

export default BaseDto;


// Example Joi Error Structure

// {
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