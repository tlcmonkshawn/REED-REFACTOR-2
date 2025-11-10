# How to Check Render Logs for 500 Error

## The Problem
You're getting a 500 Internal Server Error when trying to log in. The backend has detailed logging that should show exactly what's failing.

## Steps to Check Logs

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Navigate to your web service: `bootiehunter-backend` (or similar)

2. **Open the Logs Tab**
   - Click on your web service
   - Click on the **"Logs"** tab at the top

3. **Try to Log In Again**
   - While watching the logs, try to log in from the frontend
   - The logs should update in real-time

4. **Look for These Log Messages**
   You should see a sequence like this:
   ```
   === Incoming API Request ===
   Method: POST
   Path: /api/v1/auth/login

   === ApplicationController: POST /api/v1/auth/login ===
   Params: ...

   === Login endpoint called ===
   Params: ...
   Looking up user by email: ...
   User found: true/false
   ```

5. **Find the Error**
   Look for lines that start with:
   - `Login error:`
   - `=== ApplicationController Error ===`
   - `=== Middleware Error ===`
   - `JwtService.encode error:`

## Common Causes of 500 Errors

### 1. Database Connection Issue
**Look for:** `could not connect to server` or `ActiveRecord::ConnectionNotEstablished`
**Fix:** Check if `DATABASE_URL` is set in Render environment variables

### 2. Missing Method
**Look for:** `NoMethodError: undefined method`
**Example:** If `record_login!` doesn't exist on User model
**Fix:** Check if the method exists in `backend/app/models/user.rb`

### 3. JWT Secret Key Missing
**Look for:** `JwtService: No secret key found!` or `Missing JWT secret key`
**Fix:** Ensure `SECRET_KEY_BASE` is set in Render environment variables

### 4. Database Table Missing
**Look for:** `relation "users" does not exist` or `PG::UndefinedTable`
**Fix:** Run database migrations: `rails db:migrate` on Render

### 5. Parameter Parsing Error
**Look for:** `ActionController::ParameterMissing` or `NoMethodError` related to params
**Fix:** Check the request format matches what the backend expects

## What to Share

When you find the error in the logs, share:
1. The exact error message
2. The error class (e.g., `NoMethodError`, `ArgumentError`)
3. The stack trace (especially the first few lines)

This will help identify the exact issue!
