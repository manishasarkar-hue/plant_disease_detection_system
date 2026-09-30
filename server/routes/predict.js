import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure Multer for in-memory temporary storage with validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype.toLowerCase()) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a valid image (JPG, PNG, or WEBP).'));
    }
  },
});

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * POST /api/predict
 * Receives multipart/form-data with field 'image', forwards to Python ML service.
 */
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'Image file too large. Maximum supported size is 25MB.',
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image provided. Please upload an image in the "image" field.',
      });
    }

    // Forward image to Python ML Service
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', blob, req.file.originalname || 'leaf.jpg');

    let mlResponse;
    try {
      mlResponse = await fetch(`${ML_SERVICE_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });
    } catch (netErr) {
      console.error('[Predict Proxy] Failed to reach Python ML Service:', netErr.message);
      return res.status(503).json({
        success: false,
        error: 'PlantGuard ML Inference Service is temporarily unavailable. Please ensure the Python ML service is running.',
      });
    }

    const data = await mlResponse.json().catch(() => null);

    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json({
        success: false,
        error: data?.detail || 'Inference service encountered an error processing the image.',
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[Predict Route Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while analyzing your image. Please try again.',
    });
  }
});

/**
 * GET /api/predict/health or /api/health
 */
router.get('/health', async (req, res) => {
  try {
    const mlHealth = await fetch(`${ML_SERVICE_URL}/api/health`, { method: 'GET' });
    if (mlHealth.ok) {
      const data = await mlHealth.json();
      return res.json(data);
    }
    return res.status(503).json({ status: 'degraded', modelLoaded: false });
  } catch {
    return res.status(503).json({
      status: 'offline',
      modelLoaded: false,
      message: 'ML Service unreachable on ' + ML_SERVICE_URL,
    });
  }
});

/**
 * GET /api/predict/model-info or /api/model-info
 */
router.get('/model-info', async (req, res) => {
  try {
    const infoRes = await fetch(`${ML_SERVICE_URL}/api/model-info`, { method: 'GET' });
    if (infoRes.ok) {
      const data = await infoRes.json();
      return res.json(data);
    }
    return res.status(503).json({ error: 'ML Service unavailable' });
  } catch {
    return res.status(503).json({ error: 'ML Service unreachable on ' + ML_SERVICE_URL });
  }
});

export default router;
