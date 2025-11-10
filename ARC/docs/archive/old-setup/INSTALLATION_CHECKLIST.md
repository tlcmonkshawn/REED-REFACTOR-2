# Installation Checklist

Follow these steps in order. Check off each item as you complete it.

## Step 1: Install PostgreSQL ✅

- [ ] Download PostgreSQL from: https://www.postgresql.org/download/windows/
- [ ] Run the installer
- [ ] **IMPORTANT:** Write down the password you set during installation
- [ ] Complete installation
- [ ] Verify installation: Open PowerShell and run:
  ```powershell
  psql --version
  ```
  (If command not found, you may need to add PostgreSQL to PATH or restart terminal)

**PostgreSQL Password:** _________________ (write it down!)

---

## Step 2: Install Redis ✅

Choose ONE option:

**Option A: Memurai (Recommended for Windows)**
- [ ] Download from: https://www.memurai.com/
- [ ] Install Memurai
- [ ] Start the Memurai service (check Windows Services)
- [ ] Verify: Open PowerShell and run:
  ```powershell
  redis-cli ping
  ```
  (Should return: PONG)

**Option B: Docker**
- [ ] Install Docker Desktop
- [ ] Run: `docker run -d -p 6379:6379 redis`
- [ ] Verify: `docker ps` (should show redis container)

---

## Step 3: Install Ruby ✅

- [ ] Download Ruby+Devkit from: https://rubyinstaller.org/downloads/
- [ ] Choose Ruby 3.0 or higher (recommended: Ruby 3.3.x)
- [ ] Run the installer
- [ ] **IMPORTANT:** When prompted, install MSYS2 development toolchain
- [ ] Verify installation:
  ```powershell
  ruby --version
  ```
  (Should show Ruby 3.x.x)

---

## Step 4: Install Rails ✅

- [ ] Open PowerShell
- [ ] Run:
  ```powershell
  gem install rails
  ```
- [ ] Verify installation:
  ```powershell
  rails --version
  ```
  (Should show Rails 7.x.x)

---

## Step 5: Install Flutter ✅

- [ ] Download Flutter SDK from: https://docs.flutter.dev/get-started/install/windows
- [ ] Extract to a location (e.g., `C:\flutter`)
- [ ] Add Flutter to PATH:
  - Open System Properties → Environment Variables
  - Add `C:\flutter\bin` to PATH
  - Or run in PowerShell (as admin):
    ```powershell
    [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\flutter\bin", "User")
    ```
- [ ] Restart PowerShell
- [ ] Verify installation:
  ```powershell
  flutter --version
  ```
- [ ] Run Flutter doctor:
  ```powershell
  flutter doctor
  ```
  (Follow any setup instructions it provides)

---

## Step 6: Configure Backend ✅

Once all tools are installed:

- [ ] Navigate to backend:
  ```powershell
  cd backend
  ```

- [ ] Create `.env` file:
  ```powershell
  # Create .env file in backend directory
  # Copy the template below and fill in your PostgreSQL password
  ```

- [ ] Generate Rails secrets:
  ```powershell
  rails secret
  ```
  Copy the output - you'll need it twice!

- [ ] Edit `.env` file with:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
  REDIS_URL=redis://localhost:6379/0
  SECRET_KEY_BASE=PASTE_RAILS_SECRET_HERE
  JWT_SECRET_KEY=PASTE_RAILS_SECRET_HERE
  ```

- [ ] Install Ruby dependencies:
  ```powershell
  bundle install
  ```

- [ ] Create database:
  ```powershell
  rails db:create
  ```

- [ ] Run migrations:
  ```powershell
  rails db:migrate
  ```

- [ ] Test backend:
  ```powershell
  rails server
  ```
  Open browser to: http://localhost:3000/health
  Should see: `{"status":"ok"...}`

---

## Step 7: Configure Frontend ✅

- [ ] Navigate to frontend:
  ```powershell
  cd frontend
  ```

- [ ] Install Flutter dependencies:
  ```powershell
  flutter pub get
  ```

- [ ] Test Flutter:
  ```powershell
  flutter run -d chrome
  ```
  (Or use `flutter run` to see available devices)

---

## Troubleshooting

### PostgreSQL not found
- Check if PostgreSQL is in PATH
- Try: `C:\Program Files\PostgreSQL\XX\bin\psql.exe --version` (replace XX with version)
- Restart PowerShell after installation

### Redis not found
- If using Memurai, check Windows Services
- If using Docker, check `docker ps`

### Bundle install fails
- Make sure Ruby DevKit is installed
- Try: `ridk install` (if RubyInstaller DevKit)

### Rails db:create fails
- Check PostgreSQL is running: Check Windows Services
- Verify `.env` file has correct password
- Try: `psql -U postgres -h localhost` to test connection

### Flutter doctor shows issues
- Install Android Studio for Android development
- Install VS Code / Android Studio for Flutter plugins
- Accept Android licenses: `flutter doctor --android-licenses`

---

## Next Steps After Installation

Once everything is installed and tested:

1. ✅ All tools installed
2. ✅ Database created
3. ✅ Backend server running
4. ✅ Frontend runs
5. ⏳ Wait for API keys from other agent
6. ⏳ Add API keys to `.env`
7. ⏳ Implement service integrations
8. ⏳ Start building features!

