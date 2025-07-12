#!/bin/bash

# Setup Basic Authentication for Nginx
echo "🔐 Setting up Basic Authentication..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Install apache2-utils for htpasswd
apt update
apt install -y apache2-utils

# Create password file
echo "Creating admin user..."
read -p "Enter admin username: " username
htpasswd -c /etc/nginx/.htpasswd $username

# Create viewer user (optional)
read -p "Create viewer user? (y/n): " create_viewer
if [ "$create_viewer" = "y" ]; then
    read -p "Enter viewer username: " viewer_username
    htpasswd /etc/nginx/.htpasswd $viewer_username
fi

# Set proper permissions
chown root:www-data /etc/nginx/.htpasswd
chmod 640 /etc/nginx/.htpasswd

echo "✅ Basic authentication configured!"
echo "📝 Edit /etc/nginx/sites-available/aos-collection to enable auth_basic"
echo "🔄 Run: sudo systemctl reload nginx"