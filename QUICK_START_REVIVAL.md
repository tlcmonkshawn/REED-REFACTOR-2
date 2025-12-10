# 🚀 Quick Start: Project Revival

**Read the full blueprint:** [PROJECT_REVIVAL_BLUEPRINT.md](./PROJECT_REVIVAL_BLUEPRINT.md)

---

## ⚡ Immediate Actions (Next 30 Minutes)

### 1. Fix Security Issues (START HERE - 15 min)

**Use Cursor AI Chat:**
```
Find all hardcoded secrets and API keys in controllers/ and middleware/
```

**Then fix these 3 files:**
- `middleware/auth.js` - Move JWT_SECRET to `process.env.JWT_SECRET`
- `controllers/authController.js` - Move JWT_SECRET to `process.env.JWT_SECRET`  
- `controllers/geminiController.js` - Ensure API_KEY uses `process.env.GEMINI_API_KEY`

**Cursor Command for each file:**
```
Refactor this to use process.env.JWT_SECRET with validation and clear error if missing
```

---

### 2. Create Environment Variable Validation (10 min)

**Use Cursor AI Chat:**
```
Generate a module that validates required environment variables on app startup
Required vars: JWT_SECRET, GEMINI_API_KEY, DATABASE_URL
Should exit with clear error message if any are missing
```

**Then add to `index.js`:**
```javascript
const validateEnv = require('./utils/env-validator');
validateEnv();
```

---

### 3. Make Your First Commit (5 min)

**Commit the security fixes:**
```bash
git add middleware/auth.js controllers/authController.js controllers/geminiController.js utils/env-validator.js
git commit -m "fix(security): move hardcoded secrets to environment variables"
git push
```

**🎉 You just broke the 30-day commit drought!**

---

## 📅 Daily Routine (5 minutes)

**Every morning:**
1. Ask Cursor: "What's the smallest task I can complete today?"
2. Do that ONE task
3. Commit before end of day (even if incomplete: `git commit -m "WIP: [task]"`)

**Every evening:**
1. Commit your progress
2. Update `/docs/DAILY_PROGRESS.md` with what you did

---

## 🎯 This Week's Goals

- [ ] **Day 1:** Fix 3 security issues + env validation
- [ ] **Day 2:** Set up ESLint (use Cursor: "Generate .eslintrc.js for Node.js Express")
- [ ] **Day 3:** Set up Jest (use Cursor: "Generate Jest config for Express API testing")
- [ ] **Day 4:** Write first test for auth controller
- [ ] **Day 5:** Write test for booties controller
- [ ] **Day 6:** Set up Husky pre-commit hooks
- [ ] **Day 7:** Review week, plan next week

**Target: 7 commits this week (1 per day minimum)**

---

## 🛠️ Cursor AI Commands Reference

### Security
- `"Find all hardcoded secrets and API keys"`
- `"Refactor [file] to use environment variables"`
- `"Generate environment variable validation module"`

### Testing
- `"Generate Jest test file for [controller]"`
- `"Generate mocks for [dependency] in Jest"`

### Code Quality
- `"Generate .eslintrc.js for Node.js Express project"`
- `"Analyze cyclomatic complexity of [function]"`

### Architecture
- `"Compare /frontend and /ARC/frontend, identify canonical"`
- `"Update STATUS.md to match current codebase"`

### Daily Tasks
- `"What's the smallest task I can complete today?"`
- `"Break down [task] into 3-5 atomic steps"`
- `"Generate commit message for [changes]"`

---

## 📊 Success Metrics

**Track these weekly:**
- Number of commits (target: 7/week)
- Test files added (target: 1-2/week)
- Security TODOs remaining (target: 0 by end of week 1)
- Days since last commit (target: <1)

---

## 🆘 If You Get Stuck

1. **Ask Cursor AI:** Describe your blocker, ask for help
2. **Check Blueprint:** See [PROJECT_REVIVAL_BLUEPRINT.md](./PROJECT_REVIVAL_BLUEPRINT.md) for detailed guidance
3. **Commit Anyway:** Even broken code can be committed as "WIP" - momentum matters more than perfection
4. **Reduce Scope:** If a task is too big, ask Cursor: "What's the smallest part of [task] I can do in 15 minutes?"

---

**Remember:** The goal is **momentum**, not perfection. One commit per day breaks the stagnation pattern.
