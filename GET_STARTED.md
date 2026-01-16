# Getting Started with LoCo Development

Welcome to the LoCo (Location Commerce) project! This guide will help you get started with development.

---

## 📋 What's Been Completed

### ✅ Planning & Documentation (100%)

1. **[PRD.md](./PRD.md)** - Complete Product Requirements Document
   - 50+ user stories across 9 epics
   - Detailed functional and non-functional requirements
   - Success metrics and release strategy

2. **[ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md)** - Technical Architecture
   - System architecture and tech stack
   - Database schema with PostGIS
   - API design and security considerations

3. **[DISCOVERY_MODE_SPEC.md](./DISCOVERY_MODE_SPEC.md)** - Discovery Mode Feature
   - Comprehensive anti-abuse system
   - User flows and UI designs
   - 5-tier exposure system

4. **[UI_UX_DESIGN.md](./UI_UX_DESIGN.md)** - Complete Design System
   - Design principles and color palette
   - Full UI specifications for all screens
   - Component library and animations

5. **[SPRINT_PLAN.md](./SPRINT_PLAN.md)** - 12-Week Implementation Plan
   - 6 sprints with detailed task breakdown
   - Story points and owner assignments
   - Risk management and contingencies

### ✅ Project Setup (80%)

1. **Monorepo Structure**
   - ✅ Turborepo configuration
   - ✅ Root package.json with workspaces
   - ✅ ESLint and Prettier

2. **Docker Infrastructure**
   - ✅ PostgreSQL 15 with PostGIS
   - ✅ Redis 7
   - ✅ docker-compose.yml

3. **Backend Package**
   - ✅ TypeScript configuration
   - ✅ Package.json with dependencies
   - ✅ Directory structure
   - ⏳ Prisma schema (next step)

4. **Frontend Packages**
   - ✅ Shop dashboard (React + Vite)
   - ✅ Customer app (React Native + Expo)

---

## 🚀 Quick Start (5 minutes)

### Prerequisites

Make sure you have installed:
- **Node.js 20+** ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git**

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install
```

Expected output:
```
added 142 packages in 8s
```

### Step 2: Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d
```

Expected output:
```
✓ Container loco-postgres  Started
✓ Container loco-redis     Started
```

Verify services are running:
```bash
docker-compose ps
```

You should see both containers with status "Up".

### Step 3: Initialize Backend

```bash
cd packages/backend

# Copy environment variables
cp .env.example .env

# Edit .env if needed (optional - defaults work for local dev)
# nano .env

# Install backend dependencies
npm install
```

### Step 4: Set Up Database (Next Session)

This will be covered in Sprint 0, but here's a preview:

```bash
# Initialize Prisma and create schema
npx prisma init

# Create initial migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

---

## 📁 Project Structure

```
loco/
├── packages/
│   ├── backend/              # Fastify API server
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── shops/
│   │   │   │   ├── locations/
│   │   │   │   ├── promotions/
│   │   │   │   ├── users/
│   │   │   │   ├── notifications/
│   │   │   │   ├── analytics/
│   │   │   │   └── redemptions/
│   │   │   ├── shared/       # Shared utilities
│   │   │   │   ├── services/
│   │   │   │   ├── middleware/
│   │   │   │   ├── utils/
│   │   │   │   ├── config/
│   │   │   │   └── types/
│   │   │   └── prisma/       # Database
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shop-dashboard/       # React dashboard for merchants
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── customer-app/         # React Native (Expo) app for customers
│   │   ├── app/              # Expo Router screens
│   │   ├── src/              # Components, stores, services
│   │   └── package.json
│   │
│   └── shared/               # Shared code across packages
│       └── (to be initialized)
│
├── docs/                     # Planning documents
│   ├── PRD.md
│   ├── ARCHITECTURE_PLAN.md
│   ├── DISCOVERY_MODE_SPEC.md
│   ├── UI_UX_DESIGN.md
│   └── SPRINT_PLAN.md
│
├── docker-compose.yml        # Local development services
├── package.json              # Root workspace config
├── turbo.json               # Turborepo pipeline
└── README.md                 # Project overview
```

---

## 🎯 Current Status

### Completed
- [x] All planning documents
- [x] Project structure and monorepo setup
- [x] Docker Compose configuration
- [x] Backend package initialized with Prisma
- [x] Shop dashboard initialized (React + Vite)
- [x] Customer app initialized (React Native + Expo)
- [x] UI/UX designs specified
- [x] Sprint plan created
- [x] Database schema and seed data

### In Progress
- [ ] Authentication implementation
- [ ] API endpoints
- [ ] Testing setup

### Next Steps (Sprint 0)
1. Create Prisma schema
2. Initialize shop-dashboard package
3. Initialize customer-app package
4. Set up CI/CD pipeline
5. Deploy staging environment

---

## 📖 Sprint 0 Tasks (Week 1-2)

### Task Checklist

#### Infrastructure
- [ ] **INFRA-001**: Verify monorepo setup (✅ DONE)
- [ ] **INFRA-002**: Docker Compose setup (✅ DONE)
- [ ] **INFRA-003**: Initialize backend package (✅ DONE)
- [ ] **INFRA-004**: Initialize Prisma and database
  ```bash
  cd packages/backend
  npx prisma init
  # Copy schema from ARCHITECTURE_PLAN.md
  npx prisma migrate dev --name init
  ```

- [ ] **INFRA-005**: Initialize shop-dashboard package
  ```bash
  cd packages/shop-dashboard
  npm create vite@latest . -- --template react-ts
  npm install react-router-dom axios zustand @tanstack/react-query
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- [x] **INFRA-006**: Initialize customer-app package (React Native)
  ```bash
  cd packages/customer-app
  # Copy .env.example to .env and configure API URL
  cp .env.example .env
  # Install dependencies
  npm install
  # Start Expo development server
  npm start
  ```

  **Note**: We chose React Native (Expo) over PWA for superior native features:
  - Background location tracking (geofencing)
  - Push notifications with better reliability
  - Native UI components and performance
  - See [MOBILE_STACK_ANALYSIS.md](./MOBILE_STACK_ANALYSIS.md) for full comparison

- [ ] **INFRA-007**: Set up CI/CD pipeline
  - Create `.github/workflows/ci.yml`
  - Configure automated testing
  - Set up staging deployment

---

## 🛠️ Development Commands

### Root Level

```bash
# Install all dependencies
npm install

# Run all packages in dev mode
npm run dev

# Build all packages
npm run build

# Run tests across all packages
npm run test

# Lint all code
npm run lint

# Format all code
npm run format

# Clean all node_modules and build outputs
npm run clean
```

### Backend

```bash
cd packages/backend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database migrations
npm run migrate

# Prisma Studio (GUI for database)
npm run studio

# Seed database
npm run seed

# Run tests
npm test
```

### Shop Dashboard (Web)

```bash
cd packages/shop-dashboard

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint
npm run lint
```

### Customer App (React Native)

```bash
cd packages/customer-app

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (for testing)
npm run web

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Backend
lsof -i :4000  # Shop dashboard
lsof -i :19000 # Expo Metro bundler
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill process
kill -9 <PID>
```

### Expo/React Native Issues

```bash
# Clear Expo cache
cd packages/customer-app
npx expo start -c

# Reset Metro bundler cache
npx expo start --clear

# Reinstall node modules
rm -rf node_modules
npm install

# iOS simulator issues
npx expo run:ios --device

# Android emulator issues
npx expo run:android --device
```

### Docker Issues

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs redis

# Restart containers
docker-compose restart

# Stop and remove containers
docker-compose down

# Remove volumes (CAUTION: deletes data)
docker-compose down -v
```

### PostgreSQL Connection Issues

```bash
# Test connection
docker exec -it loco-postgres psql -U postgres -d loco_dev

# Enable PostGIS extension manually
docker exec -it loco-postgres psql -U postgres -d loco_dev -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### Redis Connection Issues

```bash
# Test Redis connection
docker exec -it loco-redis redis-cli ping
# Expected: PONG

# Check Redis info
docker exec -it loco-redis redis-cli info
```

### Node Modules Issues

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Reference Documents

### Planning
- **[PRD.md](./PRD.md)** - Product requirements, user stories, features
- **[SPRINT_PLAN.md](./SPRINT_PLAN.md)** - 12-week implementation plan
- **[UI_UX_DESIGN.md](./UI_UX_DESIGN.md)** - Design system and UI specifications

### Technical
- **[ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md)** - System architecture, database schema, API design
- **[DISCOVERY_MODE_SPEC.md](./DISCOVERY_MODE_SPEC.md)** - Discovery mode detailed specification
- **[QUICK_START.md](./QUICK_START.md)** - Original development setup guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code organization conventions

### Product
- **[README.md](./README.md)** - Project overview and key features

---

## 🎨 Design Resources

### Design System Quick Reference

**Colors:**
- Primary: `#6366F1` (Indigo)
- Success: `#22C55E` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

**Font:**
- Family: Inter
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

**Spacing:**
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

**Border Radius:**
- Small: 4px
- Medium: 6px
- Large: 8px
- XL: 12px
- Full: 9999px (pills)

### UI Components to Build

1. **Buttons**: Primary, Secondary, Icon, Loading states
2. **Cards**: Default, Hover, Promotion cards
3. **Inputs**: Text, Number, Date, File upload
4. **Badges**: Success, Warning, Error
5. **Modals**: Slide-up, Center, Full-screen
6. **Toasts**: Success, Warning, Error notifications
7. **Loading**: Spinners, Skeleton screens, Progress bars

---

## 🚦 Sprint Progress Tracking

### Sprint 0 (Current): Infrastructure Setup
**Progress**: 60% Complete

- [x] Monorepo structure
- [x] Docker Compose
- [x] Backend package init
- [ ] Prisma schema
- [ ] Frontend packages
- [ ] CI/CD pipeline

### Sprint 1 (Next): Authentication
**Status**: Not Started

See [SPRINT_PLAN.md](./SPRINT_PLAN.md) for full task list.

---

## 💡 Tips for Development

### 1. Follow the Sprint Plan
- Work through sprints sequentially
- Complete tasks in priority order (P0 → P1 → P2)
- Don't skip ahead to later sprints

### 2. Refer to Designs
- Check [UI_UX_DESIGN.md](./UI_UX_DESIGN.md) before implementing UI
- Match colors, spacing, typography exactly
- Use design system components

### 3. Write Tests
- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical user flows
- Aim for 70%+ coverage

### 4. Code Reviews
- Create small, focused PRs
- Write clear PR descriptions
- Request reviews promptly
- Address feedback quickly

### 5. Keep Documentation Updated
- Update API docs when endpoints change
- Add JSDoc comments for complex functions
- Update README if setup changes

---

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/auth-login

# Make changes, commit frequently
git add .
git commit -m "feat: implement shop login endpoint"

# Push to remote
git push origin feature/auth-login

# Create pull request on GitHub
```

### Commit Message Convention

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting, missing semicolons
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat: add nearby promotions API endpoint
fix: resolve distance calculation bug
docs: update API documentation for auth endpoints
refactor: extract geolocation logic to service
test: add unit tests for promotion validation
```

---

## 📞 Support

### Questions?

1. Check the planning documents first
2. Review the sprint plan for context
3. Ask in team chat/Slack
4. Create GitHub issue for bugs

### Useful Links

- **Turborepo Docs**: https://turbo.build/repo/docs
- **Fastify Docs**: https://www.fastify.io/docs/latest/
- **Prisma Docs**: https://www.prisma.io/docs/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/docs/getting-started

---

## 🎉 Ready to Start!

You now have everything you need to begin development:

1. ✅ Complete planning documents
2. ✅ Project structure set up
3. ✅ Development environment configured
4. ✅ Sprint plan to follow
5. ✅ UI/UX designs ready

**Next Action**: Complete Sprint 0 tasks to finish infrastructure setup, then move to Sprint 1 (Authentication).

Good luck and happy coding! 🚀
