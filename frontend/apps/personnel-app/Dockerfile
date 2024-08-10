FROM nginx:alpine

# Copy the built React app from the dist directory
COPY ../../dist/apps/personnel-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
