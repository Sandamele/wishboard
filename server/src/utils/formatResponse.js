/**
 * Sends a standardized JSON API response.
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Short summary of the result
 * @param {*} [payload] - Data for success or error details for failure
 * @param {object} [meta] - Optional metadata (pagination, etc.)
 * @returns {object} Express response
 */
export const formatResponse = (res, statusCode, message, payload = null, meta = undefined) => {
  const NO_BODY_STATUSES = new Set([100, 101, 102, 103, 204, 205, 304]);
  if (NO_BODY_STATUSES.has(statusCode)) return res.status(statusCode).end();
  const isSuccess = statusCode >= 200 && statusCode < 300;

  const responseBody = {
    code: statusCode,
    success: isSuccess,
    message: STANDARD_MESSAGES[message] || (isSuccess ? 'OK' : 'Error'),
  };

  if (isSuccess) {
    if (payload !== null) responseBody.data = payload;
    if (meta !== undefined) responseBody.meta = meta;
  } else {
    responseBody.error = payload || {
      message: STANDARD_MESSAGES.SERVER_ERROR,
    };
  }

  return res.status(statusCode).json(responseBody);
};

// Define standard messages mapped by keys for easy reuse
const STANDARD_MESSAGES = {
  FETCH_SUCCESS: 'Fetched successfully',
  CREATE_SUCCESS: 'Created successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  SERVER_ERROR: 'An unexpected error occurred',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
};