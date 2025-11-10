# PowerShell script to SSH into server and fix issues
$commands = @"
pwd
whoami
echo '=== Checking PostgreSQL Status ==='
ps aux | grep postgres || echo 'PostgreSQL not running'
echo '=== Checking if postgres user exists ==='
id postgres 2>/dev/null || echo 'postgres user does not exist'
echo '=== Checking PostgreSQL data directory ==='
ls -la /var/lib/postgresql/data 2>/dev/null || echo 'Data directory not accessible'
echo '=== Checking app directory ==='
ls -la /app
echo '=== Checking if Node app is running ==='
ps aux | grep node || echo 'Node not running'
"@

ssh srv-d48kb6jipnbc73dhtidg@ssh.oregon.render.com $commands

