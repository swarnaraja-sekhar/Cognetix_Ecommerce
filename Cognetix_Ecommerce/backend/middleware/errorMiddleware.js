/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Not Found Middleware
 * Handles 404 errors for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error Handler Middleware
 * Handles all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
  // Set status code (use existing or default to 500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Async Handler Wrapper
 * Wraps async functions to handle errors without try-catch
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
