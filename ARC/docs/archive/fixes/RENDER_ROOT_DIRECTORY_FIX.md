# Render Root Directory Fix

## 🚨 Problem

**Error:** `Could not locate Gemfile`

**Cause:** Render is looking for `Gemfile` in the repository root, but it's actually in the `backend/` directory.

## ✅ Solution

### In Render Dashboard:

1. Go to your Render Web Service
2. Click **"Settings"** tab
3. Find **"Root Directory"** setting
4. Set it to: `backend`
5. Save changes
6. Render will automatically redeploy

### Alternative: Create render.yaml (Infrastructure as Code)

Create `render.yaml` in repository root:

```yaml
services:
  - type: web
    name: bootiehunter-backend
    env: ruby
    rootDir: backend
    buildCommand: bundle install && bundle exec rails db:migrate
    startCommand: bundle exec puma -C config/puma.rb
    envVars:
      - key: RAILS_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: bootiehunter-database
          property: connectionString
      # Add other environment variables here
```

## 📋 Quick Fix Steps

1. **Render Dashboard → Your Service → Settings**
2. **Set Root Directory:** `backend`
3. **Save**
4. **Redeploy** (automatic or manual)

## ✅ Verification

After setting root directory, the build should:
- ✅ Find `Gemfile` at `backend/Gemfile`
- ✅ Find `Procfile` at `backend/Procfile`
- ✅ Run `bundle install` successfully
- ✅ Start the Rails server

---

**This is a common issue when the Rails app is in a subdirectory!**
