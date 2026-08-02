📂 Backend Folder Structure

backend/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│   ├── lifespan.py
│   └── logging.py
│
├── api/
│   ├── v1/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   ├── analytics.py
│   │   ├── history.py
│   │   ├── chatbot.py
│   │   ├── weather.py
│   │   ├── feedback.py
│   │   ├── users.py
│   │   └── health.py
│   │
│   └── router.py
│
├── core/
│   ├── security.py
│   ├── jwt.py
│   ├── hashing.py
│   ├── settings.py
│   ├── constants.py
│   └── exceptions.py
│
├── database/
│   ├── session.py
│   ├── base.py
│   ├── models/
│   ├── repositories/
│   └── migrations/
│
├── schemas/
│   ├── auth.py
│   ├── prediction.py
│   ├── analytics.py
│   ├── chatbot.py
│   ├── history.py
│   └── user.py
│
├── services/
│   ├── auth_service.py
│   ├── prediction_service.py
│   ├── weather_service.py
│   ├── chatbot_service.py
│   ├── analytics_service.py
│   ├── history_service.py
│   └── report_service.py
│
├── ml/
│   ├── inference.py
│   ├── preprocessing.py
│   ├── postprocessing.py
│   ├── labels.json
│   ├── download_model.py
│   └── gradcam.py
│
├── rag/
│   ├── documents/
│   ├── embeddings.py
│   ├── chunking.py
│   ├── vector_store.py
│   ├── retriever.py
│   ├── prompts.py
│   └── rag_service.py
│
├── integrations/
│   ├── gemini.py
│   ├── weather_api.py
│   ├── huggingface.py
│   └── email.py
│
├── middleware/
│   ├── auth.py
│   ├── cors.py
│   ├── logging.py
│   ├── rate_limit.py
│   └── error_handler.py
│
├── utils/
│   ├── image.py
│   ├── validators.py
│   ├── file.py
│   ├── response.py
│   └── helpers.py
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── scripts/
│
├── docs/
│
├── static/
│
├── uploads/
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── alembic.ini
└── README.md

🚀 Backend Architecture

                React Frontend
                       │
               HTTPS REST API
                       │
                FastAPI Router
                       │
      ┌────────────────────────────────┐
      │                                │
Authentication                  Prediction API
      │                                │
      ▼                                ▼
JWT Middleware               Prediction Service
      │                                │
      ▼                                ▼
Database                  TensorFlow Inference
      │                                │
      │                         HuggingFace Model
      │                                │
      └──────────────┬─────────────────┘
                     ▼
               PostgreSQL Database


  📌 API Routes
  Authentication
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/profile
PATCH  /auth/profile
Prediction
POST /predict

POST /predict/batch

GET /predict/{id}

DELETE /predict/{id}
History
GET /history

DELETE /history

GET /history/{id}
Analytics
GET /analytics

GET /analytics/diseases

GET /analytics/monthly
Weather
GET /weather

GET /weather/risk
Chatbot
POST /chat

POST /chat/rag
Feedback
POST /feedback

GET /feedback
🧠 Service Layer

Business logic routes me nahi, services me hoga.

Prediction Route

↓

Prediction Service

↓

ML Inference

↓

Repository

↓

Database

Ye architecture testing aur maintenance ko easy banata hai.

🤖 ML Module
Image

↓

Resize

↓

Normalize

↓

TensorFlow

↓

Prediction

↓

Confidence

↓

GradCAM

↓

Response
📚 RAG Module
PDF

↓

Chunking

↓

Embedding

↓

Vector Database

↓

Retriever

↓

Gemini

↓

Final Response
🗄 Database Tables
Users
id

name

email

password_hash

role

created_at
Predictions
id

user_id

image_url

disease

confidence

heatmap_url

created_at
Chat History
id

user_id

question

answer

created_at
Feedback
id

prediction_id

rating

comment
🔐 Authentication

Use

JWT Access Token
Refresh Token
Password Hashing (bcrypt)
Role-based authorization (future-ready)

Flow:

Login

↓

JWT

↓

Authorization Header

↓

Middleware

↓

Protected Route
🌍 External Integrations
Gemini API
Treatment recommendations
Farmer Q&A
Disease explanation
Weather API
Temperature
Humidity
Rainfall
Risk scoring
Hugging Face
Download latest model on startup
Model versioning
⚡ Middleware
Request

↓

Logging

↓

CORS

↓

Rate Limiting

↓

Authentication

↓

Route

↓

Response
📊 Logging

Log:

API requests
Prediction time
Model loading
Errors
User login
Deployment events

Use structured logging instead of plain print().

📁 Environment Variables
DATABASE_URL=

JWT_SECRET=

JWT_ALGORITHM=

JWT_EXPIRE_MINUTES=

GOOGLE_API_KEY=

HUGGINGFACE_TOKEN=

MODEL_REPO=

WEATHER_API_KEY=

EMAIL_API_KEY=

REDIS_URL=

Never commit the real .env file.

🧪 Testing
Unit Tests
Services
Utilities
ML preprocessing
Integration Tests
Database
API + ML
Authentication
API Tests
/predict
/chat
/weather
/history
🚀 Deployment

Backend → Render

Database → Neon PostgreSQL

Model → Hugging Face Hub

Vector DB → ChromaDB (local) or Qdrant (cloud)

📈 Performance Goals
Prediction response: < 2 seconds
API latency: < 300 ms (excluding model inference)
Model loaded once at startup (avoid loading per request)
Async I/O for external APIs (Gemini, Weather)
Image compression before inference
Pagination for history APIs
🔒 Security Checklist
✅ Password hashing with bcrypt
✅ JWT authentication
✅ Input validation with Pydantic
✅ File type validation
✅ File size limits
✅ Rate limiting
✅ CORS configuration
✅ SQL injection protection (ORM)
✅ Environment secrets
✅ HTTPS in production
✅ Centralized exception handling
📦 Production Dependencies

Core:

FastAPI
Uvicorn
SQLAlchemy
Alembic
Pydantic

ML:

TensorFlow
OpenCV
Pillow
NumPy

Database:

PostgreSQL
psycopg

AI:

google-generativeai
huggingface_hub

RAG:

LangChain (optional)
ChromaDB or FAISS
Sentence Transformers

Utilities:

python-dotenv
httpx
loguru (optional)
🏆 Backend Development Principles
Routes should stay thin; business logic belongs in services.
Database access should go through repositories.
Never hardcode secrets.
Every endpoint must validate request and response models.
Keep ML inference isolated from API routing.
Cache the model in memory after startup.
Return consistent JSON response formats.
Log errors with enough context to debug, but never expose internal details to clients.

