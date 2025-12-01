# Senpai AI - Walkthrough

## Overview
We have built a complete production-ready application for web reconnaissance and security analysis, powered by Google Gemini.

## Components Implemented

### Backend
- **FastAPI Application**: Async architecture with `app.main`.
- **Database**: MongoDB with Beanie ODM (`app.models`, `app.database`).
- **Recon Modules**:
  - `passive_recon`: WHOIS, DNS.
  - `active_recon`: Headers, Tech.
  - `dir_discovery`: Wordlist scan.
  - `auth_check`: Security headers, login forms.
  - `param_abuse`: URL parameter analysis.
  - `phishing`: Heuristics.
  - `osint`: Dorks.
- **AI Service**: `app.ai.service` using Google Gemini for analysis and chat.
- **Orchestrator**: `app.services.orchestrator` for managing scan lifecycle.

### Frontend
- **React App**: Vite-based setup.
- **UI Components**: Modern, responsive design with TailwindCSS.
  - Dark/Light mode toggle.
  - Module status cards.
  - Finding details with severity coloring.
  - AI Summary dashboard.
  - Interactive ChatBox.
- **Pages**: Home, Dashboard, Details.

## Setup & Verification

### Prerequisites
1. **Install MongoDB**: Download from [mongodb.com](https://www.mongodb.com/try/download/community) and install.
2. **Start MongoDB**: 
   ```powershell
   # Check if MongoDB is running
   mongod --version
   # Start MongoDB (usually runs automatically after install)
   # Or manually: net start MongoDB
   ```

### 1. Environment Configuration

Create a `.env` file in the `backend` directory:
```powershell
cd backend
New-Item .env -ItemType File
```

Add the following to `.env`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017
```

### 2. Backend Startup

**Step-by-step commands:**
```powershell
# Navigate to backend
cd backend

# Activate virtual environment (REQUIRED)
venv\Scripts\activate

# You should see (venv) in your prompt now

# Start the server
uvicorn app.main:app --reload
```

**Verify:**
- Open browser: `http://localhost:8000/docs`
- You should see the FastAPI Swagger documentation
- Check terminal for "Application startup complete"
- Verify no MongoDB connection errors

### 3. Frontend Startup

**Open a NEW terminal** (keep backend running), then:
```powershell
# Navigate to frontend
cd frontend

# Start dev server
npm run dev
```

**Verify:**
- Open browser: `http://localhost:5173`
- You should see the Senpai AI home page
- Test the Dark/Light theme toggle (top right)
- Check that all UI elements load correctly

### 4. End-to-End Scan Test

1. **Enter Target URL**:
   - Go to `http://localhost:5173`
   - Enter `https://example.com` in the input field
   
2. **Select Modules**:
   - All modules should be selected by default
   - Click "Start Scan"
   
3. **Monitor Progress**:
   - You'll be redirected to the scan dashboard
   - Watch the status change from "pending" → "running" → "completed"
   - This may take 30-60 seconds
   
4. **View Results**:
   - AI Summary appears at the top with overall risk rating
   - Module cards show findings count
   - Click on a module to see detailed findings
   
5. **Test AI Chat**:
   - Use the chatbox on the right side
   - Ask: "What are the top security concerns?"
   - AI should respond with context from the scan

### Troubleshooting

**Backend won't start?**
- Make sure virtual environment is activated: `venv\Scripts\activate`
- Check MongoDB is running: `mongod --version`
- Verify `.env` file exists in `backend` directory

**Frontend errors?**
- Run `npm install` again in the frontend directory
- Clear browser cache and reload

**Scan stuck on "pending"?**
- Check backend terminal for errors
- Verify MongoDB connection in backend logs
- Ensure GEMINI_API_KEY is set in `.env`

## Deployment

### GitHub
The project is configured for Git.
1. Initialize/Push:
   ```bash
   git push -u origin main
   ```
2. Repository: `https://github.com/lossenpai80085/senpai_AI`

## Next Steps
- Add more advanced modules (port scan, subdomains).
- Implement user authentication.
- Deploy to cloud (Docker support).
