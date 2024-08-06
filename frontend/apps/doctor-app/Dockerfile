# Use the official Node.js image from the Docker Hub
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY ../../package.json ../../yarn.lock ./

COPY ../../tsconfig.base.json .

RUN yarn install



# Copy project files
COPY ./apps/doctor-app .

# Build the application
RUN yarn build:doctor

# Expose the port
EXPOSE 4200

# Command to run the application
CMD ["yarn", "start:doctor"]
