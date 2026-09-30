/**
 * Service for communicating with the PlantGuard ML Prediction backend.
 * Provides real-time EfficientNetB0 inference integration.
 */

const API_BASE = '/api';

/**
 * Send image file or blob to the backend for real ML model disease classification.
 * @param {File|Blob} imageFile - The plant image
 * @param {string} [filename='leaf.jpg'] - Optional filename
 * @returns {Promise<{
 *   success: boolean,
 *   prediction: {
 *     className: string,
 *     formattedName: string,
 *     crop: string,
 *     condition: string,
 *     severity: string,
 *     isHealthy: boolean,
 *     confidence: number,
 *     confidencePercentage: number
 *   },
 *   topPredictions: Array<{
 *     className: string,
 *     formattedName: string,
 *     crop: string,
 *     condition: string,
 *     confidence: number,
 *     confidencePercentage: number,
 *     isHealthy: boolean
 *   }>,
 *   threshold: number,
 *   isConfident: boolean
 * }>}
 */
export async function predictPlantDisease(imageFile, filename = 'leaf.jpg') {
  if (!imageFile) {
    throw new Error('Please select or capture a plant image first.');
  }

  const formData = new FormData();
  formData.append('image', imageFile, filename);

  try {
    const response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || data?.detail || 'Something went wrong while analyzing your image. Please try again.';
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }

    if (!data || !data.prediction) {
      throw new Error('Invalid response structure received from inference service.');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netErr = new Error(
        'Unable to connect to PlantGuard backend. Please verify server and ML service are running.'
      );
      netErr.code = 'NETWORK_ERROR';
      throw netErr;
    }
    throw error;
  }
}

/**
 * Query backend health status
 */
export async function checkModelHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'offline', modelLoaded: false };
    return await res.json();
  } catch {
    return { status: 'offline', modelLoaded: false };
  }
}

/**
 * Query backend model information
 */
export async function getModelInfo() {
  try {
    const res = await fetch(`${API_BASE}/model-info`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
