# Run These Commands

## Step 1: Check What's Installed

```powershell
.\SETUP_SCRIPT.ps1
```

---

## Step 2: Install Tools (Choose One)

### Option A: Automated Installation (Admin Required)

**Run PowerShell as Administrator, then:**

```powershell
.\INSTALL_TOOLS.ps1
```

### Option B: Install Individual Tools via Winget

```powershell
# Install PostgreSQL
winget install PostgreSQL.PostgreSQL --accept-package-agreements --accept-source-agreements

# Install Ruby
winget install RubyInstallerTeam.Ruby.3.3 --accept-package-agreements --accept-source-agreements

# Install Flutter
winget install Flutter.Flutter --accept-package-agreements --accept-source-agreements

# Install Memurai (Redis) - may need to download manually from https://www.memurai.com/get-memurai
```

### Option C: Install Individual Tools via Chocolatey (Admin Required)

```powershell
# Run PowerShell as Administrator first!

# Install PostgreSQL
choco install postgresql --params '/Password:postgres' -y

# Install Memurai (Redis)
choco install memurai-developer -y

# Install Ruby
choco install ruby -y

# Install Flutter
choco install flutter -y
```

---

## Step 3: Install Rails (After Ruby is Installed)

```powershell
gem install rails
```

---

## Step 4: Restart PowerShell

**Close and reopen PowerShell** to refresh PATH variables.

---

## Step 5: Verify Installation

```powershell
.\SETUP_SCRIPT.ps1
```

---

## Step 6: Create .env File

```powershell
cd backend
.\scripts\create_env_file.ps1
```

This will:
- Ask for your PostgreSQL password
- Generate secrets
- Create the `.env` file

---

## Step 7: Set Up Database

```powershell
cd backend
.\scripts\setup_database.ps1
```

---

## Step 8: Test Backend

```powershell
cd backend
rails server
```

Then open browser: http://localhost:3000/health

---

## Step 9: Test Frontend

```powershell
cd frontend
flutter pub get
flutter run -d chrome
```

---

## Quick Copy-Paste Commands

### Full Setup (after tools are installed):

```powershell
# 1. Verify installation
.\SETUP_SCRIPT.ps1

# 2. Create .env file
cd backend
.\scripts\create_env_file.ps1

# 3. Set up database
.\scripts\setup_database.ps1

# 4. Test backend
rails server
```

---

## Troubleshooting Commands

### Check if PostgreSQL is running:
```powershell
Get-Service -Name "*postgres*"
```

### Check if Redis/Memurai is running:
```powershell
Get-Service -Name "*memurai*" -ErrorAction SilentlyContinue
# Or if using Docker:
docker ps
```

### Test PostgreSQL connection:
```powershell
psql -U postgres -h localhost
```

### Test Redis connection:
```powershell
redis-cli ping
```

### Check Ruby version:
```powershell
ruby --version
```

### Check Rails version:
```powershell
rails --version
```

### Check Flutter version:
```powershell
flutter --version
```

### Check Flutter setup:
```powershell
flutter doctor
```

