#!/bin/bash
# Script to fix PostgreSQL and check server status

ssh srv-d48kb6jipnbc73dhtidg@ssh.oregon.render.com << 'EOF'
echo "=== Current Directory ==="
pwd
echo ""
echo "=== Current User ==="
whoami
echo ""
echo "=== Checking PostgreSQL Status ==="
ps aux | grep postgres || echo "PostgreSQL not running"
echo ""
echo "=== Checking if postgres user exists ==="
id postgres 2>/dev/null || echo "postgres user does not exist"
echo ""
echo "=== Checking PostgreSQL data directory ==="
ls -la /var/lib/postgresql/data 2>/dev/null || echo "Data directory not accessible"
echo ""
echo "=== Checking app directory ==="
ls -la /app
echo ""
echo "=== Checking if Node app is running ==="
ps aux | grep node || echo "Node not running"
echo ""
echo "=== Checking entrypoint script ==="
cat /usr/local/bin/docker-entrypoint.sh 2>/dev/null | head -20
EOF

