import express from 'express';
import { upload } from '../middleware/upload';
import { analyzeImage } from '../controllers/analyze.controller';

export const router = express.Router();

router.post('/analyze', upload.single('image'), analyzeImage);
