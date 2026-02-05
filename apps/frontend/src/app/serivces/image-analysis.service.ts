import { signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import type { ImageAnalysisResponse } from './image-analysis.type';

export class ImageAnalysisService {
  private readonly apiUrl = 'http://localhost:3000/api/analyze';
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  readonly selectedFile = signal<File | null>(null);

  readonly analysisResource = httpResource<ImageAnalysisResponse>(() => {
    const file = this.selectedFile();
    if (!file) return undefined;

    if (file.size > this.MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      alert('File is too large! Maximum size is 5 MB.');
      return undefined;
    }

    const formData = new FormData();
    formData.append('image', file);

    return {
      url: this.apiUrl,
      method: 'POST',
      body: formData,
    };
  });

  analyzeImage(file: File) {
    this.selectedFile.set(file);
  }
}
