#!/bin/bash

echo "🚀 Starting Deployment..."

# 1. Update & Install Dependencies
echo "📦 Installing Java & Nginx..."
sudo apt update -y
sudo apt install openjdk-17-jdk nginx -y

# 2. Setup Nginx
echo "🌐 Configuring Nginx..."
# Backup original config just in case
if [ ! -f /etc/nginx/sites-available/default.bak ]; then
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
fi
# Copy our config
sudo cp ./nginx.default.conf /etc/nginx/sites-available/default
# Restart Nginx
sudo systemctl restart nginx

# 3. Start Backend
echo "☕ Starting Spring Boot..."
# Kill existing java process if any
pkill -f java
# Run new jar
nohup java -jar sichuation-backend.jar > backend.log 2>&1 &

echo "✅ Deployment Complete!"
echo "👉 Access your site at: http://$(curl -s ifconfig.me)"
