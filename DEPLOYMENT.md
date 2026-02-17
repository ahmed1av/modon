# 🚀 DEPLOYMENT GUIDE - MODON EVOLUTIO

## Quick Deploy Commands

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

**Set Environment Variables in Vercel:**

1. Go to Project Settings → Environment Variables
2. Add the following:

```
NEXT_PUBLIC_SITE_URL=https://modonevolutio.com
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>
NEXT_PUBLIC_WHATSAPP_NUMBER=201070058019
```

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

**Set Environment Variables in Netlify:**

1. Site Settings → Environment Variables
2. Add the same variables as Vercel

---

### Option 3: Custom VPS/Server

**Requirements:**

- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

**Deploy Steps:**

1. **Install Node.js** (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

1. **Install PM2**

```bash
sudo npm install -g pm2
```

1. **Upload Project**

```bash
# Use Git (recommended)
git clone <your-repo-url> /var/www/modon
cd /var/www/modon

# Or use SCP/SFTP to upload files
```

1. **Set Environment Variables**

```bash
# Create .env.production file
nano .env.production
```

Add:

```env
NEXT_PUBLIC_SITE_URL=https://modonevolutio.com
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>
NEXT_PUBLIC_WHATSAPP_NUMBER=201070058019
NODE_ENV=production
```

1. **Install Dependencies & Build**

```bash
npm ci
npm run build
```

1. **Start with PM2**

```bash
pm2 start npm --name "modon-evolutio" -- start
pm2 save
pm2 startup
```

1. **Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/modonevolutio.com
```

Add:

```nginx
server {
    listen 80;
    server_name modonevolutio.com www.modonevolutio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

1. **Enable Site & SSL**

```bash
sudo ln -s /etc/nginx/sites-available/modonevolutio.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d modonevolutio.com -d www.modonevolutio.com
```

---

## Post-Deployment Checklist

### Immediate Tests

```bash
# Test production build locally first
npm run build
npm run start
# Visit http://localhost:3000
```

### After Deploy

- [ ] Visit <https://modonevolutio.com>
- [ ] Test WhatsApp widget
- [ ] Check all social links
- [ ] Verify phone click-to-call
- [ ] Test 404 page: visit `/this-does-not-exist`
- [ ] Check `/sitemap.xml`
- [ ] Check `/robots.txt`
- [ ] Test property pages
- [ ] Verify images load

### SEO Setup

```bash
# Submit to Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: https://modonevolutio.com
3. Verify ownership (DNS or HTML tag)
4. Submit sitemap: https://modonevolutio.com/sitemap.xml
```

---

## Monitoring & Maintenance

### PM2 Commands (if using custom server)

```bash
# View logs
pm2 logs modon-evolutio

# Restart app
pm2 restart modon-evolutio

# Stop app
pm2 stop modon-evolutio

# Monitor performance
pm2 monit

# View status
pm2 status
```

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild
npm ci
npm run build

# Restart
pm2 restart modon-evolutio
```

---

## Analytics Setup (Optional)

### Google Analytics

1. Create GA4 property at <https://analytics.google.com>
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables:

   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. Redeploy

### Facebook Pixel (Optional)

1. Create pixel at <https://business.facebook.com>
2. Add pixel code to `/src/app/[lang]/layout.tsx`

---

## Domain Configuration

### DNS Settings

Point your domain to your hosting:

**For Vercel:**

```
A Record: 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

**For Netlify:**

```
CNAME: @ → <your-site>.netlify.app
CNAME: www → <your-site>.netlify.app
```

**For Custom Server:**

```
A Record: @ → <your-server-ip>
CNAME: www → modonevolutio.com
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Images Not Loading

- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `next.config.mjs` has correct domains
- Check Supabase storage permissions

### Sitemap Empty

- Ensure Supabase credentials are set in production
- Check sitemap generation logs
- Verify `NEXT_PUBLIC_SITE_URL` is correct

---

## Performance Optimization

### Enable Caching (Nginx)

Already included in the Nginx config above.

### CDN (Optional)

Consider using Cloudflare for:

- DDoS protection
- CDN caching
- SSL
- Analytics

Setup:

1. Add site to Cloudflare
2. Update nameservers
3. Enable "Auto Minify" for JS, CSS, HTML
4. Set SSL to "Full (strict)"

---

## Backup Strategy

### Database (Supabase)

- Automatic backups included in Supabase
- Can export manually from Dashboard

### Code

- Keep Git repository updated
- Push to GitHub/GitLab/Bitbucket

### Media Files

- Supabase storage has built-in redundancy
- Consider periodic exports for critical files

---

## 🎯 GO LIVE

**Your deployment is ready. Choose your platform and deploy!**

Need help? Contact: +20 107 005 8019

---

*Last Updated: 2026-02-04*  
*Version: 1.0.0*
