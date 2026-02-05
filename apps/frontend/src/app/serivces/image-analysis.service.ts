import { signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import type { ImageAnalysisResponse } from './image-analysis.type';

export class ImageAnalysisService {
  private readonly apiUrl = 'http://localhost:3000/api/analyze';

  readonly selectedFile = signal<File | null>(null);

  readonly analysisResource = httpResource<ImageAnalysisResponse>(() => {
    const file = this.selectedFile();
    if (!file) {
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
