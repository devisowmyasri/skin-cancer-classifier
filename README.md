# Skin Cancer Classification AI 🩺

An AI-powered diagnostic assistant for skin cancer classification using deep learning. The system analyzes dermoscopic images, classifies them into 7 categories from the HAM10000 dataset, and provides interpretability heatmaps using Grad-CAM.

![Skin Cancer UI](https://via.placeholder.com/800x400?text=Skin+Cancer+AI+Interface)

## Project Overview
- **Backend:** FastAPI (Python)
- **Model:** EfficientNetB3 (TensorFlow/Keras)
- **Explainability:** Grad-CAM (Gradient-weighted Class Activation Mapping)
- **Frontend:** React + TypeScript + Tailwind CSS

## Features
- ⚡ **Real-time Classification:** Instant analysis of dermoscopic images.
- 🌈 **Grad-CAM Heatmaps:** Visualizes which parts of the image the AI is looking at.
- 📊 **Confidence Breakdown:** Shows probability scores across all supported lesion types.
- 🛡️ **Medical Disclaimer:** Integrated safety warnings for users.

## Dataset
This model is designed for the **HAM10000** ("Human Against Machine with 10,000 training images") dataset.
- [Kaggle Dataset Link](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- Classes: `akiec`, `bcc`, `bkl`, `df`, `mel`, `nv`, `vasc`.

## Local Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Place your `model.h5` in `backend/ml/weights/`
4. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment
- **Backend:** Deploy to [Render](https://render.com) using the provided `render.yaml`.
- **Frontend:** Deploy to [Vercel](https://vercel.com). The `vercel.json` config handles API proxying to your Render backend.

---
*Disclaimer: This project is for research purposes and should not be used as a medical diagnostic tool.*
