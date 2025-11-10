# Debugging 500 Error on Login

## Current Status
- ✅ CORS fixed (duplicate config removed)
- ❌ Login endpoint returning 500 Internal Server Error
- ✅ Error handling added to login endpoint

## What to Check

### 1. Check Render Logs (Most Important!)

Go to Render Dashboard → Your Web Service → Logs

Look for:
- Error messages around the time of the login attempt
- Stack traces
- Any mention of:
  - `JwtService`
  - `secret_key_base`
  - `User.find_by`
  - `record_login!`
  - Database connection errors

### 2. Verify Environment Variables in Render

Make sure these are set:
- ✅ `SECRET_KEY_BASE` (critical!)
- ✅ `JWT_SECRET_KEY` (or it will use SECRET_KEY_BASE)
- ✅ `DATABASE_URL` (should be auto-set)
- ✅ `RAILS_ENV=production`

### 3. Test the Endpoint Directly

Try calling the login endpoint directly with curl:

```bash
curl -X POST https://reed-bootie-hunter-v1-1.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

This will show the actual error response.

### 4. Common Causes of 500 Error

1. **JWT Secret Key Missing**
   - `JwtService.encode` fails if no secret key
   - Check: `SECRET_KEY_BASE` or `JWT_SECRET_KEY` set in Render

2. **Database Connection Issue**
   - User lookup fails
   - Check: `DATABASE_URL` is set and database is accessible

3. **Missing Column**
   - `last_login_at` column doesn't exist
   - Check: Migrations ran successfully

4. **User Model Issue**
   - `user.active?` method fails
   - Check: User model has `active` column

## Next Steps

1. **Check Render logs** - This will tell us exactly what's failing
2. **Verify environment variables** - Make sure all are set
3. **Test with curl** - See the actual error response
4. **Check database** - Verify user exists and can be queried

## Error Handling Added

I've added error handling that will:
- Log errors to Rails logs
- Return a proper error response instead of crashing
- Help identify the exact failure point

---

**Action Required**: Check Render logs to see the actual error message!
