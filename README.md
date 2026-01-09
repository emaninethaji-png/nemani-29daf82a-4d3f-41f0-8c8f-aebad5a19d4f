# Secure Task Management System - Full Stack NX Monorepo

A secure, production-ready task management system built with NestJS (backend), Angular (frontend), SQLite database, JWT authentication, and RBAC (Role-Based Access Control).

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security Considerations](#security-considerations)

## Overview

This is a comprehensive task management solution implementing enterprise-grade security patterns:

- **JWT-based Authentication**: Secure token-based auth with 24-hour expiration
- **Role-Based Access Control (RBAC)**: Three-tier role system (Owner, Admin, Viewer)
- **Organization Hierarchy**: 2-level organizational structure with scoped resource access
- **Audit Logging**: Complete action tracking for Owner/Admin users
- **Drag-and-Drop Tasks**: Smooth task reordering with persistence
- **Responsive UI**: Mobile-first Angular dashboard

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database operations
- **SQLite** - Lightweight embedded database
- **JWT (Passport)** - Token-based authentication
- **Jest** - Testing framework
- **bcrypt** - Password hashing

### Frontend
- **Angular 15+** - Modern web framework
- **TailwindCSS** - Utility-first CSS framework
- **Angular CDK** - Drag-and-drop functionality
- **RxJS** - Reactive programming library

### Monorepo
- **NX** - Monorepo tool for scalable development
- **TypeScript** - Type-safe development

## Architecture

```
root/
├── apps/
│   ├── api/                    # NestJS backend application
│   │   ├── src/
│   │   │   ├── auth/           # JWT authentication logic
│   │   │   ├── task/           # Task management module
│   │   │   ├── user/           # User management
│   │   │   ├── audit-log/      # Audit logging
│   │   │   ├── entities/       # TypeORM entities
│   │   │   ├── common/         # Shared guards, decorators, interceptors
│   │   │   └── main.ts         # Application entry point
│   │   └── test/              # Test files
│   └── dashboard/             # Angular frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/       # Services, interceptors
│       │   │   ├── features/   # Feature modules (auth, tasks)
│       │   │   └── app.module.ts
│       │   └── main.ts
│       └── test/
└── libs/
    ├── data/                  # Shared DTOs and interfaces
    │   └── src/index.ts
    └── auth/                  # Shared RBAC logic
        └── src/index.ts
```

### Key Design Patterns

1. **Modular Architecture**: Separated concerns with feature modules
2. **Shared Libraries**: Common DTOs and RBAC logic in `libs/`
3. **Guard-Based Security**: NestJS guards enforce permissions
4. **Decorator Pattern**: Custom decorators for permission checking
5. **Service Layer**: Business logic separated from controllers
6. **Interceptor Pattern**: Auth token injection via HTTP interceptors

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd [your-name]-[uuid]
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**

Create `.env` file in project root:
```env
# Backend
JWT_SECRET=your-super-secret-key-change-in-production
DATABASE_PATH=./data/app.db
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. **Create Database & Run Migrations**
```bash
npm run nx:api -- migration:run
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
npm run nx:api -- serve
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm run nx:dashboard -- serve
```
Frontend runs on `http://localhost:4200`

#### Production Build
```bash
npm run build:api
npm run build:dashboard
```

## Database Schema

### Users Table
- `id` (UUID): Primary key
- `email` (String): Unique email address
- `password` (String): Bcrypt hashed password
- `firstName`, `lastName` (String): User names
- `organizationId` (UUID): Foreign key to organizations
- `role` (Enum): owner, admin, viewer
- `createdAt`, `updatedAt` (Timestamp)

### Organizations Table
- `id` (UUID): Primary key
- `name` (String): Organization name
- `ownerId` (UUID): Organization owner user ID
- `parentId` (UUID, nullable): Parent organization ID for hierarchy
- `createdAt`, `updatedAt` (Timestamp)

### Tasks Table
- `id` (UUID): Primary key
- `title`, `description` (String): Task details
- `status` (Enum): todo, in_progress, completed
- `category` (String): Task category for filtering
- `organizationId` (UUID): Scoped to organization
- `createdById` (UUID): Creator user ID
- `assignedToId` (UUID, nullable): Assigned user
- `dueDate` (Timestamp, nullable): Due date
- `order` (Integer): Sort order for drag-and-drop
- `createdAt`, `updatedAt` (Timestamp)

### Audit Logs Table
- `id` (UUID): Primary key
- `userId` (UUID): User who performed action
- `action` (String): CREATE, READ, UPDATE, DELETE
- `resource` (String): task, user, organization
- `resourceId` (UUID): ID of affected resource
- `result` (Enum): success, failure
- `details` (String, nullable): Additional context
- `timestamp` (Timestamp): When action occurred

## Authentication & Authorization

### JWT Implementation

Tokens include payload:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "organizationId": "org-id",
  "role": "owner",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### RBAC Permission Matrix

#### Owner
- Create, Read, Update, Delete tasks (organization-wide)
- Manage users
- View audit logs
- Update organization settings

#### Admin
- Create, Read, Update, Delete tasks (organization-wide)
- Read users
- View audit logs
- Cannot manage organization settings

#### Viewer
- Read tasks only
- Cannot create, update, or delete
- Cannot view audit logs

### Permission Guards

Endpoints protected with custom decorators:
```typescript
@RequirePermission({
  resource: PermissionResource.TASK,
  action: PermissionAction.CREATE
})
@UseGuards(JwtAuthGuard, PermissionGuard)
async create(createTaskDto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
  // Only authorized users can create tasks
}
```

### Organization Scoping

All resources are automatically scoped to user's organization. Users cannot access resources from other organizations even with valid JWT.

## API Documentation

### Authentication Endpoints

**POST /auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Task Endpoints

**POST /tasks** - Create task (Owner/Admin)
```json
Request:
{
  "title": "Build API",
  "description": "Implement REST endpoints",
  "category": "Work",
  "assignedToId": "user-id",
  "dueDate": "2024-12-31T23:59:59Z"
}

Response (201):
{
  "id": "task-id",
  "title": "Build API",
  ...
}
```

**GET /tasks** - List tasks (All authenticated users)
```
Response (200):
[
  {
    "id": "task-id",
    "title": "Build API",
    "status": "in_progress",
    ...
  }
]
```

**GET /tasks/:id** - Get task (All authenticated users)
```
Response (200):
{
  "id": "task-id",
  "title": "Build API",
  ...
}
```

**PUT /tasks/:id** - Update task (Owner/Admin)
```json
Request:
{
  "status": "completed",
  "assignedToId": "new-user-id"
}

Response (200):
{
  "id": "task-id",
  ...
}
```

**DELETE /tasks/:id** - Delete task (Owner/Admin)
```
Response (204): No content
```

**POST /tasks/reorder** - Reorder tasks (Owner/Admin)
```json
Request:
[
  { "id": "task-1", "order": 0 },
  { "id": "task-2", "order": 1 }
]

Response (204): No content
```

**GET /audit-log** - View audit logs (Owner/Admin only)
```
Response (200):
[
  {
    "id": "log-id",
    "userId": "user-id",
    "action": "CREATE",
    "resource": "task",
    "resourceId": "task-id",
    "result": "success",
    "timestamp": "2024-01-08T10:30:00Z"
  }
]
```

## Testing

### Run All Tests
```bash
npm run test
```

### Backend Tests
```bash
npm run test:api
```

Tests cover:
- RBAC permission checks
- JWT authentication flows
- Task CRUD operations
- Organization scoping
- Audit logging

### Frontend Tests
```bash
npm run test:dashboard
```

Tests cover:
- Auth service mocking
- Task service integration
- Component rendering
- Form validation

## Security Considerations

### Implemented

✅ **JWT Token Authentication**
- 24-hour token expiration
- Bearer token in Authorization header
- Secure secret key in environment variables

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Never stored in plain text
- Validated on login

✅ **RBAC with Organization Scoping**
- Three-tier role hierarchy
- Permission matrix enforcement
- Organization-level data isolation

✅ **Audit Logging**
- All write operations logged
- Includes user, action, resource, timestamp
- Available to Owner/Admin only

✅ **HTTP Security**
- CORS configured appropriately
- Bearer token in headers (not URL params)
- Input validation on all endpoints

### Recommended for Production

🔒 **Token Refresh**
- Implement refresh tokens for long-lived sessions
- Rotate access tokens every 1-4 hours

🔒 **HTTPS Only**
- Enforce TLS 1.2+
- Set secure cookie flags

🔒 **Rate Limiting**
- Prevent brute force attacks on login
- Throttle API endpoints

🔒 **CSRF Protection**
- Add CSRF tokens for state-changing requests
- Validate origin headers

🔒 **JWT Signing**
- Use RS256 (asymmetric) instead of HS256 for multi-service architectures
- Keep private key secure

🔒 **Permission Caching**
- Cache permission checks for performance
- Invalidate on role changes

## Development Workflow

### Add New Feature to Backend

1. Create entity in `apps/api/src/entities/`
2. Create service in `apps/api/src/[feature]/[feature].service.ts`
3. Create controller with guards in `apps/api/src/[feature]/[feature].controller.ts`
4. Create module in `apps/api/src/[feature]/[feature].module.ts`
5. Register in `apps/api/src/app.module.ts`
6. Add tests in `apps/api/src/[feature]/[feature].spec.ts`

### Add New Feature to Frontend

1. Create feature module in `apps/dashboard/src/app/features/[feature]/`
2. Add service in `apps/dashboard/src/app/features/[feature]/[feature].service.ts`
3. Create components and templates
4. Update routing in `apps/dashboard/src/app/app-routing.module.ts`
5. Add tests in component `.spec.ts` files

## Future Enhancements

1. **Advanced Features**
   - Real-time collaboration with WebSockets
   - Task comments and attachments
   - Custom roles and granular permissions
   - Bulk operations

2. **Performance**
   - Redis caching for permissions
   - Database query optimization
   - Frontend state management (NgRx)
   - Lazy loading for routes

3. **Scalability**
   - Multi-database support
   - API Gateway for multi-service architecture
   - Event-driven architecture
   - Microservices decomposition

4. **UX/UI**
   - Dark mode toggle
   - Advanced filtering and search
   - Analytics dashboard
   - Mobile app (React Native)

## Submission

Submit your work through the official assessment portal:
https://forms.gle/1iJ2AHzMWsWecLUE6

## License

Proprietary - Assessment Project
