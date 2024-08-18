#!/bin/sh

# Substitute environment variables in your static files or configuration files
envsubst < /app/index.html > /app/index.html.tmp && mv /app/index.html.tmp /app/index.html

# Check if 'daemon off;' is already present
if ! grep -q "daemon off;" /etc/nginx/nginx.conf; then
  echo "daemon off;" >> /etc/nginx/nginx.conf
fi

# Start Nginx
nginx -g 'daemon off;'
