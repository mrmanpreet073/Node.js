class ApiError extends Error {   // ApiError = upgraded/custom Error class  
                                 // Because APIs need proper HTTP errors.
                                 // Example:401 Unauthorized 404 Not Found 500 Internal Server Error
                                 // Normal Error cannot handle these cleanly.
  statusCode: number;

  constructor( statusCode: number, message: string) {

    super(message);

    this.statusCode = statusCode;

    // Records exact error location
    Error.captureStackTrace(this, this.constructor);
  }

  // =========================================================
  // 400 BAD REQUEST
  // Use:
  // - Invalid input
  // - Validation errors
  // =========================================================
  static badRequest(message: string = "Bad request"): ApiError {

    return new ApiError(400, message);

  }

  // =========================================================
  // 400 MISSING FIELD
  // Use:
  // - Required field missing
  // - Empty required input
  // =========================================================
  static missingField(message: string = "Required field missing"): ApiError {
    return new ApiError(400, message);
  }

  // =========================================================
  // 401 UNAUTHORIZED
  // Use:
  // - Invalid token
  // - Login required
  // =========================================================
  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  // =========================================================
  // 403 FORBIDDEN
  // Use:
  // - Access denied
  // - No permission
  // =========================================================
  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }

  // =========================================================
  // 404 NOT FOUND
  // Use:
  // - Resource not found
  // - Invalid ID
  // =========================================================
  static notFound(message: string = "Not Found"): ApiError {
    return new ApiError(404, message);
  }

  // =========================================================
  // 409 CONFLICT
  // Use:
  // - Duplicate email
  // - Duplicate resource
  // =========================================================
  static conflict( message: string = "Conflict" ): ApiError {
    return new ApiError(409, message);
  }

  // =========================================================
  // 422 UNPROCESSABLE ENTITY
  // Use:
  // - Validation failed
  // - Invalid format
  // =========================================================
  static unprocessable(  message: string = "Unprocessable entity"): ApiError {
    return new ApiError(422, message);
  }

  // =========================================================
  // 500 INTERNAL SERVER ERROR
  // Use:
  // - Database errors
  // - Unexpected server errors
  // =========================================================
  static internal(  message: string = "Internal server error"): ApiError {
    return new ApiError(500, message);
  }
}

export default ApiError;