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

## Deployment on Render

This repository includes a `render.yaml` Blueprint for easy deployment on [Render](https://render.com).

### Steps:
1.  Create a new **Blueprint Instance** on Render.
2.  Connect your GitHub repository.
3.  Render will automatically detect the `render.yaml` configuration.
4.  **Important:** You will be prompted to provide the `MONGO_URL`. You can get a free connection string from [MongoDB Atlas](https://www.mongodb.com/atlas/database).
5.  Click **Apply**. Render will deploy both the Backend (Web Service) and Frontend (Static Site).
6.  The Frontend will automatically be configured to talk to the Backend via the `VITE_API_URL` environment variable.

### Manual Deployment (Optional)

#### Frontend
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variable: `VITE_API_URL` (URL of your deployed backend)

#### Backend
- Build command: `pip install -r backend/requirements.txt`
- Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variable: `MONGO_URL` (Your MongoDB connection string)
