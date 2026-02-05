import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) return cb(null, true);

    cb(
      new Error(
        'Error: File upload only supports the following filetypes - ' +
          filetypes
      )
    );
  },
});

app.post('/api/analyze', (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res
          .status(400)
          .json({ error: 'File too large. Max size is 5MB.' });

      return res.status(400).json({ error: err.message });
    }

    if (!req.file)
      return res.status(400).json({ error: 'No image file provided' });

    try {
      console.log(
        `Received image: ${req.file.originalname} (${req.file.size} bytes)`
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockedDescriptions = [
        'A stunning landscape with rolling hills and a clear blue sky.',
        'A close-up of a modern technology device with sleek lines.',
        'An artistic photograph featuring vibrant colors and abstract shapes.',
        'A professional portrait of a person in a minimalist setting.',
        'A macro shot of a delicate flower with dew drops.',
      ];

      const randomDescription =
        mockedDescriptions[
          Math.floor(Math.random() * mockedDescriptions.length)
        ];

      res.json({
        description: randomDescription,
        metadata: {
          filename: req.file.originalname,
          size: req.file.size,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      res
        .status(500)
        .json({ error: 'Internal server error during image analysis' });
    }
  });
});

app.listen(port, () => {
  console.log(
    `Mocked Image Analysis server running at http://localhost:${port}`
  );
});
