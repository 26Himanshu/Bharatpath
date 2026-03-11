# 🌾 Bharat-Path — AI Decision Support System for Farmers

![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue)
![React](https://img.shields.io/badge/React-18-cyan)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-orange)

> A web-based AI decision support system designed to improve farm
> profitability and decision-making for Indian farmers using 
> data and artificial intelligence.

---

## 📌 Project Overview

Bharat-Path is an MSc Informatics project that integrates multiple
AI and data technologies to help farmers make better decisions.
The platform provides crop disease detection, market price 
optimization, price trend prediction, farm profit analytics, 
and government scheme awareness — all in one place.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🔬 AI Crop Disease Detection | Upload a leaf image and get instant disease diagnosis with treatment suggestions |
| 📊 Smart Mandi Optimizer | Find the best market to sell your crop for maximum profit |
| 📈 Price Trend Prediction | Forecast future crop prices using machine learning |
| 💰 Profit Tracker | Record expenses and sales, calculate net farm profit |
| 🏛️ Government Scheme Finder | Discover eligible government schemes with application links |
| 👤 Farmer Authentication | Secure registration and login system |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI framework
- **Tailwind CSS** — Utility-first styling
- **Axios** — API communication
- **Recharts** — Data visualization and charts
- **React Router DOM** — Page navigation

### Backend
- **FastAPI** — High-performance Python API framework
- **Uvicorn** — ASGI server
- **SQLAlchemy** — ORM for database operations
- **Passlib + Bcrypt** — Password hashing and security
- **Python-dotenv** — Environment variable management

### AI / Machine Learning
- **TensorFlow / Keras** — Deep learning framework
- **MobileNetV2** — Transfer learning for crop disease detection
- **Scikit-learn** — Linear regression for price prediction
- **OpenCV** — Image processing
- **Pandas / NumPy** — Data manipulation

### Database
- **PostgreSQL 18** — Primary database
- **SQLAlchemy ORM** — Database abstraction layer

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **Supabase** — PostgreSQL cloud database

---

## 📁 Project Structure
```
BharatPath/
│
├── backend/                    # FastAPI Backend
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py             # Farmer registration & login
│   │   ├── disease.py          # Crop disease detection
│   │   ├── mandi.py            # Mandi optimizer & price prediction
│   │   ├── profit.py           # Profit tracker
│   │   └── schemes.py          # Government schemes
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # PostgreSQL connection
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── crud.py                 # Database operations
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React.js Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   └── services/           # API service layer
│   └── package.json
│
├── ai-model/                   # AI Model Files
│   ├── train_model.py          # Model training script
│   ├── predict.py              # Prediction functions
│   └── model.h5                # Trained model (not in repo)
│
├── dataset/                    # Training data (not in repo)
├── docs/                       # Project documentation
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 18
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/Shivamkumar1409/BharatPath.git
cd BharatPath
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip3 install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/BharatPath
```

### 4. Run the Backend
```bash
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### 5. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🤖 AI Model

The crop disease detection model uses **MobileNetV2** with transfer
learning, trained on the **PlantVillage Dataset** (50,000+ images).

| Model | Algorithm | Library |
|-------|-----------|---------|
| Disease Detection | MobileNetV2 (Transfer Learning) | TensorFlow/Keras |
| Price Prediction | Linear Regression | Scikit-learn |

Training is done on **Google Colab** using free GPU.
The trained `model.h5` file is not included in the repository
due to its large size — train it using `ai-model/train_model.py`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new farmer |
| POST | `/auth/login` | Farmer login |
| POST | `/disease/detect` | Detect crop disease from image |
| POST | `/mandi/best-mandi` | Get best mandi recommendation |
| GET | `/mandi/price-prediction` | Get price trend prediction |
| GET | `/schemes/all` | Get all government schemes |
| POST | `/profit/add` | Add profit/expense record |

---

## 👥 Team

| Member | Role | Branch |
|--------|------|--------|
| Shivam Kumar | Backend + AI Lead | `feature/backend` |
| Member 2 | Frontend Lead | `feature/frontend` |
| Member 3 | Data + Testing | `feature/data-testing` |

---

## 📊 Data Sources

- **PlantVillage Dataset** — Crop disease images (Kaggle)
- **AGMARKNET** — Government mandi price database
- **OpenWeatherMap API** — Weather data

---

## 🎓 Academic Context

This project is developed as part of an **MSc Informatics** 
dissertation. It demonstrates the integration of:
- Computer Vision
- Machine Learning
- Web Development
- Agriculture Informatics
- Data Analytics

---

## 📄 License

This project is developed for academic purposes.

---

> Built with ❤️ for Indian Farmers 🌾