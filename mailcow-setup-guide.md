# Mailcow Deployment Guide
## We Prosper AI Team Email Infrastructure
**Target:** Hetzner CX32 (4 vCPU, 8GB RAM)  
**Domain:** we-prosper-ai.com  
**Timeline:** ~2 hours setup + 48h for DNS propagation  

---

## Pre-Deployment Checklist

- [ ] **Hetzner CX32 ordered** with Ubuntu 22.04 LTS
- [ ] **Static IPv4 assigned** and confirmed
- [ ] **Reverse DNS (rDNS) configured** (point to mail.we-prosper-ai.com)
- [ ] **Domain we-prosper-ai.com** registered and access available
- [ ] **Port 25 unblock requested** from Hetzner (do after first invoice, takes 24-48h)
- [ ] **SSH key pair** generated for server access
- [ ] **Backup plan:** Hetzner Spaces (S3-compatible) account ready

---

## Step 1: Server Preparation (15 min)

### SSH into your new Hetzner VPS
```bash
ssh -i ~/.ssh/hetzner_key root@<your-vps-ip>
```

### Update system
```bash
apt update && apt upgrade -y
apt install -y curl wget git
```

### Set hostname
```bash
hostnamectl set-hostname mail.we-prosper-ai.com
echo "127.0.0.1 mail.we-prosper-ai.com" >> /etc/hosts
```

### Verify reverse DNS is working
```bash
hostname -f  # Should return mail.we-prosper-ai.com
```

---

## Step 2: Install Docker & Docker Compose (10 min)

### Install Docker
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt update && apt install -y docker-ce docker-ce-cli containerd.io
```

### Install Docker Compose
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version  # Verify
```

### Start Docker
```bash
systemctl start docker && systemctl enable docker
```

---

## Step 3: Clone & Configure Mailcow (20 min)

### Clone Mailcow repository
```bash
cd /opt
git clone https://github.com/mailcow/mailcow-dockerized.git
cd mailcow-dockerized
```

### Generate configuration
```bash
./generate_config.sh
```

**During setup, answer:**
- **Hostname:** `mail.we-prosper-ai.com`
- **TLS certificate:** `Auto (Let's Encrypt)`
- **Database password:** Generate strong password (copy to secure location)
- **Mailcow admin password:** Generate strong password (copy to secure location)
- **Admin email:** `admin@we-prosper-ai.com`

### Review generated config
```bash
cat mailcow.conf | grep -E "^HOSTNAME|^TZ|^COMPOSE_PROJECT_NAME"
```

Expected output:
```
HOSTNAME=mail.we-prosper-ai.com
TZ=America/Adak
COMPOSE_PROJECT_NAME=mailcow-dockerized
```

### Pull Docker images (5 min - can run in background)
```bash
docker-compose pull
```

---

## Step 4: DNS Records Setup (Before Launch)

### Get your server's IPv4
```bash
curl -s https://api.ipify.org
```

### Add to we-prosper-ai.com DNS provider (Cloudflare, Route53, etc.):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `mail` | `<your-vps-ipv4>` | 3600 |
| **MX** | `@` (root) | `mail.we-prosper-ai.com.` | 3600 |
| **SPF** | `@` (root) | `v=spf1 mx -all` | 3600 |
| **DKIM** | `default._domainkey` | *See Step 5 below* | 3600 |
| **DMARC** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@we-prosper-ai.com` | 3600 |

**Wait for MX propagation** before starting mailcow (usually 30 min - 2 hours)

### Check MX propagation
```bash
nslookup -type=MX we-prosper-ai.com
# Should return: we-prosper-ai.com mail exchanger = mail.we-prosper-ai.com.
```

---

## Step 5: Start Mailcow (30 min)

### Launch containers
```bash
cd /opt/mailcow-dockerized
docker-compose up -d
```

### Wait for startup (watch logs)
```bash
docker-compose logs -f
# Watch for "Mailcow is running" message
# Takes ~5-10 minutes for all services to initialize
```

### Access admin panel
```
https://mail.we-prosper-ai.com/admin
Login: admin
Password: <from config setup>
```

### Verify services are running
```bash
docker-compose ps
# All containers should show "Up" status
```

---

## Step 6: Auto-Generated DKIM Setup (5 min)

### Access admin panel
```
https://mail.we-prosper-ai.com/admin
→ Configuration
→ Domains
→ we-prosper-ai.com
→ DKIM
```

### Copy DKIM public key
Mailcow auto-generates it. Copy the full `default._domainkey.we-prosper-ai.com TXT` value.

### Add to DNS
```
Name: default._domainkey.we-prosper-ai.com
Type: TXT
Value: v=DKIM1; k=rsa; p=<long-key-from-mailcow>
TTL: 3600
```

### Verify DKIM
```bash
# From server
dig default._domainkey.we-prosper-ai.com TXT
# Should return the TXT record
```

---

## Step 7: Create Team Users (10 min)

### Via Admin Panel
```
https://mail.we-prosper-ai.com/admin
→ Users
→ Add User
```

**Create:**
- `tina@we-prosper-ai.com`
- `caleb@we-prosper-ai.com`
- `alethea@we-prosper-ai.com`
- `moriah@we-prosper-ai.com`
- Any other team members

### Set mailbox quotas
- Tina: 10GB
- Others: 5GB each
- (Adjust based on team size)

### Enable 2FA for admins
- Admin panel → Users → [user] → Add TOTP 2FA

---

## Step 8: Create Mailing Lists (Optional - 5 min)

### Via Admin Panel
```
https://mail.we-prosper-ai.com/admin
→ Mailing Lists
→ Add Mailing List
```

**Suggested lists:**
- `team@we-prosper-ai.com` → all team members
- `ops@we-prosper-ai.com` → Tina + Caleb
- `agents@we-prosper-ai.com` → all agents

---

## Step 9: Request Port 25 Unblock (Critical!)

### After first invoice arrives (usually 24h):
1. Login to Hetzner console
2. Open support ticket: "Request port 25 (SMTP) unblock for mail server"
3. Include hostname: `mail.we-prosper-ai.com`
4. Typical response time: 24-48 hours

### Verify port 25 is open
```bash
# After unblock approval
telnet mail.we-prosper-ai.com 25
# Should connect (press Ctrl+C to exit)
```

---

## Step 10: Backup Configuration (5 min)

### Create S3 bucket (Hetzner Spaces)
```bash
# Via Hetzner console:
# Create "we-prosper-ai-backups" Spaces bucket
```

### Enable automatic backups
```bash
# Add to docker-compose.override.yml or modify mailcow config
# Schedule daily backups to S3
```

### Manual backup (test it works)
```bash
cd /opt/mailcow-dockerized
./backup_mailcow.sh
# Output will be in ./backups/
```

---

## Step 11: Migration from Google Workspace (If Needed)

### Using IMAP Migration Tool
```
https://mail.we-prosper-ai.com/admin
→ Tools
→ Migrate Email
```

**Or manually via Gmail settings:**
1. In Gmail: Settings → Forwarding and POP/IMAP → Enable IMAP
2. Create app password (not regular password)
3. In Mailcow: Use IMAP migration tool with app password
4. Select which labels/folders to migrate

### Change MX records when ready
```
Old: points to google (if using Google Workspace)
New: points to mail.we-prosper-ai.com
```

**Warning:** Do this on a weekend or off-hours. Mail delivery may be interrupted during transition.

---

## Step 12: Test Email Delivery

### Send test email
```bash
# From server, send to external address
echo "Test message" | mail -s "Mailcow Test" your-external-email@gmail.com
```

### Check for issues
```
https://mail.we-prosper-ai.com/admin
→ Tools
→ Logs
```

### Test SPF/DKIM/DMARC
```bash
# External tool: mxtoolbox.com
# Enter: mail.we-prosper-ai.com
# Check: MX, SPF, DKIM, DMARC validation
```

---

## Post-Launch Maintenance

### Weekly
- Check admin panel for errors (Tools → Logs)
- Verify backups are completing

### Monthly
- Review spam statistics (Configuration → Spam & Virus)
- Update Docker images: `docker-compose pull && docker-compose up -d`

### Quarterly
- Test backup restoration (critical!)
- Review user activity logs

---

## Troubleshooting

### Containers keep restarting
```bash
docker-compose logs -f | grep ERROR
# Usually database or permission issue
```

### Email not delivering
```bash
# Check:
1. Port 25 unblock status (Hetzner)
2. MX record propagation: nslookup -type=MX we-prosper-ai.com
3. SPF/DKIM/DMARC validation: mxtoolbox.com
4. Logs: https://mail.we-prosper-ai.com/admin → Tools → Logs
```

### High memory usage
```bash
# Mailcow is running with all features. Disable if needed:
# - ClamAV (antivirus): edit docker-compose.yml, comment out clamd
# - SOGo (calendar): edit docker-compose.yml, comment out sogo
docker-compose up -d  # Restart after edits
```

### Webmail not accessible
```bash
# Check nginx logs
docker-compose logs nginx | grep ERROR
# Usually certificate issue or port conflict
```

---

## URLs & Access

| Service | URL | Login |
|---------|-----|-------|
| **Admin Panel** | https://mail.we-prosper-ai.com/admin | admin / [password] |
| **Webmail (Roundcube)** | https://mail.we-prosper-ai.com/mail | email@we-prosper-ai.com / password |
| **Calendar/Contacts (SOGo)** | https://mail.we-prosper-ai.com/sogo | email@we-prosper-ai.com / password |
| **Mobile (IMAP)** | imap.mail.we-prosper-ai.com:993 (SSL) | email@we-prosper-ai.com / password |
| **Mobile (SMTP)** | smtp.mail.we-prosper-ai.com:587 (TLS) | email@we-prosper-ai.com / password |

---

## Security Checklist

- [ ] 2FA enabled for admin account
- [ ] Admin password is strong & saved securely
- [ ] Database password is strong & saved securely
- [ ] Reverse DNS configured correctly
- [ ] Port 25 unblocked from Hetzner
- [ ] SPF/DKIM/DMARC records set and verified
- [ ] Backups tested (can restore from backup)
- [ ] Firewall rules: only ports 80, 443, 25, 587, 993, 143 open
- [ ] SSL certificate auto-renewing (Let's Encrypt)

---

## Support & Documentation

- **Official Docs:** https://docs.mailcow.email/
- **Community:** https://github.com/mailcow/mailcow-dockerized/discussions
- **We Prosper AI Team:** Check moriah-log for deployment notes

---

**Setup Date:** [fill in when deployed]  
**Admin Email:** admin@we-prosper-ai.com  
**Backup Location:** Hetzner Spaces / we-prosper-ai-backups  
**Deployed by:** [team member name]  
**Last updated:** March 20, 2026  
