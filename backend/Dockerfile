# Use a stable Python version
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port (optional, Render sets PORT automatically)
EXPOSE 8000

# Run FastAPI app (Render provides $PORT)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
