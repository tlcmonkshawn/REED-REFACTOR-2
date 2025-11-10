# Database Connection & CORS Explained

## How the App Knows Where the Database Is

### Backend (Rails) → Database Connection

The Rails backend connects to PostgreSQL using the `DATABASE_URL` environment variable:

**Configuration** (`backend/config/database.yml`):
```yaml
production:
  url: <%= ENV["DATABASE_URL"] %>
```

**How it works:**
1. **Render automatically sets `DATABASE_URL`** when you link a PostgreSQL database to your web service
2. The URL format is: `postgresql://user:password@host:port/database`
3. Rails reads this environment variable and connects automatically

**In Render:**
- When you create a PostgreSQL database, Render gives you a connection string
- When you link it to your web service, Render automatically sets `DATABASE_URL`
- Your Rails app uses this to connect

**Your current `DATABASE_URL`** (from `render.yaml`):
```
postgresql://bootiehunter_user:sHsn7S7mF6JzXM7peOg0VLnB24wBVve7@dpg-d4639oa4d50c73cc2tv0-a.oregon-postgres.render.com/bootiehunter_production
```

This tells Rails:
- **Protocol**: `postgresql://`
- **User**: `bootiehunter_user`
- **Password**: `sHsn7S7mF6JzXM7peOg0VLnB24wBVve7`
- **Host**: `dpg-d4639oa4d50c73cc2tv0-a.oregon-postgres.render.com`
- **Database**: `bootiehunter_production`

---

## Does the Database Have CORS Problems?

**Short answer: No! Databases don't have CORS.**

### Why?

**CORS (Cross-Origin Resource Sharing)** only applies to:
- **HTTP requests from browsers** (JavaScript in web pages)
- **Browser security feature** to prevent malicious websites from accessing other sites

**Database connections are:**
- **Server-to-server** (Rails backend → PostgreSQL)
- **Not browser requests** - they happen on the server side
- **No CORS needed** - it's a direct database connection

### The Flow

```
Browser (Netlify)
  → HTTP Request (CORS applies here)
  → Rails Backend (Render)
  → Database Connection (No CORS - server-to-server)
  → PostgreSQL (Render)
```

1. **Frontend → Backend**: HTTP request (CORS applies ✅ - we fixed this)
2. **Backend → Database**: Direct database connection (No CORS needed ✅)

---

## Database Connection Status

### ✅ Should Be Working

If `DATABASE_URL` is set in Render (which it should be automatically), the database connection should work.

### ⚠️ If Database Connection Fails

You'd see errors like:
- `could not connect to server`
- `database does not exist`
- `authentication failed`

**To verify database connection:**
1. Check Render logs for database connection errors
2. Verify `DATABASE_URL` is set in Render environment variables
3. Check that the PostgreSQL service is running in Render

---

## Summary

| Component | Connection Type | CORS Needed? | How It's Configured |
|-----------|----------------|--------------|---------------------|
| **Frontend → Backend** | HTTP (browser) | ✅ Yes | Fixed in `cors.rb` |
| **Backend → Database** | Direct DB connection | ❌ No | `DATABASE_URL` env var |
| **Frontend → Database** | ❌ Never happens | N/A | Frontend never connects directly |

---

**Bottom line:**
- ✅ Database connection uses `DATABASE_URL` (auto-set by Render)
- ✅ No CORS needed for database (it's server-to-server)
- ✅ CORS only needed for frontend→backend HTTP requests (already fixed)
