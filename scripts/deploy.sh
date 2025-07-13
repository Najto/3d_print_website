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

# Backup current data before update
print_status "Creating backup before update..."
BACKUP_DIR="/home/pi/backups/aos-collection"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup data and files
if [ -d "/var/www/aos-collection/data" ]; then
    cp -r /var/www/aos-collection/data $BACKUP_DIR/data_backup_$DATE
    print_status "Data backed up to: $BACKUP_DIR/data_backup_$DATE"
fi

if [ -d "/var/www/aos-collection/public/files" ]; then
    tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/aos-collection/public/files
    print_status "Files backed up to: $BACKUP_DIR/files_backup_$DATE.tar.gz"
fi

# Navigate to source directory
cd /home/pi/3d_print_website

# Check if directory exists
if [ ! -d "/home/pi/3d_print_website" ]; then
    print_error "Source directory not found: /home/pi/3d_print_website"
    print_error "Please clone the repository first:"
    print_error "cd /home/pi && git clone https://github.com/Najto/3d_print_website"
    exit 1
fi

# Handle git conflicts gracefully
print_status "Checking for local changes..."
if ! git diff-index --quiet HEAD --; then
    print_warning "Local changes detected. Stashing them..."
    git stash push -m "Auto-stash before update $(date)"
    if [ $? -ne 0 ]; then
        print_error "Failed to stash local changes"
        exit 1
    fi
fi

# Pull latest changes
print_status "Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main
if [ $? -ne 0 ]; then
    print_error "Failed to pull latest changes"
    exit 1
fi

# Rebuild frontend
print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install npm dependencies"
    exit 1
fi

print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi

# Copy new files
print_status "Deploying frontend..."
cp -r dist/* /var/www/aos-collection/
if [ $? -ne 0 ]; then
    print_error "Failed to copy frontend files"
    exit 1
fi

print_status "Deploying backend..."
cp -r server/* /var/www/aos-collection/server/
if [ $? -ne 0 ]; then
    print_error "Failed to copy backend files"
    exit 1
fi

# Update backend dependencies
print_status "Updating backend dependencies..."
cd /var/www/aos-collection/server
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Set proper permissions
print_status "Setting permissions..."
chown -R www-data:www-data /var/www/aos-collection
chmod -R 755 /var/www/aos-collection
chmod -R 777 /var/www/aos-collection/public/files
chmod -R 777 /var/www/aos-collection/data

# Restart services
print_status "Restarting services..."
pm2 restart aos-backend
if [ $? -ne 0 ]; then
    print_warning "Failed to restart PM2 service"
fi

systemctl reload nginx
if [ $? -ne 0 ]; then
    print_warning "Failed to reload Nginx"
fi

# Verify services are running
print_status "Verifying services..."
sleep 2

# Test API
if curl -s http://localhost:3001/api/health > /dev/null; then
    print_status "✅ Backend API is responding"
else
    print_error "❌ Backend API is not responding"
fi

# Test Nginx
if curl -s http://localhost/api/health > /dev/null; then
    print_status "✅ Nginx proxy is working"
else
    print_error "❌ Nginx proxy is not working"
fi

print_status "🎉 Update completed successfully!"
print_status "📁 Backup location: $BACKUP_DIR"
print_status "🌐 Website: http://$(hostname -I | awk '{print $1}')/"
print_status ""
print_status "📋 If you encounter issues:"
print_status "  Check logs: pm2 logs aos-backend"
print_status "  Check status: pm2 status"
print_status "  Restore backup: cp -r $BACKUP_DIR/data_backup_$DATE/* /var/www/aos-collection/data/"

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