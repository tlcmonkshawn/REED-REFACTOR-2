# 🚀 START HERE - Installation Guide

## Quick Installation Steps

### 1️⃣ Install PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- **Remember your password!** You'll need it for the `.env` file
- Default port: 5432, username: `postgres`

### 2️⃣ Install Redis
**Option A (Recommended):** Memurai - https://www.memurai.com/
**Option B:** Docker - `docker run -d -p 6379:6379 redis`

### 3️⃣ Install Ruby
- Download: https://rubyinstaller.org/downloads/
- Choose Ruby 3.0+ (recommended: 3.3.x)
- **IMPORTANT:** Install MSYS2 development toolchain when prompted

### 4️⃣ Install Rails
```powershell
gem install rails
```

### 5️⃣ Install Flutter
- Download: https://docs.flutter.dev/get-started/install/windows
- Extract to `C:\flutter` (or your preferred location)
- Add to PATH and restart PowerShell

### 6️⃣ Verify Installation
Run this in PowerShell:
```powershell
.\SETUP_SCRIPT.ps1
```

This will check what's installed and what's missing.

---

## After Installation

### Step 1: Create Backend Environment File

1. Navigate to backend:
```powershell
cd backend
```

2. Generate secrets:
```powershell
rails secret
# Copy the output - you'll need it twice!
```

3. Create `.env` file:
```powershell
# Copy backend/.env.template to .env
# Then edit .env with your PostgreSQL password and secrets
```

Minimum `.env` content:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
REDIS_URL=redis://localhost:6379/0
SECRET_KEY_BASE=PASTE_RAILS_SECRET_HERE
JWT_SECRET_KEY=PASTE_RAILS_SECRET_HERE
```

### Step 2: Set Up Database

```powershell
cd backend
bundle install
rails db:create
rails db:migrate
```

### Step 3: Test Backend

```powershell
rails server
```

Open browser: http://localhost:3000/health
Should see: `{"status":"ok"...}`

### Step 4: Test Frontend

```powershell
cd frontend
flutter pub get
flutter run -d chrome
```

---

## Full Documentation

- **INSTALLATION_CHECKLIST.md** - Detailed step-by-step checklist
- **QUICK_START.md** - Quick reference guide
- **SETUP_INSTRUCTIONS.md** - Detailed instructions with troubleshooting
- **SETUP_REQUIREMENTS.md** - Complete list of API keys needed (for later)

---

## Need Help?

1. Run `.\SETUP_SCRIPT.ps1` to check what's installed
2. Check `INSTALLATION_CHECKLIST.md` for detailed steps
3. See `SETUP_INSTRUCTIONS.md` for troubleshooting

---

## Current Status

✅ **Project Structure:** Complete
✅ **Code:** Ready
⏳ **Installation:** In progress
⏳ **API Keys:** Waiting for other agent

