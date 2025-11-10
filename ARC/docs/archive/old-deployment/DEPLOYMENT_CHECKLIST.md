# Deployment Checklist - Action Items

## ✅ Pre-Deployment Checklist

### 1. Security Review ✅

- [x] **`.gitignore` verified**
  - [x] `.env` files excluded
  - [x] `service-account-key.json` excluded (in backend/.gitignore)
  - [x] `*.log` files excluded
  - [x] `config/master.key` excluded
  - [x] `tmp/` and `log/` directories excluded

- [x] **No secrets in code**
  - ✅ No API keys hardcoded
  - ✅ All secrets use environment variables
  - ✅ Test files use mock/test values only
  - ✅ Service account key file path references only (not actual keys)

### 2. Deployment Files ✅

- [x] **Procfile created** - `backend/Procfile` exists
  ```bash
  web: bundle exec puma -C config/puma.rb
  ```

- [x] **Production configuration**
  - ✅ `config/environments/production.rb` configured
  - ✅ `config/puma.rb` configured
  - ✅ Database configuration supports `DATABASE_URL`

### 3. Database Migrations ✅

- [x] **Migrations ready**
  - ✅ 13 migrations created
  - ✅ Schema file up to date
  - ✅ All tables defined

**Action needed:** Run migrations on Render after deployment

### 4. Code Implementation ✅

- [x] **Backend services implemented**
  - ✅ ImageProcessingService
  - ✅ ResearchService
  - ✅ GeminiLiveService
  - ✅ ImageUploadService (with env var support)

- [x] **Frontend integration**
  - ✅ Gemini Live WebSocket connection
  - ✅ Image upload and analysis
  - ✅ API service with authentication

### 5. Environment Variables Documentation

**Required for Render:**

#### Critical (Required)
- `RAILS_ENV=production`
- `SECRET_KEY_BASE` - ✅ You have this
- `JWT_SECRET_KEY` - ✅ You have this
- `DATABASE_URL` - ⚠️ Render will provide after creating PostgreSQL
- `GEMINI_API_KEY` - ✅ You have this
- `GOOGLE_CLOUD_PROJECT_ID` - ✅ You have this
- `GOOGLE_CLOUD_STORAGE_BUCKET` - ✅ You have this

#### Google Cloud Storage (Required)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - ⚠️ **ACTION NEEDED**
  - Copy entire content of `backend/config/service-account-key.json`
  - Paste as environment variable in Render
  - Format: Single line JSON (will be parsed by code)

#### Optional (Recommended)
- `REDIS_URL` - ⚠️ Render will provide if you create Redis instance
- `ADMIN_PASSWORD` - ✅ You have this
- `RAILS_MAX_THREADS=5`
- `RAILS_MIN_THREADS=5`
- `WEB_CONCURRENCY=2`

#### Optional (Future)
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_APPLICATION_ID`
- `SQUARE_LOCATION_ID`
- `DISCOGS_USER_TOKEN`

---

## 🚀 Deployment Steps

### Step 1: Final Security Check ✅

**Completed:**
- ✅ No secrets in code
- ✅ `.gitignore` properly configured
- ✅ All sensitive files excluded

**Action:** Verify one more time before pushing:
```bash
# Check what will be committed
git status
```

### Step 2: Initialize Git Repository (if not done)

```bash
# If not already initialized
git init
git branch -M main

# Add all files
git add .

# Verify .env and service-account-key.json are NOT included
git status | grep -E "\.env|service-account-key"

# Commit
git commit -m "feat: initial deployment setup with Procfile and service integration"
```

### Step 3: Create GitHub Repository

1. Go to GitHub and create new repository
2. **DO NOT** initialize with README, .gitignore, or license
3. Copy the repository URL

### Step 4: Push to GitHub

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 5: Render.com Setup

#### 5.1 Create PostgreSQL Database
1. Go to Render Dashboard → New → PostgreSQL
2. Create database
3. **Copy `DATABASE_URL`** - You'll need this

#### 5.2 Create Redis Instance (Optional, for Sidekiq)
1. Go to Render Dashboard → New → Redis
2. Create Redis instance
3. **Copy `REDIS_URL`** - You'll need this

#### 5.3 Create Web Service (Rails Backend)
1. Go to Render Dashboard → New → Web Service
2. Connect to your GitHub repository
3. Configure:
   - **Name:** `bootiehunter-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Ruby`
   - **Build Command:** `bundle install`
   - **Start Command:** (from Procfile - will auto-detect)
   - **Region:** Choose closest to you

#### 5.4 Set Environment Variables in Render

**In Render Web Service → Environment:**

1. **Critical Variables:**
   ```
   RAILS_ENV=production
   SECRET_KEY_BASE=<your-secret-key-base>
   JWT_SECRET_KEY=<your-jwt-secret>
   DATABASE_URL=<from-postgresql-service>
   GEMINI_API_KEY=<your-gemini-key>
   GOOGLE_CLOUD_PROJECT_ID=<your-project-id>
   GOOGLE_CLOUD_STORAGE_BUCKET=<your-bucket-name>
   ```

2. **Service Account Key (IMPORTANT):**
   - Variable name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: **Entire JSON content** from `backend/config/service-account-key.json`
   - Format: Single line (remove all line breaks)
   - Example: `{"type":"service_account","project_id":"..."}`

3. **Optional Variables:**
   ```
   REDIS_URL=<from-redis-service>
   ADMIN_PASSWORD=<your-admin-password>
   RAILS_MAX_THREADS=5
   RAILS_MIN_THREADS=5
   WEB_CONCURRENCY=2
   ```

#### 5.5 Enable Auto-Deploy
- ✅ Enable "Auto-Deploy" in Render
- ✅ Set branch to `main` (or `master`)

#### 5.6 Deploy!
- Click "Create Web Service"
- Render will:
  1. Clone your repo
  2. Run `bundle install`
  3. Run database migrations (if configured)
  4. Start the server

### Step 6: Verify Deployment

1. **Check Build Logs**
   - Look for any errors during `bundle install`
   - Verify migrations run successfully

2. **Check Runtime Logs**
   - Look for server startup messages
   - Check for any runtime errors

3. **Test Health Endpoint**
   ```bash
   curl https://your-app.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

4. **Test API Endpoint**
   ```bash
   curl https://your-app.onrender.com/api/v1/health
   ```
   Should return: `{"status":"ok"}`

---

## ⚠️ Known Issues & Fixes

### Issue 1: Service Account Key Format
**Problem:** Multi-line JSON in environment variable
**Solution:** Remove all line breaks, paste as single line

### Issue 2: Database Migrations
**Problem:** Migrations not running automatically
**Solution:** Add to Render build command:
```bash
bundle install && bundle exec rails db:migrate
```

### Issue 3: Port Configuration
**Problem:** Rails trying to use port 3000
**Solution:** Already handled - Puma uses `ENV['PORT']` which Render provides

### Issue 4: Static Files
**Problem:** Assets not compiled
**Solution:** Render will compile if needed, but not required for API-only backend

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Verify health endpoint works
- [ ] Test API authentication
- [ ] Test image upload
- [ ] Test Gemini Live session creation
- [ ] Monitor logs for errors
- [ ] Set up monitoring/alerts (optional)
- [ ] Document production URL

---

## 🎯 Current Status

**Ready for GitHub Push:** ✅ YES
**Ready for Render Deployment:** ✅ YES (after GitHub push)

**Remaining Actions:**
1. ✅ Verify .gitignore (DONE)
2. ✅ Create Procfile (DONE)
3. ✅ Verify no secrets in code (DONE)
4. ⚠️ Prepare service account JSON for Render (ACTION NEEDED)
5. ⚠️ Set up GitHub repository
6. ⚠️ Push to GitHub
7. ⚠️ Configure Render services
8. ⚠️ Set environment variables in Render
9. ⚠️ Deploy!

---

## 📚 Additional Resources

- [Render Rails Deployment Guide](https://render.com/docs/deploy-rails)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) - Full deployment guide


