# Base image - adjust based on your application type
# For Node.js: FROM node:20-alpine
# For Python: FROM python:3.11-slim
# For Go: FROM golang:1.21-alpine
# For a simple web server: FROM nginx:alpine

FROM node:20-alpine

# Install PostgreSQL, openssh-server, and shadow (for usermod) for SSH access
RUN apk add --no-cache postgresql postgresql-contrib openssh-server shadow su-exec && \
    mkdir -p /home/node/.ssh && \
    chmod 0700 /home/node/.ssh && \
    chown -R node:node /home/node/.ssh && \
    mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data

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

# Copy startup script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure node user owns the app directory
RUN chown -R node:node /app

# Expose ports - Render will set PORT env variable for app, 5432 for PostgreSQL
EXPOSE ${PORT:-3000} 5432

# Start command - runs PostgreSQL and the app
# Note: Entrypoint runs as root to start PostgreSQL, then switches to node for the app
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]

