export interface PredictionResult {
  predicted_class: string;
  verdict: string;
  confidence: number;
  all_confidences: Record<string, number>;
  heatmap: string;
  file_url: string;
  is_simulated?: boolean;
}

const API_BASE = 'http://localhost:8000'; // Default for local dev

export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Prediction failed');
  }

  return response.json();
}
