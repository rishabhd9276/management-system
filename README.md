# HRMS Lite

A lightweight Human Resource Management System.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, Python
- **Database:** MongoDB (via Motor)

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Running locally or accessible URL)

## Setup & Run

### 1. Clone the repository
(If you downloaded this code, skip this step)

### 2. Backend Setup

```bash
cd hrms-lite/backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Server
uvicorn main:app --reload
```

Backend will run at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd hrms-lite/frontend

# Install dependencies
npm install

# Start Dev Server
npm run dev
```

Frontend will run at: `http://localhost:5173`

## Assumptions & Limitations

- MongoDB is expected to be running on `mongodb://localhost:27017` by default. Set `MONGO_URL` environment variable to override.
- Authentication is not implemented (Admin access assumed).
- Deployment requires a MongoDB instance (e.g., MongoDB Atlas).

## Deployment

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable `VITE_API_URL` if you modify the API base URL handling (currently hardcoded to localhost in `api.js` for local dev, should be updated for prod).

*Note: In `src/services/api.js`, update `API_URL` to your deployed backend URL before building.*

### Backend (Render/Railway)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `MONGO_URL` environment variable.
