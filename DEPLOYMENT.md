# Deployment Guide for Missed-Opportunity Agent

## 🚀 Quick Start

### 1. Local Development Setup

```bash
# Clone repository
git clone https://github.com/himanshudangwal16-Gemini/Missed-Opportunity-Agent-Personal-and-Office-work-.git
cd Missed-Opportunity-Agent-Personal-and-Office-work-

# Make scripts executable
chmod +x setup.sh dev.sh build.sh

# Run setup
./setup.sh

# Add your GEMINI_API_KEY
nano .env.local
# Update GEMINI_API_KEY=your_actual_key_here

# Start development server
./dev.sh
# or
npm run dev
```

**Access:** http://localhost:3000

---

## 🐳 Docker Development

### Using Docker Compose (Recommended)

```bash
# Build and start services
docker-compose up --build

# In another terminal, view logs
docker-compose logs -f app
```

**Access:** http://localhost:3000

### Using Docker Directly

```bash
# Build image
docker build -t missed-opportunity-agent:latest .

# Run container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  -e NODE_ENV=production \
  missed-opportunity-agent:latest
```

---

## 📦 Production Build

```bash
# Using build script (recommended)
chmod +x build.sh
./build.sh

# Or manually
npm ci --omit=dev
npm run build
npm start
```

**Output Directory:** `dist/`

---

## ☁️ Deployment Platforms

### Option 1: Vercel (Recommended for Full-Stack)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and set environment variables
```

**Environment Variables in Vercel Dashboard:**
- `GEMINI_API_KEY` = your_key
- `PORT` = 3000 (optional)

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 3: Google Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/missed-opportunity-agent

# Deploy
gcloud run deploy missed-opportunity-agent \
  --image gcr.io/YOUR_PROJECT_ID/missed-opportunity-agent \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your_key
```

### Option 4: Railway.app

```bash
# Connect GitHub repository at https://railway.app
# Add environment variables in dashboard:
# - GEMINI_API_KEY
# - PORT=3000

# Deploy automatically on push to main
```

### Option 5: Render

```bash
# Push to GitHub
git push origin main

# Create new Web Service at https://render.com
# Connect GitHub repository
# Set environment variables:
# - GEMINI_API_KEY
# - PORT=3000
# Build command: npm install && npm run build
# Start command: npm start
```

---

## 📋 Environment Variables Checklist

**Required:**
- [ ] `GEMINI_API_KEY` - Your Google Gemini API key

**Optional:**
- [ ] `PORT` - Server port (default: 3000)
- [ ] `NODE_ENV` - development/production
- [ ] `APP_URL` - Full application URL for production

---

## ✅ Health Check

After deployment, verify the application is running:

```bash
# Local
curl http://localhost:3000/api/health

# Remote (replace with your domain)
curl https://your-app-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-07T10:30:00Z",
  "hasGeminiKey": true
}
```

---

## 🔍 Troubleshooting

### App starts but API returns errors

1. **Check GEMINI_API_KEY:**
   ```bash
   echo $GEMINI_API_KEY
   ```

2. **Verify environment in deployment:**
   - Platform dashboard → Settings → Environment Variables

3. **Check logs:**
   ```bash
   # Vercel
   vercel logs

   # Heroku
   heroku logs --tail

   # Cloud Run
   gcloud run logs read SERVICE_NAME
   ```

### Build fails

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Port already in use

```bash
# Change port
PORT=3001 npm run dev

# Or kill process using port
lsof -ti:3000 | xargs kill -9
```

---

## 🚀 CI/CD with GitHub Actions

The `.github/workflows/build-deploy.yml` automatically:
- ✅ Runs on every push to main
- ✅ Tests with Node 18 and 20
- ✅ Type-checks TypeScript
- ✅ Builds production bundle
- ✅ Uploads artifacts

---

## 📊 Monitoring & Logs

### View Real-Time Logs

```bash
# Local
npm run dev    # Shows all logs in terminal

# Docker
docker-compose logs -f app

# Cloud platforms have their own log viewers
```

### Key Log Messages

- ✅ `Missed-Opportunity Agent server live on port 3000` - Server started
- ⚠️ `GEMINI_API_KEY is not defined` - Using mock mode
- ❌ `FATAL: Failed to initiate server` - Fatal error

---

## 🔐 Security Checklist

- [ ] `GEMINI_API_KEY` stored as environment variable (NOT in code)
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enabled on production
- [ ] API key rotated periodically
- [ ] No secrets in git history

---

## 📞 Support

- 📚 Full README: See README.md
- 🐛 Issues: GitHub Issues
- 💬 Questions: GitHub Discussions
- 📧 Email: Contact repository owner

---

## 🎯 Next Steps

1. ✅ Choose your deployment platform
2. ✅ Set up environment variables
3. ✅ Deploy!
4. ✅ Test `/api/health` endpoint
5. ✅ Monitor logs
6. ✅ Share your app!
