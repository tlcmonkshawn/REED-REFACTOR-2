# Base image - adjust based on your application type
# For Node.js: FROM node:20-alpine
# For Python: FROM python:3.11-slim
# For Go: FROM golang:1.21-alpine
# For a simple web server: FROM nginx:alpine

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files (if using Node.js)
COPY package*.json ./

# Install dependencies (all deps for build, production deps for runtime)
RUN npm install

# Copy application files
COPY . .

# Expose port - Render will set PORT env variable
EXPOSE ${PORT:-3000}

# Start command (adjust based on your app)
# Note: Your app should listen on process.env.PORT || 3000
CMD ["npm", "start"]

