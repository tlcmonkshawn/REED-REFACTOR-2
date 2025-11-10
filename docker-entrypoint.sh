#!/bin/sh
set -e

# Initialize PostgreSQL data directory if it's empty
if [ -z "$(ls -A /var/lib/postgresql/data)" ]; then
    echo "Initializing PostgreSQL database..."
    su-exec postgres initdb -D /var/lib/postgresql/data
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
fi

# Start PostgreSQL in background
echo "Starting PostgreSQL..."
su-exec postgres pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/logfile start

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until su-exec postgres pg_isready -U postgres; do
    sleep 1
done

# Create database and user if they don't exist
echo "Setting up database..."
su-exec postgres psql -U postgres -c "CREATE DATABASE reed_refactor_2;" 2>/dev/null || true
su-exec postgres psql -U postgres -c "CREATE USER reed_user WITH PASSWORD 'reed_password';" 2>/dev/null || true
su-exec postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE reed_refactor_2 TO reed_user;" 2>/dev/null || true
su-exec postgres psql -U postgres -d reed_refactor_2 -c "GRANT ALL ON SCHEMA public TO reed_user;" 2>/dev/null || true

echo "PostgreSQL is ready!"

# Switch to node user and execute the main command (npm start)
cd /app
exec su-exec node "$@"

