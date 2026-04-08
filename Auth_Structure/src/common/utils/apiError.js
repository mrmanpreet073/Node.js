class apiError extends Error {

  constructor(statusCode, messagee) {
    super(messagee);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);  //This records where the error happened in the code.
  }
  static badRequest(message = "Bad request") {
    return new apiError(400, message);
  }
  static unauthorized(message = "Unauthorized") {
    return new apiError(401, message);
  }
  static conflict(message = "Conflict") {
    return new apiError(409, message);
  }
  static NotFound(message = "Not Found") {
    return new apiError(404, message);
  }
  static internal(message = "Internal server error") {
    return new apiError(500, message);
  }
}

export default apiError
