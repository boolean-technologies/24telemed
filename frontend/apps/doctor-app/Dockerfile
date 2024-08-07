# Use the official Node.js image from the Docker Hub
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package.json ./
RUN yarn install

# Copy project files
COPY . .

# Build the application
RUN yarn build:doctor

# Second stage: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist/apps/doctor-app /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Define the command to run the app
CMD ["nginx", "-g", "daemon off;"]
