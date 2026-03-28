export interface PredictionResult {
  predicted_class: string;
  verdict: string;
  confidence: number;
  all_confidences: Record<string, number>;
  heatmap: string;
  file_url: string;
  is_simulated?: boolean;
}

// We use relative paths so Vercel can proxy the request to Render safely
const API_BASE = ''; 

export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Calling /api/predict via Vercel proxy (configured in vercel.json)
    const response = await fetch(`${API_BASE}/api/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Connection Refused: The AI engine is waking up. Please wait 30 seconds and refresh the page.');
    }
    throw err;
  }
}
