#!/bin/bash

# AoS Collection Deployment Script for Nginx
echo "🚀 Deploying AoS Collection to Nginx..."

# Configuration
PROJECT_DIR="/home/pi/3d_print_website"
NGINX_DIR="/var/www/aos-collection"
NGINX_CONFIG="/etc/nginx/sites-available/aos-collection"
SERVICE_USER="www-data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Install dependencies
print_status "Installing system dependencies..."
apt update
apt install -y nginx nodejs npm pm2

# Create nginx directory
print_status "Creating nginx directory..."
mkdir -p $NGINX_DIR
mkdir -p $NGINX_DIR/public/files

# Build the frontend
print_status "Building frontend..."
cd $PROJECT_DIR
npm install
npm run build

# Copy built files to nginx directory
print_status "Copying built files..."
cp -r dist/* $NGINX_DIR/
cp -r public/* $NGINX_DIR/public/
cp -r server $NGINX_DIR/

# Install backend dependencies
print_status "Installing backend dependencies..."
cd $NGINX_DIR/server
npm install

# Set proper permissions
print_status "Setting permissions..."
chown -R $SERVICE_USER:$SERVICE_USER $NGINX_DIR
chmod -R 755 $NGINX_DIR
chmod -R 777 $NGINX_DIR/public/files  # Upload directory needs write access

# Copy nginx configuration
print_status "Configuring nginx..."
cp $PROJECT_DIR/nginx/aos-collection.conf $NGINX_CONFIG

# Enable the site
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default  # Remove default site

# Test nginx configuration
print_status "Testing nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed!"
    exit 1
fi

# Setup PM2 for backend
print_status "Setting up PM2 for backend..."
cd $NGINX_DIR/server

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'aos-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Restart nginx
print_status "Restarting nginx..."
systemctl restart nginx
systemctl enable nginx

# Create update script
print_status "Creating update script..."
cat > $NGINX_DIR/update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating AoS Collection..."

# Pull latest changes
cd /home/pi/3d_print_website
git pull origin main

# Rebuild frontend
npm install
npm run build

# Copy new files
sudo cp -r dist/* /var/www/aos-collection/
sudo cp -r server/* /var/www/aos-collection/server/

# Update backend dependencies
cd /var/www/aos-collection/server
sudo npm install

# Restart services
sudo pm2 restart aos-backend
sudo systemctl reload nginx

echo "✅ Update complete!"
EOF

chmod +x $NGINX_DIR/update.sh

# Create backup script
print_status "Creating backup script..."
cat > $NGINX_DIR/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/pi/backups/aos-collection"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/aos-collection_$DATE.tar.gz /var/www/aos-collection/public/files

echo "✅ Backup created: $BACKUP_DIR/aos-collection_$DATE.tar.gz"
EOF

chmod +x $NGINX_DIR/backup.sh

# Final status check
print_status "Checking services..."
systemctl status nginx --no-pager -l
pm2 status

print_status "🎉 Deployment complete!"
print_status "📁 Files: $NGINX_DIR"
print_status "🌐 Website: http://$(hostname -I | awk '{print $1}')"
print_status "🔧 Backend API: http://$(hostname -I | awk '{print $1}')/api/health"
print_status ""
print_status "📋 Management commands:"
print_status "  Update: sudo $NGINX_DIR/update.sh"
print_status "  Backup: sudo $NGINX_DIR/backup.sh"
print_status "  Logs: pm2 logs aos-backend"
print_status "  Restart: sudo pm2 restart aos-backend"