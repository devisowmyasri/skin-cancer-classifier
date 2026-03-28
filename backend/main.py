from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import shutil
import os
import uuid
import base64
import numpy as np
import cv2
from backend.ml.preprocess import preprocess_image
from backend.ml.model_utils import build_model, get_gradcam_heatmap, apply_heatmap, CLASSES

app = FastAPI(title="Skin Cancer Classification API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skin-cancer-classifier-ycxk.vercel.app",
        "https://skin-cancer-classifier-7uzh.onrender.com",
        "http://localhost:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute paths for Render stability
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files correctly
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Load model (placeholder weights or re-init)
MODEL_PATH = os.path.join(BASE_DIR, "ml", "weights", "model.h5")
model = build_model()
if os.path.exists(MODEL_PATH):
    model.load_weights(MODEL_PATH)
    print(f"Loaded weights from {MODEL_PATH}")
else:
    print("Warning: Model weights not found. Prediction results will be random.")

@app.get("/")
async def root():
    return {
        "status": "operational",
        "service": "Obsidian skin-cancer-classifier API",
        "version": "4.0.1",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "weights_loaded": os.path.exists(MODEL_PATH)}

@app.post("/api/predict")
async def predict_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    file_extension = os.path.splitext(file.filename)[1]
    file_id = str(uuid.uuid4())
    temp_filename = f"{file_id}{file_extension}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Preprocess (Required for both Simulation/Heatmap and Live AI)
        img_array = preprocess_image(temp_path)
        
        # CHECK FOR LOADED WEIGHTS OR FALLBACK TO SIMULATION
        is_simulated = not os.path.exists(MODEL_PATH)
        
        if is_simulated:
            # SIMULATION MODE: Realistic but randomized for testing
            # Randomly pick a top class
            class_idx = np.random.randint(0, len(CLASSES))
            predicted_class = CLASSES[class_idx]
            
            # Generate a realistic 'Winner' confidence (75% - 98%)
            confidence = np.random.uniform(0.75, 0.98)
            
            # Generate other confidences to sum to 1.0
            remaining = 1.0 - confidence
            other_vals = np.random.dirichlet(np.ones(len(CLASSES)-1)) * remaining
            confidences = {}
            other_idx = 0
            for i, cls in enumerate(CLASSES):
                if i == class_idx:
                    confidences[cls] = float(confidence)
                else:
                    confidences[cls] = float(other_vals[other_idx])
                    other_idx += 1
        else:
            # LIVE AI PREDICTION
            preds = model.predict(img_array)
            class_idx = np.argmax(preds[0])
            predicted_class = CLASSES[class_idx]
            confidence = float(preds[0][class_idx])
            confidences = {CLASSES[i]: float(preds[0][i]) for i in range(len(CLASSES))}

        # Grad-CAM Heatmap (Still works even with random weights for visualization)
        heatmap = get_gradcam_heatmap(model, img_array)
        superimposed_img = apply_heatmap(temp_path, heatmap)
        
        # Convert superimposed image to base64
        _, buffer = cv2.imencode(".png", superimposed_img)
        heatmap_base64 = base64.b64encode(buffer).decode("utf-8")

        # Determine benign/malignant
        malignant_classes = ['mel', 'bcc', 'akiec']
        verdict = "Malignant" if predicted_class in malignant_classes else "Benign"

        return {
            "predicted_class": predicted_class,
            "verdict": verdict,
            "confidence": confidence,
            "all_confidences": confidences,
            "heatmap": f"data:image/png;base64,{heatmap_base64}",
            "file_url": f"/static/uploads/{temp_filename}",
            "is_simulated": is_simulated
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Optional: cleanup or keep for session
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
