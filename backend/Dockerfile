# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY server/requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY server/ .

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the app
CMD ["uvicorn", "server.server.asgi:application", "--host", "0.0.0.0", "--port", "8000"]