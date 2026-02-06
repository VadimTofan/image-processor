import { Request, Response } from 'express';

export async function analyzeImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
      });
    }

    console.log(`Received: ${req.file.originalname}`);

    await new Promise((r) => setTimeout(r, 2000));

    const descriptions = [
      'A stunning landscape...',
      'A modern tech device...',
      'Abstract artwork...',
      'Minimalist portrait...',
      'Macro flower shot...',
    ];

    const random =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    res.json({
      description: random,
      metadata: {
        filename: req.file.originalname,
        size: req.file.size,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Analysis failed',
    });
  }
}
