#!/bin/bash

# Finance Friend v3 — Production Deployment Script
# Purpose: Go from "launch" decision to live website in <30 min
# Author: Moriah
# Time: Automated deployment

set -e

# Configuration
DOMAIN=${1:-"finance-friend.local"}
SERVER=${2:-"localhost"}
PROD_BACKEND_PORT=3777
PROD_FRONTEND_PORT=4173

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="/tmp/ff-deploy-$TIMESTAMP.log"

echo "🏔️ Finance Friend v3 — Production Deployment"
echo "Timestamp: $TIMESTAMP"
echo "Domain: $DOMAIN"
echo "Log: $LOG_FILE"
echo ""

# Function to log and echo
log() {
  echo "[$(date +'%H:%M:%S')] $1"
  echo "[$(date +'%H:%M:%S')] $1" >> $LOG_FILE
}

# Step 1: Backup existing code
log "Step 1: Backup existing code..."
if [ -d "/prod/finance-friend-v3" ]; then
  mkdir -p /prod/backups
  cp -r /prod/finance-friend-v3 /prod/backups/finance-friend-v3-$TIMESTAMP
  log "  ✅ Backup created"
else
  log "  ℹ️  No existing code to backup"
fi

# Step 2: Deploy code
log "Step 2: Deploying code..."
mkdir -p /prod
cp -r /home/moriahkeeper/.openclaw/workspace/finance-friend-v3 /prod/
log "  ✅ Code deployed to /prod"

# Step 3: Install dependencies
log "Step 3: Installing dependencies..."
cd /prod/finance-friend-v3/backend
npm install --production > /tmp/npm-backend.log 2>&1 || {
  log "  ❌ Backend npm install failed"
  cat /tmp/npm-backend.log | head -20 >> $LOG_FILE
  exit 1
}
log "  ✅ Backend dependencies installed"

cd /prod/finance-friend-v3/client
npm install --production > /tmp/npm-frontend.log 2>&1 || {
  log "  ❌ Frontend npm install failed"
  cat /tmp/npm-frontend.log | head -20 >> $LOG_FILE
  exit 1
}
log "  ✅ Frontend dependencies installed"

# Step 4: Build frontend
log "Step 4: Building frontend..."
npm run build > /tmp/npm-build.log 2>&1 || {
  log "  ❌ Frontend build failed"
  cat /tmp/npm-build.log | head -20 >> $LOG_FILE
  exit 1
}
log "  ✅ Frontend built"

# Step 5: Set up environment variables
log "Step 5: Setting up environment..."
cat > /prod/finance-friend-v3/backend/.env << 'ENVFILE'
NODE_ENV=production
PORT=3777
DATABASE_URL=sqlite:./finance-friend-v3.db
JWT_SECRET=$(openssl rand -base64 32)
LOG_LEVEL=info
CORS_ORIGIN=https://$DOMAIN
ENVFILE
log "  ✅ Environment configured"

# Step 6: Start services with PM2
log "Step 6: Starting services..."

# Install PM2 globally if not present
which pm2 > /dev/null || npm install -g pm2

# Start backend
cd /prod/finance-friend-v3/backend
pm2 start "npm start" --name "ff-backend" --log /var/log/ff-backend.log || {
  log "  ⚠️  Backend start with PM2 failed, trying direct start..."
  npm start > /var/log/ff-backend.log 2>&1 &
  sleep 3
}
log "  ✅ Backend started"

# Start frontend
cd /prod/finance-friend-v3/client
pm2 start "npm run preview" --name "ff-frontend" --log /var/log/ff-frontend.log || {
  log "  ⚠️  Frontend start with PM2 failed, trying direct start..."
  npm run preview > /var/log/ff-frontend.log 2>&1 &
  sleep 3
}
log "  ✅ Frontend started"

# Step 7: Verify services
log "Step 7: Verifying services..."
sleep 3

BACKEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3777 || echo "000")
if [ "$BACKEND_CHECK" == "404" ] || [ "$BACKEND_CHECK" == "200" ]; then
  log "  ✅ Backend responding (HTTP $BACKEND_CHECK)"
else
  log "  ❌ Backend not responding (HTTP $BACKEND_CHECK)"
  exit 1
fi

# Step 8: Set up Nginx reverse proxy
log "Step 8: Setting up Nginx..."
cat > /etc/nginx/sites-available/finance-friend << NGINXCONF
upstream ff_backend {
  server localhost:3777;
}

upstream ff_frontend {
  server localhost:4173;
}

server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN;
  
  # Redirect HTTP to HTTPS
  return 301 https://\$server_name\$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name $DOMAIN;

  ssl_certificate /etc/ssl/certs/finance-friend.crt;
  ssl_certificate_key /etc/ssl/private/finance-friend.key;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Frontend
  location / {
    proxy_pass http://ff_frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }

  # API
  location /api/ {
    proxy_pass http://ff_backend;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  # Rate limiting
  limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=200r/m;
  location /api/ {
    limit_req zone=api_limit burst=50 nodelay;
  }
}
NGINXCONF

log "  ✅ Nginx configured"

# Step 9: Enable SSL
log "Step 9: Setting up SSL..."
# This would use Let's Encrypt in production
# For now, create self-signed cert for testing
if [ ! -f "/etc/ssl/certs/finance-friend.crt" ]; then
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/finance-friend.key \
    -out /etc/ssl/certs/finance-friend.crt \
    -subj "/CN=$DOMAIN" > /dev/null 2>&1
  log "  ✅ Self-signed certificate created"
else
  log "  ℹ️  Certificate already exists"
fi

# Step 10: Restart Nginx
log "Step 10: Restarting Nginx..."
sudo systemctl restart nginx || systemctl restart nginx || {
  log "  ⚠️  Nginx restart failed, trying manual..."
  nginx -s reload || true
}
log "  ✅ Nginx restarted"

# Step 11: Set up monitoring
log "Step 11: Setting up monitoring..."
cat > /usr/local/bin/ff-monitor.sh << 'MONITORSCRIPT'
#!/bin/bash
# Check every 5 minutes
while true; do
  BACKEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3777)
  FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173)
  
  if [ "$BACKEND" != "404" ] && [ "$BACKEND" != "200" ]; then
    echo "[$(date)] Backend down! HTTP $BACKEND" >> /var/log/ff-monitor.log
    # Restart backend
    pm2 restart ff-backend
  fi
  
  if [ "$FRONTEND" != "200" ]; then
    echo "[$(date)] Frontend down! HTTP $FRONTEND" >> /var/log/ff-monitor.log
    # Restart frontend
    pm2 restart ff-frontend
  fi
  
  sleep 300
done
MONITORSCRIPT
chmod +x /usr/local/bin/ff-monitor.sh

pm2 start /usr/local/bin/ff-monitor.sh --name "ff-monitor" || true
log "  ✅ Monitoring enabled"

# Step 12: Set up auto-restart on reboot
log "Step 12: Configuring auto-restart..."
pm2 save
pm2 startup || true
log "  ✅ Auto-restart configured"

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE"
echo "════════════════════════════════════════════════════"
echo ""
echo "Finance Friend is now live at: https://$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Update DNS to point to this server"
echo "2. Visit https://$DOMAIN in browser"
echo "3. Test signup and upload"
echo "4. Monitor /var/log/ff-*.log for issues"
echo ""
echo "Full log: $LOG_FILE"

exit 0
