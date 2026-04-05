class apiError extends Error {

    constructor(statusCode, messagee) {
        super(messagee);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);  //This records where the error happened in the code.
    }
     static badRequest(message = "Bad request") {
    return new apiError(400, message);
  }

}

