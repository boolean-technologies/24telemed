# Use the official Node.js image from the Docker Hub
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package.json ../../yarn.lock ./
RUN yarn install

# Copy project files
COPY . .

# Build the application
RUN yarn build:personnel

# Expose the port
EXPOSE 3001

# Command to run the application
CMD ["yarn", "start:personnel"]
