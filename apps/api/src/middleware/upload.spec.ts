import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { upload } from './upload';

const app = express();

app.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({
    success: true,
    filename: req.file?.originalname,
  });
});

describe('Upload middleware', () => {
  it('should accept a valid image file', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('image', Buffer.from([1, 2, 3, 4]), 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.filename).toBe('test.jpg');
  });

  it('should reject non-image files', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('image', Buffer.from('hello world'), 'test.txt');

    expect(res.status).toBe(500);
  });

  it('should reject files bigger than 5MB', async () => {
    const bigFile = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post('/upload')
      .attach('image', bigFile, 'big.jpg');

    expect(res.status).toBe(500);
  });
});
