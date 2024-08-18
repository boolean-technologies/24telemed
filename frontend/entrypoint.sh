#!/bin/sh

# Substitute environment variables in your static files or configuration files
envsubst < /app/index.html > /app/index.html.tmp && mv /app/index.html.tmp /app/index.html

# Start Nginx
nginx -g 'daemon off;'
