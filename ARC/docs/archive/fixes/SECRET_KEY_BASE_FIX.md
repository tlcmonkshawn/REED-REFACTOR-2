# SECRET_KEY_BASE Missing Error - Fix Guide

## Problem

Rails 8 requires `SECRET_KEY_BASE` to be set as an environment variable in production. The error occurs because:

1. `JwtService` was accessing `Rails.application.secret_key_base` during class definition (eager loading)
2. Rails can't initialize without `SECRET_KEY_BASE` set
3. This creates a circular dependency

## Solution

### 1. Set Environment Variable in Render (REQUIRED)

**Go to Render Dashboard → Your Web Service → Environment Variables**

Add or verify this variable exists:

```
SECRET_KEY_BASE=C91C5CFB0BD268D7D173737793D6939237693A00A969F50555A39F43CEE7795E55D1A74C50F8A12BBA5241CCAE5F8D74DF196EE4403A5C069104ABD41269A21B
```

**Important**: Copy the exact value from `render-env-vars.txt` line 3.

### 2. Code Fix Applied

I've updated `JwtService` to:
- Lazy-load the secret key (only accessed when needed, not during class definition)
- Check `ENV['SECRET_KEY_BASE']` directly as a fallback
- Avoid accessing `Rails.application` during eager loading

### 3. Verify All Environment Variables

Make sure ALL variables from `render-env-vars.txt` are set in Render:

1. `DATABASE_URL` (should be auto-set by Render)
2. `RAILS_ENV=production`
3. `SECRET_KEY_BASE` ← **THIS IS THE MISSING ONE**
4. `JWT_SECRET_KEY`
5. `GOOGLE_CLOUD_PROJECT_ID`
6. `GOOGLE_CLOUD_STORAGE_BUCKET`
7. `GEMINI_API_KEY`
8. `ADMIN_PASSWORD`
9. `GOOGLE_APPLICATION_CREDENTIALS_JSON`
10. `RAILS_MAX_THREADS=5`
11. `RAILS_MIN_THREADS=5`
12. `WEB_CONCURRENCY=2`

## After Setting SECRET_KEY_BASE

1. Render will automatically redeploy
2. The application should start successfully
3. Check logs to confirm Puma starts without errors

## Quick Copy-Paste for Render

```
SECRET_KEY_BASE=C91C5CFB0BD268D7D173737793D6939237693A00A969F50555A39F43CEE7795E55D1A74C50F8A12BBA5241CCAE5F8D74DF196EE4403A5C069104ABD41269A21B
```
