import { describe, it, expect, vi } from 'vitest';
import { analyzeImage } from './analyze.controller';
import { Request, Response } from 'express';

function mockResponse() {
  const response: Partial<Response> = {};

  response.status = vi.fn().mockReturnThis();
  response.json = vi.fn().mockReturnThis();

  return response as Response;
}

describe('analyzeImage controller', () => {
  it('returns 400 if no file', async () => {
    const request = {
      file: undefined,
    } as Request;

    const response = mockResponse();

    await analyzeImage(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'No image provided',
    });
  });

  it('returns analysis when file exists', async () => {
    const request = {
      file: {
        originalname: 'test.jpg',
        size: 1234,
      },
    } as Request;

    const response = mockResponse();

    await analyzeImage(request, response);

    expect(response.json).toHaveBeenCalled();
  });
});
