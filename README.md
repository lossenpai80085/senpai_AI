# NIGHUD AI RECON SUITE

An AI-powered web discovery, recon, and security assistant.

## Features

- **Passive Recon**: WHOIS, DNS, Server Info.
- **Active Recon**: Technology fingerprinting, HTTP headers.
- **Directory Discovery**: Smart wordlist brute-force.
- **Auth Check**: Login detection, security headers, cookie analysis.
- **Param Abuse**: Suspicious parameter detection.
- **Phishing Check**: Heuristics and brand imitation detection.
- **OSINT**: Google Dorks generation.
- **AI Integration**: Powered by Google Gemini for finding analysis and risk scoring.
- **Modern UI**: React + TailwindCSS + ShadCN style (Light/Dark mode).

## Prerequisites

- Python 3.9+
- Node.js 16+
- MongoDB 4.4+ (Running locally or remote)
- Google Gemini API Key

## Installation

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Create `.env` in `backend/app/` (or root of backend) with:
     ```
     GEMINI_API_KEY=your_api_key_here
     MONGO_URI=mongodb://localhost:27017
     ```

### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```
API will be available at `http://localhost:8000`.
Docs at `http://localhost:8000/docs`.

### Start Frontend
```bash
cd frontend
npm run dev
```
App will be available at `http://localhost:5173`.

## Usage

1. Open the frontend.
2. Enter a target URL (e.g., `https://example.com`).
3. Select modules to run.
4. Click "Start Scan".
5. View results in the dashboard and chat with the AI assistant.

## Architecture

- **Backend**: FastAPI, SQLAlchemy (SQLite), AsyncIO.
- **Frontend**: React, TailwindCSS, Lucide Icons.
- **AI**: Google Gemini Pro.

## Disclaimer

This tool is for educational and authorized testing purposes only. Do not use on targets you do not own or have permission to test.
