#!/usr/bin/env bash
# ==============================================================================
# TaskVille - Hetzner CX23 Ubuntu Automated Deployment Script
# Target: Hetzner Cloud CX23 (Ubuntu 22.04 / 24.04 LTS, 4GB RAM, 2 vCPU, 40GB SSD)
# Server IP: 89.167.22.10
# ==============================================================================

set -e

echo "🚀 [TaskVille] Initializing deployment on Hetzner CX23..."

# 1. Update OS packages
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git ufw apt-transport-https ca-certificates gnupg lsb-release

# 2. Configure Firewall (UFW)
echo "🛡️ Configuring firewall rules..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 3. Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
fi

# 4. Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose plugin..."
    apt-get install -y docker-compose-plugin
fi

# 5. Setup Project Directory
APP_DIR="/var/www/taskville"
echo "📂 Setting up project directory at ${APP_DIR}..."

if [ -d "$APP_DIR/.git" ]; then
    echo "🔄 Existing repository found, pulling latest changes from GitHub..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "📥 Cloning TaskVille repository from github.com/westland/TaskVille..."
    mkdir -p /var/www
    cd /var/www
    rm -rf "$APP_DIR"
    git clone https://github.com/westland/TaskVille.git taskville
    cd "$APP_DIR"
fi

# 6. Setup environment file if not present
if [ ! -f .env ]; then
    echo "⚙️ Creating production .env file..."
    API_KEY_VAL="${GEMINI_API_KEY:-insert_your_gemini_api_key_here}"
    cat <<EOT > .env
VITE_GEMINI_API_KEY=${API_KEY_VAL}
VITE_APP_NAME=TaskVille
VITE_SERVER_HOST=89.167.22.10
EOT
fi

# 7. Build and Run via Docker Compose
echo "🏗️ Building and deploying TaskVille container..."
docker compose down || true
docker compose up -d --build

# 8. Verify Deployment
echo "🔍 Checking container health status..."
sleep 5
docker ps | grep taskville_office

echo "======================================================================"
echo "🎉 [TaskVille] Deployment Complete!"
echo "🌐 Access your virtual office live at: http://89.167.22.10/"
echo "======================================================================"
