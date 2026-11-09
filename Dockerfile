# Multi-stage Dockerfile for RouteSense
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend + Production Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/python-flask/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, models, and dataset
COPY backend/python-flask /app/backend/python-flask
COPY routesense_model.joblib /app/routesense_model.joblib
COPY evaluation_metrics.json /app/evaluation_metrics.json

# Copy compiled frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV PORT=5000
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

WORKDIR /app/backend/python-flask

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]

