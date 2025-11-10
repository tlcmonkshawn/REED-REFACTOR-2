# Deployment Readiness Checklist

## Status: 🟡 **ALMOST READY** - Some files needed before deployment

---

## ✅ **What's Complete**

### Code Implementation
- ✅ Backend Rails application structure
- ✅ Frontend Flutter application structure
- ✅ Database migrations created
- ✅ Models, controllers, services implemented
- ✅ API endpoints defined
- ✅ Gemini Live API WebSocket integration
- ✅ Image upload and processing services
- ✅ Authentication system (JWT-based)
- ✅ Core services (ImageProcessing, Research, GeminiLive)

### Configuration
- ✅ Database configuration (production-ready)
- ✅ Environment variable setup
- ✅ `.gitignore` configured (excludes `.env` and secrets)
- ✅ CORS configured for API access
- ✅ Gemfile and dependencies locked

### Documentation
- ✅ Comprehensive documentation
- ✅ API documentation
- ✅ Architecture documentation
- ✅ Setup guides

---

## ⚠️ **What's Missing/Needs Review**

### 1. **Render.com Deployment Files** ❌

**Missing:**
- `Procfile` - Tells Render how to start the Rails server
- `render.yaml` (optional) - For Infrastructure as Code deployment

**Create `Procfile` in `backend/` directory:**
```
web: bundle exec puma -C config/puma.rb
```

### 2. **Production Environment Variables** ⚠️

**Need to set in Render Dashboard:**
- `GEMINI_API_KEY` - ✅ You have this (from INSTALL_HISTORY.md)
- `SECRET_KEY_BASE` - ✅ You have this (from INSTALL_HISTORY.md)
- `JWT_SECRET_KEY` - ✅ You have this (from INSTALL_HISTORY.md)
- `DATABASE_URL` - ⚠️ Render will provide this when you create PostgreSQL database
- `RAILS_ENV=production`
- `RAILS_MASTER_KEY` - ⚠️ Need to generate if using encrypted credentials
- `GOOGLE_CLOUD_PROJECT_ID` - ✅ You have this
- `GOOGLE_CLOUD_STORAGE_BUCKET` - ✅ You have this
- `GOOGLE_CLOUD_CREDENTIALS_PATH` - ⚠️ Need to upload service account key or use environment variable
- `REDIS_URL` - ⚠️ Render will provide if you create Redis instance
- `ADMIN_PASSWORD` - ✅ You have this

### 3. **Google Cloud Service Account Key** ⚠️

**Issue:** `backend/config/service-account-key.json` is in `.gitignore` (good!), but:
- ⚠️ **NOT SAFE** to commit to git even if not ignored
- ⚠️ Need to upload to Render as environment variable or use Google Cloud IAM

**Options:**
1. **Recommended:** Upload service account JSON content as environment variable in Render
   - Set `GOOGLE_APPLICATION_CREDENTIALS_JSON` as environment variable with full JSON content
   - Modify code to read from environment variable instead of file

2. **Alternative:** Use Render's file system and upload the file during deployment
   - Not recommended for security reasons

### 4. **Database Migrations** ⚠️

**Check:** Need to verify all migrations run successfully
- Run `rails db:migrate` in production mode before deployment
- Render will run migrations automatically if configured

### 5. **Build Commands** ⚠️

**Render needs to know:**
- Build command: `bundle install && bundle exec rails assets:precompile`
- Start command: Already defined in `Procfile`

### 6. **Flutter Web Build** ❌

**For frontend deployment:**
- Need to build Flutter web app
- Build command: `cd frontend && flutter build web`
- Output directory: `frontend/build/web`
- Need to serve static files (could be separate Render service or CDN)

**Options:**
1. Serve from Rails (add route to serve static files)
2. Deploy as separate Render Static Site
3. Use CDN (Cloudflare, etc.)

### 7. **Health Check Endpoint** ✅

**Status:** Already exists at `/health` endpoint

### 8. **GitHub Repository Setup** ⚠️

**Need to verify:**
- Repository initialized
- All code committed (except secrets)
- `.gitignore` properly excludes sensitive files
- Branch strategy (main/master branch)

---

## 📋 **Pre-Deployment Checklist**

### Before First Push to GitHub:

- [ ] **Review `.gitignore`** - Ensure all secrets excluded
  - [x] `.env` files
  - [x] `service-account-key.json`
  - [x] `*.log` files
  - [x] `config/master.key`

- [ ] **Create `Procfile`** - Required for Render
  ```bash
  # backend/Procfile
  web: bundle exec puma -C config/puma.rb
  ```

- [ ] **Verify no secrets in code** - Search for:
  - API keys
  - Passwords
  - Secret keys
  - Database credentials

- [ ] **Test database migrations locally**
  ```bash
  cd backend
  RAILS_ENV=production rails db:migrate:status
  ```

- [ ] **Prepare environment variables list** - Document all needed variables

### Before Render Deployment:

- [ ] **Create Render PostgreSQL Database**
  - Render will provide `DATABASE_URL`

- [ ] **Create Render Redis Instance** (if using Sidekiq)
  - Render will provide `REDIS_URL`

- [ ] **Set all environment variables in Render Dashboard**
  - Copy from your local `.env` file
  - **DO NOT** commit `.env` file to git

- [ ] **Handle Google Cloud Service Account Key**
  - Option 1: Upload JSON content as environment variable
  - Option 2: Modify code to use environment variable instead of file

- [ ] **Configure Build & Start Commands in Render**
  - Build: `bundle install`
  - Start: (from Procfile)

- [ ] **Configure Auto-Deploy from GitHub**
  - Connect GitHub repository
  - Set branch (usually `main` or `master`)
  - Enable auto-deploy

---

## 🚀 **Deployment Steps**

### Step 1: Create Procfile
```bash
# Create backend/Procfile
echo "web: bundle exec puma -C config/puma.rb" > backend/Procfile
```

### Step 2: Push to GitHub
```bash
git init  # if not already initialized
git add .
git commit -m "feat: initial deployment setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 3: Create Render Services
1. **Create PostgreSQL Database** in Render
   - Note the `DATABASE_URL` provided

2. **Create Redis Instance** (optional, for Sidekiq)
   - Note the `REDIS_URL` provided

3. **Create Web Service** (Rails Backend)
   - Connect to GitHub repository
   - Root directory: `backend`
   - Build command: `bundle install`
   - Start command: (from Procfile)
   - Environment: `Ruby`
   - Add all environment variables

4. **Create Static Site** (Flutter Frontend) - Optional
   - Root directory: `frontend`
   - Build command: `flutter build web`
   - Publish directory: `build/web`

### Step 4: Set Environment Variables in Render
Copy all variables from your local `.env` file, plus:
- `DATABASE_URL` (from Render PostgreSQL)
- `REDIS_URL` (from Render Redis, if created)
- `RAILS_ENV=production`
- `RAILS_MASTER_KEY` (if using encrypted credentials)

### Step 5: Deploy
- Render will automatically deploy when you push to connected branch
- Or manually trigger deployment from Render dashboard

---

## ⚡ **Quick Fixes Needed**

### 1. Create Procfile (REQUIRED)
```bash
# backend/Procfile
web: bundle exec puma -C config/puma.rb
```

### 2. Handle Service Account Key
**Option A:** Modify to use environment variable (recommended)
- Create env var: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Modify `ImageUploadService` to read from env var if file doesn't exist

**Option B:** Upload file during deployment
- Use Render's file system
- Less secure, not recommended

### 3. Flutter Build Configuration
- Decide how to serve Flutter web app
- Create build script if needed

---

## ✅ **Ready Status**

**Current Status:** 🟡 **90% Ready**

**Missing Critical Items:**
1. ❌ `Procfile` (5 minutes to create)
2. ⚠️ Service account key handling (30 minutes)
3. ⚠️ Flutter deployment strategy (1 hour)

**Estimated Time to Full Readiness:** ~2 hours

---

## 📝 **Notes**

- **Never commit secrets** - All API keys, passwords, and service account keys must be environment variables
- **Test locally first** - Run `RAILS_ENV=production rails server` locally to catch issues
- **Monitor logs** - Render provides logs for debugging
- **Database migrations** - Run automatically on first deployment if configured
- **Health checks** - Render will ping `/health` endpoint to verify service is running

---

## 🔗 **Resources**

- [Render Rails Deployment Guide](https://render.com/docs/deploy-rails)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Flutter Web Deployment](https://docs.flutter.dev/deployment/web)
