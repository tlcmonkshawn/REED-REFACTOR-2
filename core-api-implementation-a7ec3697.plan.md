<!-- a7ec3697-a2a2-49a1-948b-62fe40dd6ac1 3cb4954d-4a8c-4dd7-83e8-ff12cc6436d8 -->
# Plan: Core API for R.E.E.D. Bootie Hunter

This plan outlines the first phase of development to build the core backend services.

## 1. Project Structure & Dependencies

I will restructure the application for better organization and add necessary libraries.

- Reorganize code from `index.js` into a feature-based structure (e.g., `/routes`, `/controllers`, `/models`).
- Add dependencies to `package.json`: `jsonwebtoken` and `bcryptjs` for authentication, and `node-pg-migrate` for database migrations.

## 2. Database Schema

I will create the core database tables using migrations. This will replace the simple `items` table.

- **`users` table**: To store user information for Agents, Bootie Bosses, and Players, including roles.
- **`locations` table**: For managing multiple store locations.
- **`booties` table**: The central table for inventory items, with fields for `title`, `description`, `status`, `category`, and links to users and locations.

## 3. Authentication API

I will set up a secure authentication system.

- **Endpoints**:
- `POST /api/v1/auth/register`: For new user registration.
- `POST /api/v1/auth/login`: For user login, returning a JSON Web Token (JWT).
- **Middleware**: A function to protect API routes, ensuring only authenticated users can access them.

## 4. Core API Endpoints

I will build the main API endpoints to manage the core data.

- **Booties**: `GET`, `POST`, `PUT`, `DELETE` endpoints at `/api/v1/booties`.
- **Locations**: Endpoints to create and list locations at `/api/v1/locations`.
- **Users**: An endpoint to fetch user profiles, like `GET /api/v1/users/me`.

This foundational work will prepare the backend for implementing the gamification and AI features described in the project document.

### To-dos

- [ ] Restructure the Node.js application and add new dependencies.
- [ ] Create database migration files for users, locations, and booties tables.
- [ ] Implement JWT-based authentication endpoints and middleware.
- [ ] Build CRUD API endpoints for Booties.
- [ ] Build API endpoints for Locations.
- [ ] Build API endpoints for User profiles.