# Use the official Node.js image from the Docker Hub
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package.json ../../nx.json ../../tsconfig.base.json ../../vite.config.ts ./

COPY ../../packages ./packages

# Copy application source code
COPY ../../apps/doctor-app ./apps/doctor-app

RUN yarn install

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
