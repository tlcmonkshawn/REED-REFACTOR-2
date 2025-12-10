# Architecture Decision Records (ADR)

This document records architectural decisions made for the R.E.E.D. Bootie Hunter project.

---

## ADR-001: Frontend Directory Structure Clarification

**Date:** 2025-01-09  
**Status:** Accepted  
**Decision Makers:** Project Revival Audit

### Context

The project has two frontend directories:
- `/frontend/` - Minimal Flutter application
- `/ARC/frontend/` - Complete Flutter application

This dual structure caused confusion about which directory is canonical and which code developers should work on.

### Analysis

**`/frontend/` (Minimal/Outdated):**
- 3 screens: call_screen, home_screen, login_screen
- 3 services: api_service, auth_service, gemini_live_service
- 1 model: user
- 1 provider: auth_provider
- Basic pubspec.yaml (name: "frontend")
- No test files
- No README
- Appears to be an early prototype or incomplete implementation

**`/ARC/frontend/` (Canonical/Complete):**
- 11 screens: bootie_detail, booties_list, call, chat, home, landing, login, messages, onboarding, phone, prompts_config, reed_introduction
- 8 services: api, auth, bootie, conversation, gemini_live, image_analysis, image, location, prompt
- 5 models: bootie, conversation, message, prompt, user
- 2 providers: auth_provider, bootie_provider
- 3 widgets: app_icon, image_picker_bottom_sheet, status_badge
- Comprehensive test suite (4 test files)
- Proper pubspec.yaml (name: "bootiehunter")
- README.md documentation
- Web assets (icons, manifest.json)
- Matches TRUTH.PROJECT.md specifications

### Decision

**`/ARC/frontend/` is the canonical frontend directory.**

Reasons:
1. **Completeness:** Contains all features specified in TRUTH.PROJECT.md
2. **Quality:** Has test files, documentation, and proper structure
3. **Naming:** Uses proper app name "bootiehunter" in pubspec.yaml
4. **Features:** Implements full feature set (booties, conversations, messages, etc.)
5. **Maintenance:** Has been actively developed (evidenced by comprehensive structure)

### Consequences

**Immediate Actions:**
1. ✅ Document this decision in ARCHITECTURE_DECISIONS.md
2. ⏳ Update README.md to reference `/ARC/frontend/` as canonical
3. ⏳ Update STATUS.md to clarify frontend location
4. ⏳ Add note to `/frontend/` directory indicating it's deprecated
5. ⏳ Consider removing `/frontend/` in future cleanup (after confirming no dependencies)

**Future Considerations:**
- Rename `/ARC/frontend/` to `/frontend/` (breaking change, requires coordination)
- Or keep `/ARC/frontend/` and document it clearly as the canonical location
- Archive or remove `/frontend/` once confirmed unused

### References

- TRUTH.PROJECT.md - Project specifications
- ARC/frontend/README.md - Frontend documentation
- PROJECT_REVIVAL_BLUEPRINT.md - Root Cause #3 identified this issue

---

## ADR-002: Backend Technology Stack

**Date:** 2025-01-09  
**Status:** Accepted  
**Decision Makers:** Project Revival Audit

### Context

TRUTH.PROJECT.md specifies Rails backend, but codebase uses Node.js/Express.

### Analysis

**Current Implementation:**
- Node.js/Express backend
- PostgreSQL database
- Express routes and controllers
- Node.js ecosystem (npm, package.json)

**Documentation Specifies:**
- Ruby on Rails backend
- ActiveRecord ORM
- Rails migrations

### Decision

**Current Node.js/Express implementation is canonical.**

Reasons:
1. **Active Codebase:** All backend code is Node.js/Express
2. **Working System:** Backend is functional and deployed
3. **Documentation Mismatch:** TRUTH.PROJECT.md appears to be aspirational/specification, not current state
4. **Migration Cost:** Converting to Rails would be a complete rewrite

### Consequences

**Immediate Actions:**
1. ✅ Document this decision
2. ⏳ Update TRUTH.PROJECT.md to reflect Node.js/Express (or mark as future spec)
3. ⏳ Ensure all documentation references Node.js/Express

**Future Considerations:**
- If Rails migration is desired, create separate ADR and migration plan
- For now, continue with Node.js/Express

### References

- Current codebase: `/controllers/`, `/routes/`, `/models/db.js`
- TRUTH.PROJECT.md - Section "Technical Specifications"

---

## ADR-003: Test-Driven Recovery Strategy

**Date:** 2025-01-09  
**Status:** Accepted  
**Decision Makers:** Project Revival Implementation

### Context

Project had 0% backend test coverage, blocking confident refactoring.

### Decision

**Implement Test-Driven Recovery (TDR) with Jest.**

Strategy:
1. Start with critical path endpoints (auth, booties, health)
2. Write tests incrementally (one controller at a time)
3. Set coverage threshold at 30% minimum (realistic for recovery phase)
4. Enforce tests via Husky pre-commit hooks

### Consequences

**Implemented:**
- ✅ Jest framework configured
- ✅ 28 test cases written (auth, booties, health controllers)
- ✅ 100% test pass rate
- ✅ Husky pre-commit hooks enforce test execution
- ✅ Coverage reporting configured

**Future:**
- Increase coverage threshold as more tests are added
- Add tests for remaining controllers (users, locations, gemini, items)
- Add integration tests for full API workflows

### References

- PROJECT_REVIVAL_BLUEPRINT.md - Component 3
- `/__tests__/controllers/` - Test implementations

---

## ADR-004: Environment Variable Validation

**Date:** 2025-01-09  
**Status:** Accepted  
**Decision Makers:** Security-First Refactoring

### Context

Hardcoded secrets (JWT_SECRET, API keys) blocked production deployment.

### Decision

**Validate required environment variables on application startup.**

Implementation:
- Created `utils/env-validator.js` module
- Validates JWT_SECRET, GEMINI_API_KEY, DATABASE_URL
- Exits with clear error if missing
- Warns about placeholder values
- Called in `index.js` before server starts

### Consequences

**Benefits:**
- ✅ Prevents misconfigured deployments
- ✅ Clear error messages guide developers
- ✅ Security issues caught early
- ✅ `.env.example` documents required variables

**Trade-offs:**
- Application won't start if env vars missing (by design)
- Requires proper environment setup (acceptable for production readiness)

### References

- `/utils/env-validator.js` - Implementation
- `.env.example` - Documentation
- PROJECT_REVIVAL_BLUEPRINT.md - Component 2

---

## ADR-005: Quality Gates via Pre-Commit Hooks

**Date:** 2025-01-09  
**Status:** Accepted  
**Decision Makers:** Test-Driven Recovery Implementation

### Context

No automated quality checks, allowing broken code to be committed.

### Decision

**Enforce quality gates via Husky pre-commit hooks.**

Implementation:
- ESLint runs on staged JavaScript files
- Tests run before commit (if test files exist)
- Prevents commits that break linting or tests

### Consequences

**Benefits:**
- ✅ Broken code cannot be committed
- ✅ Consistent code style enforced
- ✅ Tests must pass before commit
- ✅ Reduces debugging time

**Trade-offs:**
- Slightly slower commit process (acceptable)
- Requires tests to be maintained (good practice)
- May block commits if tests fail (by design)

### References

- `.husky/pre-commit` - Hook implementation
- `eslint.config.js` - Linting rules
- PROJECT_REVIVAL_BLUEPRINT.md - Component 3

---

## Future ADRs

As architectural decisions are made, they should be documented here following this format:
- Context
- Analysis
- Decision
- Consequences
- References
