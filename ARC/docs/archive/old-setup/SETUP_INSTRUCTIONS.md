# Setup Instructions for BootyHunter V1

## Prerequisites Installation

### 1. PostgreSQL (Required)

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. **Important**: Remember the password you set during installation
4. Default port: 5432
5. Default username: `postgres`

**After Installation:**
- Test connection: Open Command Prompt and run `psql -U postgres`
- You'll be prompted for the password you set during installation

**Update `.env` file:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here  # The password you set during install
```

### 2. Redis (Required for Background Jobs)

**Option 1: Memurai (Recommended for Windows)**
1. Download from: https://www.memurai.com/
2. Install and start the service
3. Default port: 6379

**Option 2: Docker (Alternative)**
```bash
docker run -d -p 6379:6379 redis
```

**After Installation:**
- Test connection: Open Command Prompt and run `redis-cli ping`
- Should return `PONG`

**Update `.env` file:**
```bash
REDIS_URL=redis://localhost:6379/0
```

### 3. Ruby (Required for Rails)

**Windows:**
1. Download Ruby+Devkit from: https://rubyinstaller.org/downloads/
2. Use Ruby 3.0 or higher
3. During installation, make sure to install MSYS2 development toolchain

**After Installation:**
- Test: Open Command Prompt and run `ruby --version`
- Should show Ruby 3.0.x or higher

### 4. Rails (Required for Backend)

**After Ruby is installed:**
```bash
gem install rails
```

**Test:**
```bash
rails --version
```

### 5. Flutter (Required for Frontend)

**Windows:**
1. Download from: https://docs.flutter.dev/get-started/install/windows
2. Extract to a location (e.g., `C:\flutter`)
3. Add Flutter to PATH
4. Run `flutter doctor` to check dependencies

**After Installation:**
```bash
flutter --version
```

## Database Setup

Once PostgreSQL is installed:

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Ruby dependencies:
```bash
bundle install
```

3. Create database:
```bash
rails db:create
```

4. Run migrations:
```bash
rails db:migrate
```

If you get password errors, make sure your `.env` file has the correct password.

## Starting the Application

### Backend (Rails)

1. Make sure PostgreSQL and Redis are running
2. Navigate to backend:
```bash
cd backend
```

3. Start Rails server:
```bash
rails server
```

Server will start on `http://localhost:3000`

### Frontend (Flutter)

1. Navigate to frontend:
```bash
cd frontend
```

2. Get dependencies:
```bash
flutter pub get
```

3. Run Flutter app:
```bash
flutter run
```

For web:
```bash
flutter run -d chrome
```

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "password authentication failed"**
- Check your `.env` file has the correct password
- Try connecting manually: `psql -U postgres -h localhost`
- Reset PostgreSQL password if needed

**Error: "connection refused"**
- Make sure PostgreSQL service is running
- Check Windows Services (services.msc) for "postgresql" service
- Try: `net start postgresql-x64-XX` (where XX is version number)

### Redis Connection Issues

**Error: "Connection refused"**
- Make sure Redis/Memurai is running
- Check Windows Services for "Memurai" service
- Try: `net start Memurai`

### Rails Issues

**Error: "Could not find gem"**
- Run `bundle install` again
- Make sure you're using the correct Ruby version

**Error: "Database does not exist"**
- Run `rails db:create`
- Check `.env` file has correct database credentials

### Flutter Issues

**Error: "No devices found"**
- For web: `flutter run -d chrome`
- For Android: Make sure Android Studio is set up
- Run `flutter doctor` to check setup

## Next Steps After Setup

1. ✅ Install PostgreSQL
2. ✅ Install Redis
3. ✅ Install Ruby and Rails
4. ✅ Install Flutter
5. ⏳ Create `.env` file with all credentials
6. ⏳ Set up database (`rails db:create db:migrate`)
7. ⏳ Test backend (`rails server`)
8. ⏳ Test frontend (`flutter run`)

## Environment Variables Checklist

Make sure your `backend/.env` file has:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

# Redis
REDIS_URL=redis://localhost:6379/0

# Rails
SECRET_KEY_BASE=your_secret_key_base
JWT_SECRET_KEY=your_jwt_secret

# API Keys (will be added later)
GEMINI_API_KEY=
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_STORAGE_BUCKET=
SQUARE_ACCESS_TOKEN=
DISCOGS_USER_TOKEN=
```

## Quick Start Commands

```bash
# Backend setup
cd backend
bundle install
rails db:create
rails db:migrate
rails server

# Frontend setup (in new terminal)
cd frontend
flutter pub get
flutter run
```

