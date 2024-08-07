# Stage 1: Build the application
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package.json ../../nx.json ../../tsconfig.base.json ../../vite.config.ts ./

COPY ../../packages ./packages

COPY apps/personnel-app ./apps/personnel-app

# Install dependencies
RUN yarn install

# Build the application
RUN yarn build personnel-app

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist/apps/personnel-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
