export interface PredictionResult {
  predicted_class: string;
  verdict: string;
  confidence: number;
  all_confidences: Record<string, number>;
  heatmap: string;
  file_url: string;
  is_simulated?: boolean;
}

const API_BASE = 'https://skin-cancer-classifier-7uzh.onrender.com';

export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/api/predict`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Connection Refused: The AI engine is currently waking up. Please wait 30 seconds and try again.');
    }
    throw err;
  }
}
