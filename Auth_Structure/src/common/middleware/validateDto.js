

function validate(dtoClass) {

    return (req, res, next) => {

        const { error, value } = dtoClass.validate(req.body)

        if (error) {
            throw apiError.badRequest();
        }

        req.body = value;
        next()
    }
}

export default validate