# Render Error Diagnostic Helper

## Quick Diagnostic Steps

### 1. What Type of Error?

**Check Render Logs and identify:**

- [ ] **Build Error** - Happens during `bundle install`
- [ ] **Runtime Error** - Happens after app starts
- [ ] **Database Error** - Connection or migration issues
- [ ] **Application Error** - Code crashes or 500 errors
- [ ] **Health Check Error** - App won't respond to health checks

### 2. Copy Error Message

**From Render Logs, copy the exact error message and search below:**

---

## Common Error Messages & Solutions

### "Bundle install failed" or "Gem not found"
**Solution:**
- Check `Gemfile` is committed
- Verify Ruby version matches (add `.ruby-version` file)
- Check `Gemfile.lock` is committed

### "PG::ConnectionBad: could not connect to server"
**Solution:**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Verify SSL requirements (may need `?sslmode=require`)

### "Google Cloud Storage credentials not configured"
**Solution:**
- Check `GOOGLE_APPLICATION_CREDENTIALS_JSON` is set
- Verify JSON format (remove `\n` escape sequences)
- Test JSON is valid (use JSON validator)

### "Database does not exist"
**Solution:**
- Run migrations manually in Render Shell:
  ```bash
  bundle exec rails db:create db:migrate
  ```

### "NameError: uninitialized constant"
**Solution:**
- Missing gem in Gemfile
- Run `bundle install` locally to verify
- Check Gemfile.lock is committed

### "Port already in use" or "Address already in use"
**Solution:**
- Puma should use `ENV['PORT']` (already configured ✅)
- Check `config/puma.rb` uses `ENV.fetch("PORT")`

### "Application failed to respond"
**Solution:**
- Check runtime logs for crash messages
- Verify all required environment variables are set
- Check application is listening on correct port

### "No such file or directory"
**Solution:**
- Missing file or dependency
- Check file paths in code
- Verify all required files are committed

---

## Step-by-Step Debugging

### Step 1: Check Build Logs
```
1. Go to Render Dashboard → Your Service → Logs
2. Scroll to "Build Logs" section
3. Look for red error messages
4. Copy the exact error
```

### Step 2: Check Runtime Logs
```
1. Scroll to "Runtime Logs" section
2. Look for stack traces or error messages
3. Check if Puma started successfully
4. Look for database connection attempts
```

### Step 3: Verify Environment Variables
```
1. Go to Render Dashboard → Your Service → Environment
2. Verify all variables from render-env-vars.txt are set
3. Check for typos or missing values
4. Pay special attention to GOOGLE_APPLICATION_CREDENTIALS_JSON format
```

### Step 4: Test Health Endpoint
```
1. Get your Render URL (e.g., https://your-app.onrender.com)
2. Test: curl https://your-app.onrender.com/health
3. Should return: {"status":"ok"}
```

---

## Need More Help?

1. **Copy the exact error message** from Render logs
2. **Check which section it's in** (Build or Runtime)
3. **Look for specific patterns** in the error
4. **Share the error** and we can provide specific fix

---

## Quick Test Commands

### Test Locally (Production Mode)
```bash
cd backend
RAILS_ENV=production bundle exec rails server
```

### Test Database Connection
```bash
cd backend
RAILS_ENV=production bundle exec rails db:migrate:status
```

### Test Service Account JSON
```ruby
# In Rails console
require 'json'
json_str = ENV['GOOGLE_APPLICATION_CREDENTIALS_JSON']
JSON.parse(json_str) # Should not raise error
```
