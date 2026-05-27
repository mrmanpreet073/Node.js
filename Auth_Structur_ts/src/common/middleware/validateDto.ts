import type { Request, Response, NextFunction } from "express";
import apiError from "../utils/apiError.js";

type DTOValidator = {
    validate: (data: unknown) => {
        errors?: string[] | null;
        value: unknown;
    };
};

function validate(dtoClass: DTOValidator) {

    return ( req: Request, res: Response, next: NextFunction): void => {

        try {

            const { errors, value } = dtoClass.validate(req.body);

            if (errors) {
                return next(apiError.badRequest( "Validation Error: " + errors.join(", ") ));
            }

            req.body = value;

            next();

        } catch (err) {

            next(err);

        }
    };
}

export default validate;