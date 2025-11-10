# 🚀 Install Tools Now - Step by Step

## Option A: Automated Installation (Requires Admin)

**Right-click PowerShell and "Run as Administrator", then run:**
```powershell
.\INSTALL_TOOLS.ps1
```

This will automatically install:
- PostgreSQL
- Redis (Memurai)
- Ruby
- Flutter
- Rails (after Ruby is installed)

---

## Option B: Manual Installation (Recommended)

Follow these steps one by one:

### 1. Install PostgreSQL ⚡

**Link:** https://www.postgresql.org/download/windows/

**Steps:**
1. Click "Download the installer"
2. Download "Windows x86-64" version
3. Run the installer
4. **IMPORTANT:** Set a password when prompted
   - **WRITE IT DOWN!** You'll need this for `.env` file
5. Complete installation
6. Restart PowerShell

**Verify:**
```powershell
psql --version
```

---

### 2. Install Redis (Memurai) ⚡

**Link:** https://www.memurai.com/get-memurai

**Steps:**
1. Download "Memurai Developer Edition" (free)
2. Run the installer
3. Complete installation
4. Memurai will start automatically as a Windows service

**Verify:**
```powershell
redis-cli ping
# Should return: PONG
```

**Alternative (Docker):**
If you have Docker:
```powershell
docker run -d -p 6379:6379 --name redis redis
```

---

### 3. Install Ruby ⚡

**Link:** https://rubyinstaller.org/downloads/

**Steps:**
1. Download **Ruby+Devkit 3.3.x (x64)** - the latest version
2. Run the installer
3. ✅ Check "Add Ruby executables to your PATH"
4. Complete installation
5. **IMPORTANT:** When the MSYS2 installer window opens:
   - Press Enter to install default components
   - Wait for installation
   - Press Enter to finish

**Verify (in NEW PowerShell window):**
```powershell
ruby --version
# Should show: ruby 3.3.x
```

---

### 4. Install Rails ⚡

**After Ruby is installed:**

```powershell
gem install rails
```

Wait for installation (may take a few minutes).

**Verify:**
```powershell
rails --version
# Should show: Rails 7.x.x
```

---

### 5. Install Flutter ⚡

**Link:** https://docs.flutter.dev/get-started/install/windows

**Steps:**

1. **Download Flutter SDK:**
   - Click "Download Flutter SDK"
   - Download the zip file (e.g., `flutter_windows_3.24.x.zip`)

2. **Extract Flutter:**
   - Extract to `C:\flutter` (or similar, no spaces in path)
   - **Do NOT** extract to `C:\Program Files\`

3. **Add to PATH:**
   - Press `Windows + R`
   - Type: `sysdm.cpl` and press Enter
   - Click "Environment Variables"
   - Under "User variables", select "Path" and click "Edit"
   - Click "New" and add: `C:\flutter\bin`
   - Click OK on all dialogs

4. **Restart PowerShell** (important!)

**Verify (in NEW PowerShell window):**
```powershell
flutter --version
```

**Run Flutter Doctor:**
```powershell
flutter doctor
```
Follow any instructions it provides.

---

## After All Tools Are Installed

### Step 1: Verify Installation

```powershell
.\SETUP_SCRIPT.ps1
```

Should show ✅ for all installed tools.

### Step 2: Create .env File

```powershell
cd backend
.\scripts\create_env_file.ps1
```

This will:
- Ask for your PostgreSQL password
- Generate secure secrets
- Create the `.env` file

### Step 3: Set Up Database

```powershell
.\scripts\setup_database.ps1
```

This will:
- Install Ruby dependencies
- Create the database
- Run migrations

### Step 4: Test Backend

```powershell
rails server
```

Open browser: http://localhost:3000/health
Should see: `{"status":"ok"...}`

### Step 5: Test Frontend

```powershell
cd ..\frontend
flutter pub get
flutter run -d chrome
```

---

## Quick Links

- **PostgreSQL:** https://www.postgresql.org/download/windows/
- **Memurai (Redis):** https://www.memurai.com/get-memurai
- **Ruby+Devkit:** https://rubyinstaller.org/downloads/
- **Flutter:** https://docs.flutter.dev/get-started/install/windows

---

## Need Help?

- See `MANUAL_INSTALL_GUIDE.md` for detailed step-by-step instructions
- See `INSTALLATION_CHECKLIST.md` for a checklist version
- Run `.\SETUP_SCRIPT.ps1` anytime to check what's installed

