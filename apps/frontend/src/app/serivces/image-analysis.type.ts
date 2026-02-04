export interface ImageAnalysisResponse {
  description: string;
  metadata: {
    filename: string;
    size: number;
    timestamp: string;
  };
}
