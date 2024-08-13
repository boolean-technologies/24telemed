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

# Accept build arguments for secrets
ARG REDIS_URL
ARG SENDGRID_API_KEY
ARG VIDEO_SDK_CALL_WEBHOOK
ARG VIDEO_SDK_PUBLIC_KEY
ARG VIDEO_SDK_TOKEN

# Set environment variables for secrets
ENV REDIS_URL=$REDIS_URL
ENV SENDGRID_API_KEY=$SENDGRID_API_KEY
ENV VIDEO_SDK_CALL_WEBHOOK=$VIDEO_SDK_CALL_WEBHOOK
ENV VIDEO_SDK_PUBLIC_KEY=$VIDEO_SDK_PUBLIC_KEY
ENV VIDEO_SDK_TOKEN=$VIDEO_SDK_TOKEN

# Hardcoded environment variables
ENV DEBUG=False
ENV EMAIL_FROM="no-reply@example.com"
ENV SENDGRID_TEMPLATE_ID_PASSWORD_RESET_OTP="d-1234567890abcdef1234567890abcdef"
ENV ALLOWED_HOSTS='["localhost, 127.0.0.1"]'
ENV CORS_ALLOWED_ORIGINS='["http://localhost, http://127.0.0.1, http://localhost:8000, http://127.0.0.1:8000"]'

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the app
ENTRYPOINT [ "/entrypoint.sh" ]