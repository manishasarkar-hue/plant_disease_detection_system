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
