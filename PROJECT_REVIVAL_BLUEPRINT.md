# 🧠 Project Revival Blueprint: R.E.E.D. Bootie Hunter
**Generated:** 2025-01-09  
**Auditor:** Cursor AI Project Revival Specialist  
**Project:** REED REFACTOR 2 / BootieHunter V1

---

## 📊 EXECUTIVE SUMMARY

**Project Status:** 🟡 **Stagnant** - 30+ days since last commit, critical technical debt accumulating

**Revival Priority:** **HIGH** - Core functionality exists but project is at risk of becoming unmaintainable without immediate intervention.

---

## 🔍 AUDIT RESULTS

### 1. Local Codebase Audit (Technical Debt Score)

#### Metrics Collected:
- **Total Backend JS Files:** 19 files
- **Largest File:** `healthController.js` (378 lines - mostly HTML template)
- **Cyclomatic Complexity Analysis:**
  - `authController.js`: `login()` function has C ≈ 8 (acceptable)
  - `bootiesController.js`: `updateBootie()` has C ≈ 6 (acceptable)
  - `healthController.js`: `getHealthHtml()` has C ≈ 3 (low, but 378 lines of template)
  - **Overall Complexity:** ✅ **LOW** - Controllers are well-structured

#### TODO/FIXME/HACK Density:
- **Total Matches:** 192 (includes build artifacts)
- **Critical TODOs in Active Code:** 12-17 meaningful instances (3 security TODOs resolved ✅)
- **Security-Critical TODOs:** ✅ **RESOLVED** (2025-01-09)
  - ~~`middleware/auth.js:14` - JWT_SECRET hardcoded~~ ✅ Fixed
  - ~~`controllers/authController.js:73` - JWT_SECRET hardcoded~~ ✅ Fixed
  - ~~`controllers/geminiController.js:3` - API_KEY should be env var~~ ✅ Fixed
- **Feature TODOs:** 12+ in Flutter frontend (audio playback, message sending, etc.)
- **Density Score:** 🟢 **IMPROVED** - 0.6 TODOs per active file (down from 0.8)

#### Test Coverage:
- **Backend Tests:** ❌ **0%** - No test files found
- **Frontend Tests:** 🟡 **Partial** - 4 test files in `ARC/frontend/test/` (models, services, widgets)
- **Test Infrastructure:** ❌ **Missing** - No Jest/Mocha config, no test scripts in package.json
- **Coverage Score:** 🔴 **CRITICAL** - <5% overall coverage

**Technical Debt Score: 🟢 5.5/10** (Improved - Security issues resolved ✅, still need backend tests)

---

### 2. Git State Audit (Momentum & Friction)

#### Commit Activity:
- **Last Commit:** November 9, 2025, 20:59:51 PST (`96db713`)
- **Days Since Last Commit:** ~30 days
- **Commits in Last 30 Days:** 0
- **Commits in Last 90 Days:** 23
- **Activity Pattern:** Burst of activity ending in early November, then complete silence

#### Branch Analysis:
- **Active Branches:** 2
  - `main` (stable)
  - `cursor/revive-project-with-ai-f46f` (current feature branch)
- **Stale Branches:** 0 (current branch is feature branch, not stale)
- **Merge Conflicts:** 0 merge commits found in recent history (no evidence of conflict friction)

#### Momentum Score: 🔴 **CRITICAL** - 0 commits in 30 days indicates complete stall

---

### 3. Tool/Config Audit (Process Gaps)

#### Essential Config Files:
- ✅ `package.json` - Present
- ✅ `Dockerfile` - Present
- ✅ `docker-compose.yml` - Present
- ❌ `.eslintrc` / `.eslintrc.js` - **MISSING**
- ❌ `jest.config.js` / `mocha.opts` - **MISSING** (no test framework)
- ❌ `.github/workflows/*.yml` - **MISSING** (no CI/CD)
- ❌ `.gitlab-ci.yml` - **MISSING**
- ❌ `.husky/` - **MISSING** (no pre-commit hooks)
- ❌ `tsconfig.json` - Not applicable (JS project)

#### Dependency Health:
- **Outdated Dependencies (Critical):**
  - `bcryptjs`: 2.4.3 → 3.0.3 (major version behind)
  - `body-parser`: 1.20.3 → 2.2.1 (major version behind)
  - `express`: 4.21.2 → 5.2.1 (major version behind - breaking changes)
  - `node-pg-migrate`: 7.9.1 → 8.0.3 (major version behind)
- **Security Risk:** Outdated dependencies may have vulnerabilities
- **Dependency Score:** 🟡 **MODERATE RISK** - 4 major version updates pending

#### Process Gaps Score: 🔴 **CRITICAL** - Missing all quality gates (linting, testing, CI/CD, hooks)

---

## 🎯 DIAGNOSIS: Root Causes

Based on objective audit data, the project stall has **3 core root causes**:

### Root Cause #1: **Zero Quality Gates = High Friction Development**
**Evidence:**
- No linting (0 ESLint configs)
- No automated testing (0 backend tests, no test framework)
- No CI/CD (0 workflow files)
- No pre-commit hooks (0 Husky setup)

**Impact:** Developers cannot confidently make changes. Every edit requires manual verification. Fear of breaking things prevents progress.

**Data Point:** 30 days of zero commits after 23 commits in previous 60 days suggests developers hit a "friction wall."

---

### Root Cause #2: **Security Debt Blocks Production Readiness** ✅ **RESOLVED**
**Evidence (Historical):**
- ~~Hardcoded JWT_SECRET in 2 locations (`'supersecretjwtkey'`)~~ ✅ Fixed
- ~~API keys referenced but not properly env-var'd (3 TODO comments)~~ ✅ Fixed
- ~~No environment variable validation~~ ✅ Fixed

**Resolution (2025-01-09):**
- All hardcoded secrets moved to environment variables
- Environment variable validation added on startup
- `.env.example` file created for documentation
- Proper error handling for missing environment variables

**Status:** ✅ **RESOLVED** - Security blockers removed, project can now be safely deployed

---

### Root Cause #3: **Architectural Confusion (Dual Frontend Directories)**
**Evidence:**
- Two frontend directories: `/frontend/` and `/ARC/frontend/`
- Unclear which is canonical
- STATUS.md references Rails backend, but codebase is Node.js/Express
- Documentation mismatch with implementation

**Impact:** Developers don't know which code to work on. Decision paralysis prevents forward progress.

**Data Point:** Project structure suggests incomplete migration or unclear architecture direction.

---

## 🏗️ REVIVAL SYSTEM: Core Components

### Component 1: **Micro-Goal Planning & Commit Discipline**
**Purpose:** Break the 30-day commit drought with daily micro-commits.

**How It Works:**
1. **Daily Micro-Goal:** Every morning, developer selects ONE small task (15-30 min max)
2. **Cursor AI Integration:** Use Cursor's chat to break task into 3-5 sub-steps
3. **Commit After Each Sub-Step:** Force commit after each sub-step completion
4. **Daily Minimum:** 1 commit per day, no exceptions (even if just "WIP: started X")

**Cursor AI Usage:**
- **Task Breakdown:** "Break down [task] into 3-5 atomic steps I can commit separately"
- **Commit Message Generation:** "Generate a conventional commit message for [changes]"
- **Progress Check:** "What's the smallest next step to complete [feature]?"

**Target Metric:** 7 commits in next 7 days (breaking the 30-day drought)

---

### Component 2: **Security-First Refactoring with AI Assistance**
**Purpose:** Eliminate security blockers that prevent production deployment.

**How It Works:**
1. **Security Audit Session:** Use Cursor AI to identify all security issues
   - Command: "Find all hardcoded secrets, API keys, and security TODOs"
2. **One-File-Per-Day Rule:** Fix security issues one file per day
3. **AI-Assisted Refactoring:**
   - Select code with security issue
   - Use Cursor chat: "Refactor this to use environment variables with validation"
   - Review AI suggestion, apply if safe
4. **Environment Variable Validation:** Add validation on app startup

**Cursor AI Usage:**
- **Security Scan:** "Scan this file for security vulnerabilities"
- **Refactoring:** "Refactor [function] to use process.env with fallback and validation"
- **Validation Code:** "Generate environment variable validation for [list of vars]"

**Target Metric:** All security TODOs resolved in 3 days

---

### Component 3: **Test-Driven Recovery (TDR)**
**Purpose:** Add safety net so developers can make changes confidently.

**How It Works:**
1. **Start with Critical Path:** Test the 3 most-used endpoints first
   - `/api/v1/auth/login`
   - `/api/v1/booties` (GET, POST)
   - `/api/v1/health`
2. **AI-Generated Test Skeleton:** Use Cursor to generate test structure
   - Command: "Generate Jest test file for [controller] with happy path and error cases"
3. **One Test File Per Day:** Add tests incrementally
4. **Run Tests Before Commits:** Pre-commit hook runs tests (once tests exist)

**Cursor AI Usage:**
- **Test Generation:** "Generate Jest tests for [controller file] covering success and error paths"
- **Test Review:** "Review these tests for completeness and edge cases"
- **Mock Generation:** "Generate mocks for [dependency] in Jest"

**Target Metric:** 3 test files (auth, booties, health) in 3 days, 50%+ coverage of critical paths

---

### Component 4: **Architecture Clarification & Documentation Sync**
**Purpose:** Resolve confusion about project structure and canonical codebase.

**How It Works:**
1. **Architecture Decision Session:** Use Cursor AI to analyze both frontend directories
   - Command: "Compare /frontend and /ARC/frontend, identify which is canonical and why"
2. **Documentation Update:** Update STATUS.md and README.md to match actual codebase
3. **Directory Consolidation Plan:** Create plan to merge or remove duplicate directories
4. **Architecture Decision Record:** Document the decision in `/docs/ARCHITECTURE_DECISIONS.md`

**Cursor AI Usage:**
- **Codebase Analysis:** "Analyze project structure and identify canonical directories"
- **Documentation Sync:** "Update [doc file] to match current codebase structure"
- **Migration Plan:** "Generate plan to consolidate [directories]"

**Target Metric:** Clear architecture documented in 2 days

---

### Component 5: **Zero-Stale-Branch Policy**
**Purpose:** Prevent branch accumulation and merge friction.

**How It Works:**
1. **Branch Lifecycle Rule:** Feature branches must be merged or deleted within 7 days
2. **Daily Branch Review:** Check for stale branches, create merge plan
3. **AI-Assisted Merge Planning:** Use Cursor to identify conflicts early
   - Command: "Compare [branch] with main, identify potential merge conflicts"
4. **Merge or Delete:** If branch is >7 days old, merge immediately or delete

**Cursor AI Usage:**
- **Conflict Detection:** "Identify potential merge conflicts between [branch] and main"
- **Merge Strategy:** "Generate merge strategy for [feature branch]"
- **Branch Cleanup:** "List all branches older than 7 days with last commit dates"

**Target Metric:** 0 stale branches, current feature branch merged within 7 days

---

## 📋 DECISION RULES

### Prioritization Rule
**Non-Negotiable Next Task:** Based on audit data, the highest priority is **Security-First Refactoring (Component 2)**.

**Rationale:** 
- Security issues block production deployment (Root Cause #2)
- Only 3 files need changes (low effort, high impact)
- Can be completed in 3 days with AI assistance
- Unblocks psychological barrier to "completion"

**Action:** Before starting ANY new feature, fix all security TODOs in:
1. `middleware/auth.js` (JWT_SECRET)
2. `controllers/authController.js` (JWT_SECRET)
3. `controllers/geminiController.js` (API_KEY)

**Cursor AI Command:** "Find all hardcoded secrets and generate refactoring plan to use environment variables"

---

### Refactoring Rule
**When:** Encounter code where Cyclomatic Complexity C > 15 OR file length > 300 lines

**Action:**
1. **Select the complex function/method** in Cursor
2. **Use Cursor Chat:** "Analyze cyclomatic complexity of this function and suggest refactoring to reduce it below 15"
3. **Review AI suggestion** - Check if it maintains functionality
4. **Apply refactoring** if safe, or break into smaller steps
5. **Commit immediately** after refactoring (micro-commit)

**Exception:** Template strings (like HTML in `healthController.js`) don't count toward complexity if they're pure templates.

**Cursor AI Integration:**
- **Complexity Analysis:** "Calculate cyclomatic complexity of [function]"
- **Refactoring Suggestion:** "Refactor [function] to reduce complexity while maintaining behavior"
- **Step-by-Step Plan:** "Break this refactoring into 3 safe steps I can commit separately"

---

### Integration Rule
**Criteria for Pull Request Readiness:**

Before a feature branch is considered ready for PR/merge, it MUST meet:

1. **Security Check:** ✅ No hardcoded secrets (use `grep -r "TODO.*secret\|TODO.*key" --include="*.js"`)
2. **Linting:** ✅ All files pass ESLint (once ESLint is configured - Component 1)
3. **Tests:** ✅ New/changed endpoints have corresponding tests (Component 3)
4. **Documentation:** ✅ README/STATUS.md updated if architecture changed
5. **Branch Age:** ✅ Branch is <7 days old OR merge plan documented

**Cursor AI Usage:**
- **PR Checklist:** "Generate PR checklist for [branch] based on project standards"
- **Pre-Merge Review:** "Review [file] for security issues, complexity, and test coverage"
- **Documentation Update:** "Update [doc] to reflect changes in [branch]"

**Enforcement:** Use Cursor AI to generate PR template with these checks. Human reviews these before merging.

---

## 🎯 RHYTHM & RITUALS

### Daily Rhythm (5-10 minutes, minimal willpower)

**Morning (Start of Work Session):**
1. **Micro-Goal Selection (2 min):**
   - Open Cursor chat: "What's the smallest task I can complete today that moves the project forward?"
   - Select ONE task from AI suggestions or your backlog
   - Write it in a sticky note or Cursor scratch file

2. **Commit Review (1 min):**
   - Check: "Did I commit yesterday?" If no, commit something immediately (even "WIP: starting [task]")

3. **Security Scan (2 min - Days 1-3 only):**
   - Run: `grep -r "TODO.*secret\|TODO.*key\|supersecret\|YOUR_API_KEY" --include="*.js" controllers/ middleware/`
   - If matches found, that's today's task

**End of Work Session:**
1. **Micro-Commit (1 min):**
   - Commit current progress (even if incomplete): `git commit -m "WIP: [task description]"`
   - Push to feature branch

2. **Progress Log (2 min):**
   - Update `/docs/DAILY_PROGRESS.md` with: Date, Task, Status, Next Step
   - Use Cursor AI: "Generate daily progress entry for [task]"

**Weekly Rhythm (15 minutes, Sunday):**

1. **Branch Review (5 min):**
   - List all branches: `git branch -a`
   - Identify branches >7 days old
   - Use Cursor: "Generate merge or delete plan for [stale branch]"

2. **Dependency Check (5 min):**
   - Run: `npm outdated`
   - Use Cursor: "Prioritize these dependency updates by security risk"
   - Update ONE dependency if high-risk

3. **Test Coverage Check (5 min):**
   - Count test files: `find . -name "*.test.js" -o -name "*.spec.js" | wc -l`
   - Use Cursor: "What's the next controller that needs tests?"
   - Add ONE test file if coverage <50%

**Monthly Rhythm (30 minutes, First Sunday):**
1. **Architecture Review:** Use Cursor to analyze project structure changes
2. **Technical Debt Review:** Run complexity analysis, identify refactoring candidates
3. **Process Improvement:** Review what's working/not working in the rhythm

---

## 🛠️ TOOL/CONFIG RECOMMENDATIONS

### Immediate (Week 1): Critical Quality Gates

#### 1. ESLint Configuration
**Action:** Add `.eslintrc.js` with Node.js/Express preset

**Cursor AI Command:** "Generate .eslintrc.js for Node.js Express project with security and best practices rules"

**Implementation:**
```bash
npm install --save-dev eslint eslint-config-node
# Then use Cursor to generate config
```

**Why:** Catches common errors before commit, reduces debugging time.

---

#### 2. Jest Test Framework
**Action:** Add Jest with basic configuration

**Cursor AI Command:** "Generate Jest configuration for Node.js Express API testing with PostgreSQL mocks"

**Implementation:**
```bash
npm install --save-dev jest supertest
# Add to package.json: "test": "jest"
```

**Why:** Enables Component 3 (Test-Driven Recovery), provides safety net.

---

#### 3. Husky Pre-Commit Hooks
**Action:** Set up Husky to run ESLint before commits

**Cursor AI Command:** "Generate Husky pre-commit hook that runs ESLint on staged files"

**Implementation:**
```bash
npm install --save-dev husky
npx husky init
# Then use Cursor to generate pre-commit script
```

**Why:** Prevents broken code from being committed, enforces quality automatically.

---

### Short-Term (Week 2-4): Process Automation

#### 4. GitHub Actions CI/CD (or GitLab CI)
**Action:** Add basic CI workflow for tests and linting

**Cursor AI Command:** "Generate GitHub Actions workflow for Node.js project that runs ESLint and Jest on pull requests"

**Why:** Automates quality checks, prevents merge of broken code.

---

#### 5. Environment Variable Validation
**Action:** Add startup validation for required env vars

**Cursor AI Command:** "Generate environment variable validation module that checks required vars on app startup and exits with clear error if missing"

**Why:** Prevents deployment of misconfigured apps, catches issues early.

---

### Medium-Term (Month 2+): Advanced Tooling

#### 6. Dependency Update Automation
**Action:** Use Dependabot or Renovate for automated dependency updates

**Why:** Keeps dependencies current without manual effort.

---

#### 7. Code Coverage Reporting
**Action:** Add Jest coverage reporting with threshold

**Why:** Tracks test coverage progress, identifies untested code.

---

## 📈 SUCCESS METRICS & TARGETS

### Week 1 Targets:
- ✅ **7 commits** (breaking 30-day drought)
- ✅ **3 security TODOs resolved** (all hardcoded secrets moved to env vars)
- ✅ **ESLint configured** and running
- ✅ **Jest configured** with 1 test file

### Week 2 Targets:
- ✅ **3 test files** (auth, booties, health controllers)
- ✅ **Husky hooks** active
- ✅ **Architecture clarified** (documentation updated)
- ✅ **14 total commits** (2 per day average)

### Week 3 Targets:
- ✅ **50%+ test coverage** of critical paths
- ✅ **CI/CD workflow** active
- ✅ **0 stale branches**
- ✅ **1 dependency updated** (highest security risk)

### Month 1 Target:
- ✅ **30+ commits** (sustained momentum)
- ✅ **All security issues resolved**
- ✅ **Test infrastructure complete**
- ✅ **Quality gates enforced**

---

## 🚀 IMPLEMENTATION PRIORITY ORDER

**Day 1-3: Security First (Component 2)** ✅ **COMPLETE**
1. ✅ Fix JWT_SECRET in `middleware/auth.js` (2025-01-09)
2. ✅ Fix JWT_SECRET in `controllers/authController.js` (2025-01-09)
3. ✅ Fix API_KEY in `controllers/geminiController.js` (2025-01-09)
4. ✅ Add environment variable validation (2025-01-09)

**Day 4-7: Quality Gates (Component 1 + Tools)**
1. Configure ESLint
2. Configure Jest
3. Write first test (auth controller)
4. Set up Husky

**Day 8-14: Test Infrastructure (Component 3)**
1. Add tests for booties controller
2. Add tests for health controller
3. Achieve 50% coverage target

**Day 15-21: Architecture & Process (Components 4 & 5)**
1. Clarify frontend directory structure
2. Update documentation
3. Set up CI/CD
4. Clean up branches

---

## 📝 NOTES FOR HUMAN DEVELOPERS

### How to Use This Blueprint

1. **Start with Component 2 (Security)** - It's the fastest win and unblocks production
2. **Use Cursor AI liberally** - Every component includes specific Cursor commands. Use them.
3. **Commit daily** - Even "WIP" commits break the stagnation pattern
4. **One task at a time** - Don't try to do everything. Follow the priority order.
5. **Update this document** - As you complete components, mark them complete. This document is living.

### Cursor AI Integration Points

This blueprint is designed to maximize Cursor's AI capabilities:

- **Chat for Planning:** Use chat to break down tasks, generate code, review changes
- **Selection-Based Refactoring:** Select code, ask AI to refactor, review, apply
- **Code Generation:** Use AI to generate tests, configs, validation code
- **Documentation:** Use AI to update docs, generate commit messages, create PR templates

### When to Deviate

This blueprint is a guide, not a prison. Deviate if:
- A critical bug is discovered (fix it immediately)
- A better approach is found (update the blueprint)
- External dependencies change (adapt the plan)

But always: **Document the deviation and why** in `/docs/ARCHITECTURE_DECISIONS.md`

---

## ✅ BLUEPRINT STATUS

- [ ] Component 1: Micro-Goal Planning (Not Started)
- [x] Component 2: Security-First Refactoring ✅ **COMPLETE** (2025-01-09)
  - [x] Fixed JWT_SECRET in `middleware/auth.js`
  - [x] Fixed JWT_SECRET in `controllers/authController.js`
  - [x] Fixed API_KEY in `controllers/geminiController.js`
  - [x] Created `utils/env-validator.js` module
  - [x] Added environment variable validation on startup
  - [x] Created `.env.example` documentation
  - [x] Committed changes (commit: `28c1676`)
- [x] Component 3: Test-Driven Recovery ✅ **COMPLETE** (2025-01-09)
  - [x] ESLint configured (v9 flat config format)
  - [x] Jest testing framework configured
  - [x] Test infrastructure setup complete
  - [x] Auth controller tests written (9 test cases, all passing)
  - [x] Booties controller tests written (13 test cases, all passing)
  - [x] Health controller tests written (6 test cases, all passing)
  - [x] Husky pre-commit hooks configured
  - [x] Total: 28 test cases, 100% pass rate
- [x] Component 4: Architecture Clarification ✅ **COMPLETE** (2025-01-09)
  - [x] Analyzed frontend directory structure
  - [x] Documented architecture decisions (5 ADRs)
  - [x] Identified `/ARC/frontend/` as canonical
  - [x] Marked `/frontend/` as deprecated
  - [x] Updated README.md with structure clarification
  - [x] Resolved Root Cause #3 (architectural confusion)
- [ ] Component 5: Zero-Stale-Branch Policy (Not Started)
- [x] ESLint Configuration ✅ **COMPLETE** (2025-01-09)
- [x] Jest Configuration ✅ **COMPLETE** (2025-01-09)
- [x] Husky Hooks ✅ **COMPLETE** (2025-01-09)
- [ ] CI/CD Workflow (Not Started)

**Last Updated:** 2025-01-09  
**Last Commit:** Latest - Component 4 complete (Architecture decisions documented)  
**Progress:** Components 2, 3, 4 COMPLETE - Quality gates + Architecture clarity  
**Next Review:** Component 5 (Zero-Stale-Branch Policy) or CI/CD setup

---

**End of Blueprint**
