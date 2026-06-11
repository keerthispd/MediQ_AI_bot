# AI Medical Assistant Bot

An AI-powered Medical Assistant built using **React**, **FastAPI**, **SQLite**, and **Google Gemini AI**. The application provides educational medical guidance, symptom triage, conversation history, safety filtering, red-flag detection, and medical report upload capabilities.

---

## Features

* AI-powered medical question answering using Gemini
* Symptom triage and educational guidance
* Medical emergency red-flag detection
* Safety filtering for harmful content
* Conversation history storage using SQLite
* Medical report upload support
* Modern React-based user interface
* FastAPI backend with REST APIs

---

## Tech Stack

### Frontend

* React
* Axios
* CSS

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Python

### AI Integration

* Google Gemini 2.5 Flash

---

## Project Structure

```text
MedicalAssistant_bot/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── database/
├── uploads/
├── docs/
├── requirements.txt
└── README.md
```

---

## Backend Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Start Backend Server

```bash
uvicorn backend.main:app --reload
```

Backend will run on:

```text
http://localhost:8000
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## API Endpoints

### Health Check

```http
GET /api/health
```

### Chat with Assistant

```http
POST /api/chat
```

### Upload Medical Report

```http
POST /api/upload
```

### Conversation History

```http
GET /api/history
```

---

## Safety Features

* Harmful-content filtering
* Self-harm prevention responses
* Medical emergency red-flag detection
* Educational-use disclaimer
* No direct diagnosis functionality

---

## Database

The application stores:

* User messages
* Assistant responses
* Red-flag information
* Conversation timestamps

Database engine:

```text
SQLite
```

---

## Running the Full Application

Start Backend:

```bash
uvicorn backend.main:app --reload
```

Start Frontend:

```bash
cd frontend
npm start
```

Open:

```text
http://localhost:3000
```

---

## Disclaimer

This application is intended for educational and informational purposes only. It does not provide professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

---

## Future Enhancements

* User authentication
* PDF report analysis
* Voice-based interaction
* Multi-language support
* Cloud deployment
* Mobile application integration

---

## Author

Developed as an AI-powered healthcare assistance project using React, FastAPI, SQLite, and Google Gemini AI.
