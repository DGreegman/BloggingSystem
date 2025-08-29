class CustomError extends Error {
    status;
    statusCode;
    details;

  constructor(message, statusCode, details='') {
    super(message);
    this.statusCode = statusCode;

    // Set status to false for error conditions (typically 4xx/5xx)
    this.status = statusCode >= 200 && statusCode < 300;
    this.details = details; 
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;


