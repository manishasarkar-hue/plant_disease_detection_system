# 🌱 PlantGuard AI - Intelligent Plant Disease Detection & Farmer Advisory System

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.109%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TensorFlow-2.15%2B-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
  <img src="https://img.shields.io/badge/Google_Gemini-API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 📖 Overview

**PlantGuard AI** is an enterprise-grade, full-stack agricultural intelligence platform designed to assist farmers, agronomists, and researchers in early plant disease diagnosis, treatment planning, and yield protection.

By unifying **deep learning computer vision (CNN / Transfer Learning)** with **Explainable AI (Grad-CAM)** and **RAG-powered conversational LLMs (Google Gemini)**, PlantGuard AI delivers instant disease classification, actionable remedy recommendations, localized weather insights, and comprehensive crop health analytics.

---

## ✨ Key Features

- 🔬 **Instant Disease Detection**: High-accuracy multi-class classification across 38+ plant disease and healthy crop categories using TensorFlow / Keras deep neural networks.
- 🎯 **Explainable AI (Grad-CAM)**: Visual heatmap generation highlighting exact leaf regions driving model decisions to guarantee transparency and trust.
- 🤖 **RAG & Agro-Advisory Chatbot**: Context-aware AI assistant powered by Google Gemini and vector retrieval (ChromaDB) for organic/chemical remedies, dosages, and prevention tips.
- 📊 **Interactive Analytics Dashboard**: Modern React 19 interface visualizing infection histories, regional disease distributions, risk metrics, and treatment tracking.
- 🌦️ **Microclimate & Weather Alerts**: Real-time atmospheric data integration with proactive disease outbreak risk assessments based on humidity and temperature.
- 🔐 **Robust Security & Scalability**: Production-ready FastAPI backend with asynchronous SQLAlchemy ORM, Alembic migrations, JWT authentication, and bcrypt password hashing.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer [" Client Applications "]
        A[Landing Page<br/>HTML5 / Vanilla CSS]
        B[Dashboard Application<br/>React 19 / Vite / GSAP]
    end

    subgraph APILayer [" Backend Services (FastAPI) "]
        C[API Gateway / Router]
        D[Auth & User Service]
        E[Prediction Service]
        F[RAG & Chatbot Service]
        G[Weather & Advisory Service]
        H[Analytics Service]
    end

    subgraph DataML [" Intelligence & Data Stores "]
        I[(PostgreSQL Database)]
        J[TensorFlow / Grad-CAM Engine]
        K[(ChromaDB Vector Store)]
        L[Google Gemini LLM]
        M[OpenWeather API]
    end

    A -->|Static Requests| C
    B -->|REST API & Auth Token| C
    C --> D & E & F & G & H
    D --> I
    E --> J
    F --> K & L
    G --> M
    H --> I
```

---

## 📂 Project Structure

```text
PlantGuard-AI/
├── backend/                         # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                     # REST API versioned endpoints (v1)
│   │   │   ├── v1/                  # Auth, prediction, chatbot, analytics, weather
│   │   │   └── router.py            # Master API router
│   │   ├── core/                    # Security, JWT, settings, exceptions
│   │   ├── database/                # SQLAlchemy session, models, repositories
│   │   ├── ml/                      # Inference engine, Grad-CAM, labels, preprocessing
│   │   ├── rag/                     # ChromaDB embeddings, vector store, retriever
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/                # Business logic & external service connectors
│   │   ├── utils/                   # Helpers, image validation, file handlers
│   │   ├── config.py                # Environment configuration
│   │   ├── lifespan.py              # Startup/shutdown lifecycle hooks
│   │   ├── logging.py               # Centralized logger
│   │   └── main.py                  # FastAPI application entrypoint
│   ├── tests/                       # Unit and integration test suites
│   ├── Dockerfile                   # Backend Docker container specification
│   ├── requirements.txt             # Python backend dependencies
│   ├── alembic.ini                  # Database migration configuration
│   └── README.md                    # Detailed backend documentation
│
├── frontend/                        # Frontend Web Applications
│   ├── dashboard/                   # React 19 + Vite Farmer Dashboard
│   │   ├── src/                     # React components, pages, hooks, styles
│   │   │   ├── components/          # Sidebar, Navbar, Detection, Analytics, Account
│   │   │   ├── App.jsx              # Main dashboard routing and state
│   │   │   └── main.jsx             # React DOM root
│   │   ├── package.json             # Dashboard dependencies & scripts
│   │   ├── vite.config.js           # Vite build configuration
│   │   └── README.md                # Dashboard specific notes
│   ├── landing_page/                # High-conversion public landing page
│   │   ├── assets/                  # Images and static media
│   │   ├── index.html               # Semantic HTML5 landing structure
│   │   ├── style.css                # Polished modern CSS
│   │   └── script.js                # Interactive UI scripts
│   └── FrontendREADME.md            # Comprehensive frontend documentation
│
├── ml/                              # Machine Learning & Data Pipeline
│   ├── datasets/                    # Raw, processed, and split dataset directories
│   ├── notebooks/                   # Jupyter exploratory & prototyping notebooks
│   ├── reports/                     # Model metrics, confusion matrices, audit logs
│   ├── scripts/                     # Automated data curation & validation scripts
│   │   ├── 01_dataset_inspection.py # Dataset structure & class count inspection
│   │   ├── 02_check_duplicates.py   # Exact hash duplicate scanner
│   │   ├── 03_near_duplicate_check.py # Perceptual / structural similarity checks
│   │   ├── 04_build_metadata.py     # Metadata index builder
│   │   ├── 05_data_validation.py    # Image dimension & corruption validator
│   │   ├── 06_build_clean_dataset.py# Filtered dataset builder
│   │   ├── 08_create_dataset_split.py # Stratified train/val/test splitter
│   │   └── 11_data_pipeline.py      # Batch data loader pipeline
│   ├── src/                         # ML core modules and model definitions
│   ├── requirements.txt             # ML pipeline dependencies
│   └── README.md                    # Detailed ML engineering guide
│
├── docs/                            # In-depth Architectural & Technical Documentation
│   ├── API.md                       # Comprehensive API reference & endpoints
│   ├── ARCHITECTURE.md              # System design, data flow & modularity
│   ├── DATASET.md                   # Dataset schema, source details & distribution
│   ├── DEPLOYMENT.md                # Docker, cloud & production rollout guide
│   ├── MODEL.md                     # Model architecture, training hyperparameters
│   └── RAG.md                       # Retrieval-Augmented Generation specifications
│
├── requirements.txt                 # Root Python requirements
└── README.md                        # Root Project Documentation (This file)
```

---

## 💻 Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, Python-Multipart |
| **Database & ORM** | PostgreSQL 15+, SQLAlchemy 2.0, Alembic |
| **Authentication** | OAuth2 with Password Bearer, JWT (PyJWT / Python-Jose), Passlib (Bcrypt) |
| **Deep Learning & CV** | TensorFlow 2.15+, Keras, OpenCV, NumPy, Pillow, Scikit-Learn |
| **RAG & GenAI** | Google Generative AI (Gemini 1.5/Pro), ChromaDB, Sentence-Transformers |
| **Dashboard Frontend**| React 19, Vite, React Router DOM v7, GSAP, Lucide React, Oxlint |
| **Landing Page** | HTML5, Modern CSS (Flexbox / Grid / Glassmorphism), Vanilla JS |
| **DevOps & Tooling** | Docker, Docker Compose, Git, Uvicorn Workers |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or higher (with `npm`)
- **PostgreSQL**: `14` or higher (or running Docker container)
- **Git**

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create environment configuration file
cp .env.example .env   # On Windows PowerShell: Copy-Item .env.example .env
```

#### Configure `.env` variables:
```ini
DATABASE_URL=postgresql://postgres:password@localhost:5432/plantguard_db
SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
WEATHER_API_KEY=your_openweather_api_key
```

#### Run Database Migrations & Start Server:
```bash
# Run database migrations
alembic upgrade head

# Start FastAPI development server with hot-reload
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- **API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 3. Frontend Setup

#### A. Farmer Dashboard (React 19 + Vite)
```bash
# Navigate to dashboard directory
cd frontend/dashboard

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
- **Dashboard URL**: [http://localhost:5173](http://localhost:5173)

#### B. Landing Page
```bash
# Open frontend/landing_page/index.html in your browser or run a live server
cd frontend/landing_page
# Or serve using any static server (e.g. npx serve .)
```

---

### 4. Machine Learning & Dataset Pipeline

```bash
# Navigate to ml directory
cd ml

# Install ML dependencies
pip install -r requirements.txt

# Run dataset inspection and quality validation
python scripts/01_dataset_inspection.py
python scripts/05_data_validation.py

# Generate stratified train/val/test splits
python scripts/08_create_dataset_split.py
```

---

## 🌿 Real ML Model Inference Engine (PlantGuard EfficientNetB0)

PlantGuard AI runs real-time plant disease detection powered by a fine-tuned **EfficientNetB0** model trained on PlantVillage. The model resides strictly on the backend, ensuring security, performance, and memory-resident inference.

### 📐 Architecture Overview

```text
React Frontend (Vite @ :5173)
       │
       ▼  POST /api/predict (multipart/form-data: image)
Node.js Express Gateway (:5000)
       │
       ▼  Forwarded request
Python ML Service (FastAPI / Uvicorn @ :8000)
       │
       ▼  Preprocess: PIL → RGB → 224x224 → [0, 255] float32 tensor
PlantGuard EfficientNetB0 (.keras in memory)
       │
       ▼  15-class Softmax probability vector
Prediction JSON { className, confidence, topPredictions, threshold }
       │
       ▼
Real Disease & Confidence Display in PlantScanner UI
```

---

### 📦 1. Model File Placement & Configuration

Place your trained Keras model (`plantguard_model.keras` or `plantguard_efficientnet_best.keras`) in:
```text
ml-service/models/plantguard_model.keras
```
*(Also automatically searched in `./models/plantguard_model.keras` or `../ml/models/plantguard_model.keras`).*

#### Environment Variables (`ml-service/.env`):
```ini
# Path to the trained Keras model file
MODEL_PATH=./models/plantguard_model.keras

# Confidence threshold (0.0 to 1.0) for high-confidence match
MODEL_CONFIDENCE_THRESHOLD=0.60

# Port for ML inference service
PORT=8000
```

---

### 🚀 2. Running the Full Stack

#### Step 1: Start the Python ML Inference Service
```bash
# From workspace root
cd ml-service

# Install dependencies (if not already installed in your virtual environment)
pip install -r requirements.txt

# Start the ML service (loads model once into memory)
uvicorn app:app --host 127.0.0.1 --port 8000
```
- **Health Check**: `GET http://127.0.0.1:8000/api/health`
- **Model Info**: `GET http://127.0.0.1:8000/api/model-info`

#### Step 2: Start the Backend Gateway (Node.js / Express)
```bash
# In a new terminal
cd server
npm install
node server.js
```
- **Port**: `http://localhost:5000`
- **Predict Route**: `POST http://localhost:5000/api/predict`

#### Step 3: Start the React Dashboard
```bash
# In a new terminal
cd frontend/dashboard
npm install
npm run dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173)

---

### 🏷️ 3. Supported 15 Class Labels

The model classifies across 15 distinct PlantVillage categories:

| Index | Raw Class Name | Human-Readable Name | Crop | Health Status |
|:---:|:---|:---|:---|:---:|
| 0 | `Pepper__bell___Bacterial_spot` | Pepper Bell — Bacterial Spot | Bell Pepper | Infected |
| 1 | `Pepper__bell___healthy` | Pepper Bell — Healthy | Bell Pepper | **Healthy** |
| 2 | `Potato___Early_blight` | Potato — Early Blight | Potato | Infected |
| 3 | `Potato___Late_blight` | Potato — Late Blight | Potato | Infected |
| 4 | `Potato___healthy` | Potato — Healthy | Potato | **Healthy** |
| 5 | `Tomato_Bacterial_spot` | Tomato — Bacterial Spot | Tomato | Infected |
| 6 | `Tomato_Early_blight` | Tomato — Early Blight | Tomato | Infected |
| 7 | `Tomato_Late_blight` | Tomato — Late Blight | Tomato | Infected |
| 8 | `Tomato_Leaf_Mold` | Tomato — Leaf Mold | Tomato | Infected |
| 9 | `Tomato_Septoria_leaf_spot` | Tomato — Septoria Leaf Spot | Tomato | Infected |
| 10 | `Tomato_Spider_mites_Two_spotted_spider_mite` | Tomato — Two-Spotted Spider Mite | Tomato | Infected |
| 11 | `Tomato__Target_Spot` | Tomato — Target Spot | Tomato | Infected |
| 12 | `Tomato__Tomato_YellowLeaf__Curl_Virus` | Tomato — Yellow Leaf Curl Virus | Tomato | Infected |
| 13 | `Tomato__Tomato_mosaic_virus` | Tomato — Mosaic Virus | Tomato | Infected |
| 14 | `Tomato_healthy` | Tomato — Healthy | Tomato | **Healthy** |

---

### 📡 4. Prediction API Specifications

#### `POST /api/predict`
- **Content-Type**: `multipart/form-data`
- **Body Field**: `image` (binary file)
- **Supported Formats**: `JPG`, `JPEG`, `PNG`, `WEBP`, `BMP` (up to 25 MB)

#### Example Response:
```json
{
  "success": true,
  "prediction": {
    "className": "Tomato_Early_blight",
    "formattedName": "Tomato Early Blight",
    "crop": "Tomato",
    "condition": "Early Blight",
    "severity": "moderate",
    "isHealthy": false,
    "confidence": 0.9934,
    "confidencePercentage": 99.34
  },
  "topPredictions": [
    {
      "className": "Tomato_Early_blight",
      "formattedName": "Tomato Early Blight",
      "crop": "Tomato",
      "condition": "Early Blight",
      "confidence": 0.9934,
      "confidencePercentage": 99.34,
      "isHealthy": false
    },
    {
      "className": "Pepper__bell___Bacterial_spot",
      "formattedName": "Pepper Bell - Bacterial Spot",
      "crop": "Bell Pepper",
      "condition": "Bacterial Spot",
      "confidence": 0.0034,
      "confidencePercentage": 0.34,
      "isHealthy": false
    },
    {
      "className": "Tomato_Late_blight",
      "formattedName": "Tomato Late Blight",
      "crop": "Tomato",
      "condition": "Late Blight",
      "confidence": 0.0020,
      "confidencePercentage": 0.20,
      "isHealthy": false
    }
  ],
  "threshold": 0.60,
  "isConfident": true
}
```

#### `GET /api/health`
```json
{
  "status": "ok",
  "modelLoaded": true
}
```

#### `GET /api/model-info`
```json
{
  "model": "PlantGuard EfficientNetB0",
  "inputSize": "224x224",
  "numClasses": 15,
  "framework": "TensorFlow/Keras",
  "loaded": true
}
```

---

## 📚 Technical Documentation

Explore the detailed sub-system documentation for in-depth guidance:

- ⚙️ [**Backend Guide**](./backend/README.md) - Endpoints, middleware, authentication flow, and schemas.
- 🎨 [**Frontend Guide**](./frontend/FrontendREADME.md) - React component structure, state management, and UI design tokens.
- 🧠 [**Machine Learning Guide**](./ml/README.md) - Dataset preprocessing, model architectures, Grad-CAM, and benchmarking.
- 🏛️ [**Architecture Overview**](./docs/ARCHITECTURE.md) - High-level system topology and data flows.
- 📡 [**API Reference**](./docs/API.md) - REST API specifications and sample payloads.
- 💬 [**RAG & Chatbot System**](./docs/RAG.md) - Embedding pipeline, ChromaDB storage, and prompt engineering.
- 📊 [**Dataset Guide**](./docs/DATASET.md) - Class distributions, collection guidelines, and sanitization.
- 🚀 [**Deployment Guide**](./docs/DEPLOYMENT.md) - Production deployment with Docker and cloud hosting.

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "Add some AmazingFeature"`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
