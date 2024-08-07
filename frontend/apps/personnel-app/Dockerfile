# Stage 1: Build the application
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock from the root directory of the build context
COPY ../../package.json ../../yarn.lock ./

# Install dependencies
RUN yarn install

# Copy NX workspace files and application source code
COPY ../../nx.json ./
COPY apps/personnel-app ./apps/personnel-app

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
