# AiraPropFirm — EC2 Self-Hosted Deployment

## Stack
- **Frontend**: React (Vite) → builds to static files
- **Backend**: Express.js + SQLite + JWT auth
- **Email**: Gmail SMTP (nodemailer)
- **Server**: Runs on EC2, served by Express on port 4000
- **No Firebase. No Vercel. Everything on your EC2.**

---

## Quick Deploy (copy-paste these on your EC2)

### 1. Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
node -v && npm -v
```

### 2. Go to project folder & install
```bash
cd ~/AIRA/airapropfirm
npm install
```

### 3. Create your .env file
```bash
cp .env.example .env
nano .env
```

Fill in these values:
```
PORT=4000
JWT_SECRET=put_a_long_random_string_here_64_chars_minimum
ADMIN_EMAIL=shravanbachu@gmail.com
ADMIN_PASSWORD=Aira@2026
GMAIL_USER=shravanbachu@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
SITE_URL=http://YOUR_EC2_PUBLIC_IP:4000
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification if not already
3. Generate an App Password → copy the 16 chars

### 4. Build frontend + start server
```bash
npm run build
node server/index.js
```

You should see:
```
✓ Admin user created
✓ Email service ready
🚀 AiraPropFirm running on port 4000
```

### 5. Open in browser
```
http://YOUR_EC2_PUBLIC_IP:4000
```

Make sure port 4000 is open in your EC2 Security Group:
- Go to AWS Console → EC2 → Security Groups
- Add inbound rule: TCP 4000 from 0.0.0.0/0

---

## Run in background (production)

### Option A: PM2 (recommended)
```bash
sudo npm install -g pm2
pm2 start server/index.js --name airapropfirm
pm2 save
pm2 startup
```

### Option B: systemd service
```bash
sudo nano /etc/systemd/system/airapropfirm.service
```

Paste:
```ini
[Unit]
Description=AiraPropFirm
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/AIRA/airapropfirm
ExecStart=/usr/bin/node server/index.js
Restart=always
EnvironmentFile=/home/ubuntu/AIRA/airapropfirm/.env

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable airapropfirm
sudo systemctl start airapropfirm
sudo systemctl status airapropfirm
```

---

## Connect Domain (airapropfirm.com)

### With Nginx reverse proxy (recommended for domain + SSL):
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Create nginx config:
```bash
sudo nano /etc/nginx/sites-available/airapropfirm
```

Paste:
```nginx
server {
    listen 80;
    server_name airapropfirm.com www.airapropfirm.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/airapropfirm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d airapropfirm.com -d www.airapropfirm.com
```

Then update your .env:
```
SITE_URL=https://airapropfirm.com
```

And point your domain's DNS to your EC2 public IP:
- A record: airapropfirm.com → YOUR_EC2_IP
- A record: www.airapropfirm.com → YOUR_EC2_IP

---

## File Structure
```
airapropfirm/
├── server/
│   ├── index.js       ← Express server (auth + admin + serves frontend)
│   ├── db.js          ← SQLite database
│   └── email.js       ← Gmail SMTP email templates
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx
│   │   ├── Dashboard.jsx      ← Full prop firm website
│   │   ├── ForgotPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── SharedUI.jsx
│   ├── lib/
│   │   └── api.js     ← Frontend API client
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── data/              ← Auto-created, holds SQLite DB
├── dist/              ← Auto-created by npm run build
├── .env               ← Your secrets (never commit)
├── .env.example
├── package.json
└── README.md
```

## Admin Login
- Email: shravanbachu@gmail.com
- Password: Aira@2026
