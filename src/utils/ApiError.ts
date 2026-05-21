/**
 * @file Custom ApiError class.
 * @description Extends the built-in Error class to include an HTTP status code
 * and an `isOperational` flag. This helps in distinguishing between operational
 * errors (like 'Not Found') and programming errors.
 */

class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - The HTTP status code for the error.
   * @param {string} message - The error message.
   * @param {boolean} [isOperational=true] - A flag to indicate if this is an operational error.
   * @param {string} [stack=''] - Optional stack trace.
   */
  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      // Capture the stack trace, excluding the constructor call from it.
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;