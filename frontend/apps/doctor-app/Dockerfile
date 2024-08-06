# Use the official Node.js image from the Docker Hub
FROM node:16

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start:doctor"]
