# RouteSense Deployment Guide 🚀

This guide provides step-by-step instructions to deploy RouteSense to production.

---

## 🌟 Architecture Overview

RouteSense is fully pre-configured for **All-in-One Deployment** or **Split Deployment**:

- **Unified Mode (Recommended):** The Flask server automatically serves the compiled Vite React frontend (`frontend/dist`) along with all ML prediction endpoints (`/predict`, `/api/...`) on a single port. Zero CORS setup, zero cookie issues!
- **Split Mode:** You can host the frontend on **Vercel / Netlify** and the Flask backend on **Render / Railway**.

---

## 🎯 Option 1: Render.com (Recommended — Free & Easiest)

Render provides free hosting for web services and works great with Python ML + Node builds.

### Step 1: Push Code to GitHub
Ensure your repository is pushed to GitHub:
```bash
git add .
git commit -m "Configure production deployment"
git push origin main
```

### Step 2: Create Web Service on Render
1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Connect your RouteSense GitHub repository.
4. Fill in the following settings:
   - **Name:** `routesense` (or your preferred name)
   - **Environment:** `Python 3`
   - **Region:** Any close to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Build Command:**
     ```bash
     pip install -r backend/python-flask/requirements.txt && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs && npm --prefix frontend install && npm --prefix frontend run build
     ```
   - **Start Command:**
     ```bash
     cd backend/python-flask && gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app
     ```
   - **Instance Type:** Free

### Step 3: Add Environment Variables
Under the **Environment** tab on Render, add:
- `PYTHON_VERSION`: `3.11.9`
- `FLASK_ENV`: `production`
- `SECRET_KEY`: *(click generate or enter any random string)*
- `CORS_ALLOW_ALL`: `true`

Click **Create Web Service**. In ~3–5 minutes, your site will be live at `https://routesense-xxxx.onrender.com`!

---

## 🚂 Option 2: Railway.app (Fast 1-Click Docker)

Railway automatically detects the project's `Dockerfile`.

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `routesense-site` repository.
4. Railway will automatically build using the included [Dockerfile](file:///d:/Intern/routesense-site/Dockerfile).
5. In **Settings** → **Networking**, click **Generate Domain**.
6. (Optional) Add a MySQL database in Railway by clicking **New** → **Database** → **MySQL**, and connect the environment variables (`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`).

---

## ⚡ Option 3: Split Deployment (Frontend on Vercel + Backend on Render)

If you prefer hosting the React frontend on Vercel:

### 1. Deploy the Backend to Render or Railway
Follow Option 1 or 2 to deploy just the Flask backend. Copy your deployed backend URL (e.g. `https://routesense-api.onrender.com`).

### 2. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
2. Select your repository.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://routesense-api.onrender.com` (your backend URL)
5. Click **Deploy**.

---

## 🐳 Option 4: Self-Hosted Docker / VPS (AWS, DigitalOcean, Hetzner, etc.)

Run the entire stack with MySQL database using Docker Compose:

```bash
# Clone the repository
git clone <your-repo-url>
cd routesense-site

# Start both App and MySQL container in background
docker compose up -d --build
```

Your app will be accessible at `http://your-server-ip:5000`.

---

## ✅ Pre-flight Verification Checklist

- [x] Scikit-learn ML model (`routesense_model.joblib`) bundled and verified
- [x] Production WSGI server (`gunicorn`) installed and configured
- [x] Dynamic API base URL (`VITE_API_URL` / same-origin fallback) implemented
- [x] Multi-page HTML routing and static asset serving handled by Flask
- [x] Graceful database fallback if MySQL is not attached
- [x] Vite production build tested and verified with zero errors

