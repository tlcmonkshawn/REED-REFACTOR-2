# Render Deployment Quick Fix Guide

## 🚨 Immediate Actions

### Step 1: Check Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your web service
3. Click **"Logs"** tab
4. Look for:
   - **Build Logs** section (during deployment)
   - **Runtime Logs** section (after deployment)

### Step 2: Common Issues to Look For

#### Issue A: Build Failed
**Look for:**
- "Bundle install failed"
- "Gem not found"
- "Ruby version mismatch"

#### Issue B: Application Won't Start
**Look for:**
- "Puma starting..."
- "Listening on tcp://..."
- Connection errors
- Missing environment variables

#### Issue C: Database Connection
**Look for:**
- "PG::ConnectionBad"
- "could not connect to server"
- "database does not exist"

---

## 🔧 Quick Fixes

### Fix 1: Service Account JSON Format ⚠️ IMPORTANT

**Problem:** Your `GOOGLE_APPLICATION_CREDENTIALS_JSON` has `\n` escape sequences

**Current (from render-env-vars.txt):**
```
"private_key":"-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDEC9oUjP4oDRm0\n...
```

**Fix:** In Render dashboard, replace `\n` with actual line breaks OR remove them entirely (single line)

**Option A: Single Line (Easier)**
1. Copy entire JSON from `render-env-vars.txt`
2. Remove all `\n` characters
3. Make it one continuous line
4. Paste into Render environment variable

**Option B: Multi-line (If Render supports it)**
1. Replace `\n` with actual line breaks
2. Paste as formatted JSON

**Test:** After updating, redeploy and check logs for "Google Cloud Storage credentials" errors

### Fix 2: Build Command

**In Render Dashboard → Your Service → Settings → Build Command:**

```
bundle install && bundle exec rails db:migrate
```

This ensures migrations run automatically.

### Fix 3: Missing Ruby Version

**Create `backend/.ruby-version`:**
```
3.4.7
```

**Or set in Render Build Command:**
```
rbenv install 3.4.7 && bundle install && bundle exec rails db:migrate
```

### Fix 4: Database Migrations

**If migrations haven't run:**
1. Go to Render Dashboard → Your Service
2. Click **"Shell"** tab (or use Render Shell)
3. Run:
   ```bash
   bundle exec rails db:migrate
   ```

---

## 📋 Environment Variables Checklist

Verify these are set in Render Dashboard → Environment:

- [x] `RAILS_ENV=production` ✅
- [x] `DATABASE_URL` ✅ (from your file)
- [x] `SECRET_KEY_BASE` ✅
- [x] `JWT_SECRET_KEY` ✅
- [x] `GEMINI_API_KEY` ✅
- [x] `GOOGLE_CLOUD_PROJECT_ID` ✅
- [x] `GOOGLE_CLOUD_STORAGE_BUCKET` ✅
- [x] `GOOGLE_APPLICATION_CREDENTIALS_JSON` ⚠️ **CHECK FORMAT**
- [x] `ADMIN_PASSWORD` ✅
- [x] `RAILS_MAX_THREADS=5` ✅
- [x] `RAILS_MIN_THREADS=5` ✅
- [x] `WEB_CONCURRENCY=2` ✅

---

## 🔍 What to Look For in Logs

### Successful Deployment Logs Should Show:
```
✅ Bundle install completed
✅ Migrations completed
✅ Puma starting
✅ Listening on tcp://0.0.0.0:XXXX
```

### Error Logs to Watch For:
```
❌ "Bundle install failed" → Check Gemfile
❌ "PG::ConnectionBad" → Check DATABASE_URL
❌ "Google Cloud Storage credentials not configured" → Check JSON format
❌ "NameError: uninitialized constant" → Missing gem
❌ "Port already in use" → Port configuration issue
❌ "No such file or directory" → Missing file/dependency
```

---

## 🎯 Most Likely Issues

Based on your setup, check these first:

### 1. Service Account JSON Format (Most Likely)
- The `\n` escape sequences might not be parsed correctly
- **Fix:** Remove all `\n` and make it single line, or replace with actual line breaks

### 2. Database Migrations Not Running
- Migrations might not have run automatically
- **Fix:** Add to build command or run manually in Shell

### 3. Missing System Dependencies
- Image processing gems might need ImageMagick
- **Fix:** Add to build command or use buildpack

---

## 📞 Next Steps

1. **Check Render Logs** - Look for specific error messages
2. **Fix Service Account JSON** - Remove `\n` escape sequences
3. **Verify Build Command** - Ensure migrations run
4. **Test Health Endpoint** - After deployment, test:
   ```bash
   curl https://your-app.onrender.com/health
   ```

---

## 💡 Pro Tip

**Copy the exact error message** from Render logs and search for it in `RENDER_TROUBLESHOOTING.md` for specific solutions!
