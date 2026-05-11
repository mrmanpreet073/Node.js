import apiError from "../utils/apiError.js";

function validate(dtoClass) {
    return (req, res, next) => {
        try {
            // 1. Destructure correctly (errors plural)
            const { errors, value } = dtoClass.validate(req.body);

            // 2. If there are validation errors
            if (errors) {
                // Instead of just 'throwing', we pass it to next()
                // This stops the execution of THIS middleware immediately.
                return next(apiError.badRequest("Validation Error: " + errors.join(", ")));
            }

            // 3. If valid, update body and move to controller
            req.body = value;
            next();
        } catch (err) {
            // 4. Catch any unexpected crashes and pass to global handler
            next(err);
        }
    }
}

export default validate