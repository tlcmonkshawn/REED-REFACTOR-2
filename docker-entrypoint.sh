#!/bin/sh
set -e

# Create /run/postgresql directory for PostgreSQL lock files
echo "Creating PostgreSQL runtime directory..."
mkdir -p /run/postgresql
chown postgres:postgres /run/postgresql

# Initialize PostgreSQL data directory if it's empty
if [ -z "$(ls -A /var/lib/postgresql/data 2>/dev/null)" ]; then
    echo "Initializing PostgreSQL database..."
    su-exec postgres initdb -D /var/lib/postgresql/data
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
    echo "port=5432" >> /var/lib/postgresql/data/postgresql.conf
fi

# Start PostgreSQL in background
echo "Starting PostgreSQL..."
su-exec postgres pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/logfile -w start || {
    echo "PostgreSQL failed to start. Checking logs..."
    cat /var/lib/postgresql/data/logfile 2>/dev/null || echo "No log file found"
    exit 1
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
for i in $(seq 1 30); do
    if su-exec postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "PostgreSQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "PostgreSQL failed to become ready"
        cat /var/lib/postgresql/data/logfile 2>/dev/null || echo "No log file found"
        exit 1
    fi
    sleep 1
done

# Create database and user if they don't exist
echo "Setting up database..."
su-exec postgres psql -U postgres -c "CREATE DATABASE reed_refactor_2;" 2>/dev/null || true
su-exec postgres psql -U postgres -c "CREATE USER reed_user WITH PASSWORD 'reed_password';" 2>/dev/null || true
su-exec postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE reed_refactor_2 TO reed_user;" 2>/dev/null || true
su-exec postgres psql -U postgres -d reed_refactor_2 -c "GRANT ALL ON SCHEMA public TO reed_user;" 2>/dev/null || true

echo "PostgreSQL setup complete!"

# Switch to node user and execute the main command (npm start)
cd /app
exec su-exec node "$@"

