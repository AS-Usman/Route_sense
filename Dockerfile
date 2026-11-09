FROM python:3.11-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=5000

# Install Python requirements
COPY backend/python-flask/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, ML models, and metrics
COPY backend/python-flask /app/backend/python-flask
COPY routesense_model.joblib /app/routesense_model.joblib
COPY routesense_model.joblib /app/backend/python-flask/routesense_model.joblib
COPY evaluation_metrics.json /app/evaluation_metrics.json

# Copy pre-compiled frontend distribution
COPY frontend/dist /app/frontend/dist
COPY frontend/dist /app/backend/python-flask/frontend/dist

EXPOSE 5000

WORKDIR /app/backend/python-flask

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --threads 4 --timeout 120 app:app"]
