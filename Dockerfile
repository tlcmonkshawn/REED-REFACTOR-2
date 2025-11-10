# Base image - adjust based on your application type
# For Node.js: FROM node:20-alpine
# For Python: FROM python:3.11-slim
# For Go: FROM golang:1.21-alpine
# For a simple web server: FROM nginx:alpine

FROM node:20-alpine

# Install openssh-server and shadow (for usermod) for SSH access (required for Render SSH)
RUN apk add --no-cache openssh-server shadow && \
    mkdir -p /home/node/.ssh && \
    chmod 0700 /home/node/.ssh && \
    chown -R node:node /home/node/.ssh

# Ensure node user has shell access (required for SSH)
RUN usermod -s /bin/sh node

# Set working directory
WORKDIR /app

# Copy package files (if using Node.js)
COPY package*.json ./

# Install dependencies (all deps for build, production deps for runtime)
RUN npm install

# Copy application files
COPY . .

# Ensure node user owns the app directory
RUN chown -R node:node /app

# Switch to node user (non-root)
USER node

# Expose port - Render will set PORT env variable
EXPOSE ${PORT:-3000}

# Start command (adjust based on your app)
# Note: Your app should listen on process.env.PORT || 3000
CMD ["npm", "start"]

