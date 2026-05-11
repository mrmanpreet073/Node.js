class apiError extends Error {

  constructor(statusCode, messagee) {

    super(messagee);

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
  static badRequest(message = "Bad request") {
    return new apiError(400, message);
  }


  // =========================================================
  // 400 MISSING FIELD
  // Use:
  // - Required field missing
  // - Empty required input
  // =========================================================
  static missingField(message = "Required field missing") {
    return new apiError(400, message);
  }


  // =========================================================
  // 401 UNAUTHORIZED
  // Use:
  // - Invalid token
  // - Login required
  // =========================================================
  static unauthorized(message = "Unauthorized") {
    return new apiError(401, message);
  }


  // =========================================================
  // 403 FORBIDDEN
  // Use:
  // - Access denied
  // - No permission
  // =========================================================
  static forbidden(message = "Forbidden") {
    return new apiError(403, message);
  }


  // =========================================================
  // 404 NOT FOUND
  // Use:
  // - Resource not found
  // - Invalid ID
  // =========================================================
  static NotFound(message = "Not Found") {
    return new apiError(404, message);
  }


  // =========================================================
  // 409 CONFLICT
  // Use:
  // - Duplicate email
  // - Duplicate resource
  // =========================================================
  static conflict(message = "Conflict") {
    return new apiError(409, message);
  }


  // =========================================================
  // 422 UNPROCESSABLE ENTITY
  // Use:
  // - Validation failed
  // - Invalid format
  // =========================================================
  static unprocessable(message = "Unprocessable entity") {
    return new apiError(422, message);
  }


  // =========================================================
  // 500 INTERNAL SERVER ERROR
  // Use:
  // - Database errors
  // - Unexpected server errors
  // =========================================================
  static internal(message = "Internal server error") {
    return new apiError(500, message);
  }
}

export default apiError