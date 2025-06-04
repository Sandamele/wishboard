import { createRequire } from 'node:module';
import { jest } from '@jest/globals';
import { formatResponse } from '../../utils/formatResponse.js';

const require = createRequire(import.meta.url);

describe('formatResponse', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
  });
  test('should return a 200 success response with standard message key and data', () => {
    formatResponse(res, 200, 'FETCH_SUCCESS', { id: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      success: true,
      message: 'Fetched successfully', // resolved from key
      data: { id: 1 },
    });
  });

  test('should return a 201 success response with standard message key, data and meta', () => {
    const data = { id: 3 };
    const meta = { total: 5 };

    formatResponse(res, 201, 'CREATE_SUCCESS', data, meta);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      code: 201,
      success: true,
      message: 'Created successfully',
      data,
      meta,
    });
  });

  test('should return a 400 error response with error payload and standard message key', () => {
    const errorPayload = { field: 'email', issue: 'Invalid' };

    formatResponse(res, 400, 'UNAUTHORIZED', errorPayload);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      success: false,
      message: 'Unauthorized',
      error: errorPayload,
    });
  });

  test('should call res.end for no-body status code', () => {
    formatResponse(res, 204, '');

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
