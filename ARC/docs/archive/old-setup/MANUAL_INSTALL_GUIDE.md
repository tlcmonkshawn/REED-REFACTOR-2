# Manual Installation Guide

If automated installation doesn't work, follow these step-by-step guides.

## 1. Install PostgreSQL

### Download & Install
1. **Download:** https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose the latest version (e.g., 16.x)
   - Download the Windows x86-64 installer

2. **Run the installer:**
   - Double-click the downloaded `.exe` file
   - Click "Next" through the welcome screen
   - Choose installation directory (default is fine)
   - Select components:
     - ✅ PostgreSQL Server
     - ✅ pgAdmin 4 (optional, but helpful)
     - ✅ Command Line Tools
     - ✅ Stack Builder (optional)

3. **Set data directory** (default is fine)

4. **Set password:**
   - **IMPORTANT:** Enter a password for the `postgres` superuser
   - **WRITE IT DOWN!** You'll need this for the `.env` file
   - Confirm the password

5. **Set port:** Default is 5432 (keep this)

6. **Set locale:** Default is fine

7. **Complete installation**

### Verify Installation
Open PowerShell and run:
```powershell
psql --version
```

If command not found, you may need to:
- Restart PowerShell
- Or add PostgreSQL to PATH manually:
  - Add `C:\Program Files\PostgreSQL\16\bin` to PATH (replace 16 with your version)

---

## 2. Install Redis (Memurai)

### Option A: Memurai (Recommended for Windows)

1. **Download:** https://www.memurai.com/get-memurai
   - Choose "Memurai Developer Edition" (free)

2. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - Accept the license agreement
   - Choose installation location (default is fine)

3. **Start the service:**
   - Memurai should start automatically as a Windows service
   - Check Windows Services (services.msc) to verify "Memurai" is running

### Verify Installation
Open PowerShell and run:
```powershell
redis-cli ping
```

Should return: `PONG`

### Option B: Docker (Alternative)

If you have Docker Desktop installed:

```powershell
docker run -d -p 6379:6379 --name redis redis
```

Verify:
```powershell
docker ps
# Should show redis container running
```

---

## 3. Install Ruby

### Download & Install

1. **Download Ruby+Devkit:**
   - Go to: https://rubyinstaller.org/downloads/
   - Download **Ruby+Devkit 3.3.x** (latest version)
   - Choose the **x64** version (64-bit)

2. **Run the installer:**
   - Double-click the downloaded `.exe` file
   - Check "Add Ruby executables to your PATH"
   - Check "Associate .rb and .rbw files with this Ruby installation"
   - Click "Install"

3. **Install MSYS2 Development Toolchain:**
   - **IMPORTANT:** After Ruby installation, a new window will open
   - This is the "RubyInstaller2 for Windows" component installer
   - You'll see a list of components
   - **Press Enter** to install the default components (MSYS2)
   - Wait for installation to complete
   - Press Enter again to finish

### Verify Installation
Open a NEW PowerShell window (important!) and run:
```powershell
ruby --version
```

Should show: `ruby 3.3.x (date) [x64-mingw32]`

---

## 4. Install Rails

### Installation

After Ruby is installed, open PowerShell and run:

```powershell
gem install rails
```

This may take a few minutes. You'll see progress messages.

### Verify Installation
```powershell
rails --version
```

Should show: `Rails 7.x.x`

---

## 5. Install Flutter

### Download & Extract

1. **Download Flutter SDK:**
   - Go to: https://docs.flutter.dev/get-started/install/windows
   - Click "Download Flutter SDK"
   - Download the latest stable release (e.g., flutter_windows_3.24.x.zip)

2. **Extract Flutter:**
   - Extract the zip file to a location like `C:\flutter`
   - **Do NOT** extract to `C:\Program Files\` (permissions issues)
   - **Do NOT** extract to a path with spaces

### Add to PATH

1. **Open Environment Variables:**
   - Press `Windows + R`
   - Type `sysdm.cpl` and press Enter
   - Click "Environment Variables" button
   - Under "User variables", find "Path" and click "Edit"

2. **Add Flutter:**
   - Click "New"
   - Add: `C:\flutter\bin` (or wherever you extracted Flutter)
   - Click "OK" on all dialogs

3. **Restart PowerShell** (important!)

### Verify Installation
Open a NEW PowerShell window and run:
```powershell
flutter --version
```

Should show Flutter version information.

### Run Flutter Doctor
```powershell
flutter doctor
```

This checks for additional dependencies. Follow any instructions it provides.

---

## After Installation

### 1. Restart PowerShell
Close and reopen PowerShell to refresh PATH variables.

### 2. Verify Everything
Run:
```powershell
.\SETUP_SCRIPT.ps1
```

Should show ✅ for all installed tools.

### 3. Set Up Project
```powershell
cd backend
.\scripts\create_env_file.ps1
```

Follow the prompts to create your `.env` file.

### 4. Set Up Database
```powershell
.\scripts\setup_database.ps1
```

This will create the database and run migrations.

---

## Troubleshooting

### PostgreSQL Command Not Found
- Restart PowerShell
- Or manually add to PATH: `C:\Program Files\PostgreSQL\16\bin`

### Redis Command Not Found
- Check Memurai service is running: `services.msc`
- Or use Docker: `docker run -d -p 6379:6379 redis`

### Ruby Command Not Found
- Make sure you restarted PowerShell after installation
- Check Ruby is in PATH: `where ruby`

### Rails Command Not Found
- Make sure Ruby is installed and working
- Run: `gem install rails` again

### Flutter Command Not Found
- Make sure you added Flutter to PATH
- Restart PowerShell
- Check PATH: `$env:Path` (should include `C:\flutter\bin`)

---

## Quick Links Summary

- **PostgreSQL:** https://www.postgresql.org/download/windows/
- **Memurai (Redis):** https://www.memurai.com/get-memurai
- **Ruby+Devkit:** https://rubyinstaller.org/downloads/
- **Flutter:** https://docs.flutter.dev/get-started/install/windows

---

## Need Help?

1. Check `INSTALLATION_CHECKLIST.md` for detailed steps
2. Run `.\SETUP_SCRIPT.ps1` to see what's missing
3. See `SETUP_INSTRUCTIONS.md` for troubleshooting

