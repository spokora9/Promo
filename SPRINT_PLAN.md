# LoCo - Phase 1 MVP Sprint Plan

**Duration**: 12 weeks (6 sprints x 2 weeks each)
**Team Size**: 2-4 developers
**Start Date**: January 20, 2026
**Target Launch**: April 13, 2026

---

## Overview

Phase 1 MVP focuses on core functionality:
- Merchant dashboard for creating/managing promotions
- Customer PWA for discovering and redeeming promotions
- Location-based notifications
- Basic analytics
- Discovery mode (basic)

---

## Sprint 0: Setup & Infrastructure (Week 1-2)

### Sprint Goals
- Set up development environment
- Initialize all packages
- Configure CI/CD
- Deploy staging environment

### Tasks

#### Infrastructure (Priority: P0)
- [ ] **INFRA-001**: Set up monorepo structure with Turborepo
  - Initialize root package.json with workspaces
  - Configure Turbo.json
  - Set up ESLint and Prettier
  - **Story Points**: 3
  - **Owner**: DevOps/Lead Dev

- [ ] **INFRA-002**: Docker Compose setup
  - PostgreSQL 15 with PostGIS
  - Redis 7
  - Test database connections
  - **Story Points**: 2
  - **Owner**: Backend Dev

- [ ] **INFRA-003**: Initialize backend package
  - Install Fastify, Prisma, dependencies
  - Configure TypeScript
  - Create folder structure
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **INFRA-004**: Initialize Prisma and database
  - Create prisma/schema.prisma
  - Enable PostGIS extension
  - Run initial migration
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **INFRA-005**: Initialize shop-dashboard package
  - Create Vite + React + TypeScript project
  - Install Tailwind CSS + shadcn/ui
  - Configure routing (React Router)
  - **Story Points**: 3
  - **Owner**: Frontend Dev 1

- [ ] **INFRA-006**: Initialize customer-app package
  - Create Vite + React + TypeScript + PWA
  - Install Tailwind CSS
  - Configure service worker
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

- [ ] **INFRA-007**: Set up CI/CD pipeline
  - GitHub Actions for linting and tests
  - Automated deployments to staging
  - **Story Points**: 5
  - **Owner**: DevOps/Lead Dev

#### Documentation (Priority: P1)
- [ ] **DOC-001**: Create development setup guide
  - README for each package
  - Environment variable docs
  - **Story Points**: 2

### Sprint Deliverables
✅ All packages initialized
✅ Docker containers running
✅ Database with PostGIS ready
✅ CI/CD pipeline functional
✅ Staging environment deployed

### Definition of Done
- [ ] `npm install` works in root
- [ ] `docker-compose up` starts PostgreSQL + Redis
- [ ] All packages run `npm run dev` successfully
- [ ] GitHub Actions pass on every push
- [ ] Staging URLs accessible

---

## Sprint 1: Authentication & Core Setup (Week 3-4)

### Sprint Goals
- User authentication for merchants and customers
- JWT token management
- Basic API structure
- Login/register UI

### Tasks

#### Backend (Priority: P0)
- [ ] **AUTH-001**: Implement merchant authentication
  - POST /api/auth/shop/register
  - POST /api/auth/shop/login
  - POST /api/auth/shop/refresh
  - POST /api/auth/shop/logout
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **AUTH-002**: Implement customer authentication
  - POST /api/auth/user/register
  - POST /api/auth/user/login
  - POST /api/auth/user/refresh
  - POST /api/auth/user/logout
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **AUTH-003**: JWT middleware
  - Create auth middleware for protected routes
  - Token validation
  - Refresh token rotation
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **AUTH-004**: Password hashing and validation
  - bcrypt implementation
  - Password strength validation with Zod
  - **Story Points**: 3
  - **Owner**: Backend Dev

#### Frontend - Shop Dashboard (Priority: P0)
- [ ] **SHOP-001**: Login page
  - Email/password form
  - Validation
  - Error handling
  - "Remember me" checkbox
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-002**: Registration page
  - Multi-step form (business info, contact, password)
  - Form validation
  - Success state
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-003**: Auth context and token management
  - React Context for auth state
  - LocalStorage for tokens
  - Auto-refresh logic
  - Protected routes
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

#### Frontend - Customer App (Priority: P0)
- [ ] **CUST-001**: Login/register screen
  - Combined login/register flow
  - Simple form
  - Social login UI (Google - non-functional for MVP)
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-002**: Onboarding flow (3 screens)
  - Welcome screen
  - Location permission screen
  - Notification permission screen
  - Skip options
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-003**: Auth state management
  - Zustand store for auth
  - LocalStorage for tokens
  - Protected routes
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

#### Testing (Priority: P1)
- [ ] **TEST-001**: Unit tests for auth endpoints
  - Register, login, refresh, logout
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **TEST-002**: E2E test for login flow
  - Shop login
  - Customer login
  - **Story Points**: 3
  - **Owner**: QA/Frontend Dev

### Sprint Deliverables
✅ Merchants can register and login
✅ Customers can register and login
✅ JWT tokens working
✅ Protected routes functional
✅ Onboarding flow complete

### Definition of Done
- [ ] Auth endpoints documented (Swagger/Postman)
- [ ] All auth tests passing
- [ ] Login/register UI matches designs
- [ ] Tokens stored securely
- [ ] Error messages user-friendly

---

## Sprint 2: Locations & Profile Management (Week 5-6)

### Sprint Goals
- Merchants can add store locations
- Profile management for both merchants and customers
- Map integration (Mapbox)

### Tasks

#### Backend (Priority: P0)
- [ ] **LOC-001**: Shop locations CRUD API
  - GET /api/shops/locations
  - POST /api/shops/locations
  - PUT /api/shops/locations/:id
  - DELETE /api/shops/locations/:id
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **LOC-002**: Shop profile API
  - GET /api/shops/me
  - PUT /api/shops/me
  - PATCH /api/shops/me/logo (file upload)
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **LOC-003**: User profile API
  - GET /api/users/me
  - PUT /api/users/me
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **LOC-004**: Geocoding integration
  - Address to coordinates conversion
  - Validate addresses
  - **Story Points**: 5
  - **Owner**: Backend Dev

#### Frontend - Shop Dashboard (Priority: P0)
- [ ] **SHOP-004**: Dashboard home/layout
  - Sidebar navigation
  - Header with profile dropdown
  - Responsive layout
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-005**: Locations page
  - List of locations
  - Add location form with map picker
  - Edit/delete location
  - Address autocomplete
  - **Story Points**: 8
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-006**: Profile settings page
  - Edit business name, logo, description
  - Change password
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-007**: Mapbox integration
  - Display map
  - Location marker
  - Radius circle visualization
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

#### Frontend - Customer App (Priority: P0)
- [ ] **CUST-004**: Settings page
  - Profile section
  - Notification preferences
  - Location preferences
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-005**: Profile edit
  - Name, email, phone
  - Avatar upload (optional)
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

### Sprint Deliverables
✅ Merchants can add/edit/delete locations
✅ Map integration working
✅ Profile management for merchants
✅ Settings page for customers
✅ File upload for logos/avatars

### Definition of Done
- [ ] Can add location with map picker
- [ ] Locations displayed on map
- [ ] Profile updates saved correctly
- [ ] Logo/avatar uploads working
- [ ] Responsive design on mobile

---

## Sprint 3: Promotion Creation & Management (Week 7-8)

### Sprint Goals
- Merchants can create promotions
- Multi-step promotion creation wizard
- Promotion listing and management

### Tasks

#### Backend (Priority: P0)
- [ ] **PROMO-001**: Promotions CRUD API
  - POST /api/shops/promotions
  - GET /api/shops/promotions
  - GET /api/shops/promotions/:id
  - PUT /api/shops/promotions/:id
  - DELETE /api/shops/promotions/:id
  - PATCH /api/shops/promotions/:id/toggle-active
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **PROMO-002**: Promotion validation
  - Date validation (end > start)
  - Radius validation (100m - 50km)
  - Required fields with Zod
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **PROMO-003**: Promotion lifecycle management
  - Auto-activate at start time (cron job)
  - Auto-deactivate at end time (cron job)
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **PROMO-004**: Image upload for promotions
  - PATCH /api/shops/promotions/:id/image
  - Image validation and optimization
  - **Story Points**: 5
  - **Owner**: Backend Dev

#### Frontend - Shop Dashboard (Priority: P0)
- [ ] **SHOP-008**: Create promotion - Step 1 (Basic Info)
  - Title, description fields
  - Image upload
  - Validation
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-009**: Create promotion - Step 2 (Discount)
  - Discount type selector
  - Discount value input
  - Terms & conditions
  - **Story Points**: 3
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-010**: Create promotion - Step 3 (Targeting)
  - Location selector (all or specific)
  - Radius slider
  - Map preview with radius circles
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-011**: Create promotion - Step 4 (Schedule)
  - Date/time pickers (start, end)
  - Redemption limits
  - Preview card
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-012**: Promotions list page
  - Display all promotions
  - Filter by status (active, scheduled, ended)
  - Edit/delete actions
  - Activate/deactivate toggle
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-013**: Edit promotion
  - Load existing promotion
  - Same wizard as create
  - Restrictions (can't edit discount after start)
  - **Story Points**: 5
  - **Owner**: Frontend Dev 1

#### Testing (Priority: P1)
- [ ] **TEST-003**: Promotion CRUD tests
  - Create, read, update, delete
  - Validation edge cases
  - **Story Points**: 3
  - **Owner**: Backend Dev

### Sprint Deliverables
✅ Merchants can create promotions
✅ 4-step wizard functional
✅ Promotions list with filters
✅ Edit/delete promotions
✅ Image upload working

### Definition of Done
- [ ] Can create promotion through full wizard
- [ ] Validation prevents invalid promotions
- [ ] Promotions list displays correctly
- [ ] Can edit existing promotions
- [ ] Auto-activation/deactivation works

---

## Sprint 4: Discovery & Geolocation (Week 9-10)

### Sprint Goals
- Customers can see nearby promotions
- Geolocation services
- Real-time location updates
- Distance calculations

### Tasks

#### Backend (Priority: P0)
- [ ] **GEO-001**: Nearby promotions API
  - GET /api/promotions/nearby?lat=X&lng=Y&radius=Z
  - PostGIS distance queries
  - Filter by category, status
  - Sort by distance
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **GEO-002**: User location tracking
  - PUT /api/users/location
  - Store in user_locations table
  - Update timestamp
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **GEO-003**: Promotion detail API
  - GET /api/promotions/:id
  - Include shop info, location, distance
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **GEO-004**: Track promotion views
  - POST /api/promotions/:id/view
  - Record user, distance, timestamp
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **GEO-005**: Geofencing service
  - Background job to match users with promotions
  - Check users within radius
  - Queue notifications
  - **Story Points**: 8
  - **Owner**: Backend Dev

#### Frontend - Customer App (Priority: P0)
- [ ] **CUST-006**: Home screen - Promotions list
  - Display nearby promotions
  - Card-based layout
  - Distance, time remaining
  - Pull-to-refresh
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

- [ ] **CUST-007**: Geolocation integration
  - Request location permission
  - Continuous location tracking
  - Update backend periodically
  - Battery optimization (adaptive intervals)
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

- [ ] **CUST-008**: Promotion detail screen
  - Full promotion info
  - Shop details
  - Terms & conditions
  - Get directions button
  - Redeem CTA
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-009**: Search and filters
  - Search bar
  - Filter by category
  - Sort options (distance, time, popularity)
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-010**: Bottom navigation
  - Home, Discovery, Saved, Redeemed, Settings
  - Active state indicators
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

#### Backend - Caching (Priority: P1)
- [ ] **CACHE-001**: Redis caching for nearby queries
  - Cache results for 5 minutes
  - Cache by lat/lng grid
  - **Story Points**: 5
  - **Owner**: Backend Dev

### Sprint Deliverables
✅ Customers can see nearby promotions
✅ Location tracking functional
✅ Distance calculations accurate
✅ Search and filter working
✅ Promotion detail screen complete

### Definition of Done
- [ ] Nearby promotions query < 200ms
- [ ] Location updates every 30-60 seconds
- [ ] Distance shown accurately
- [ ] Search returns relevant results
- [ ] Works on iOS and Android (PWA)

---

## Sprint 5: Notifications & Redemption (Week 11-12)

### Sprint Goals
- Push notifications for nearby promotions
- Redemption code generation
- Redemption verification for merchants
- Discovery mode (basic)

### Tasks

#### Backend (Priority: P0)
- [ ] **NOTIF-001**: Web Push setup
  - Configure VAPID keys
  - Implement Web Push API
  - Handle subscription storage
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **NOTIF-002**: Notification service
  - POST /api/notifications/subscribe
  - Send notifications via Web Push
  - Queue with BullMQ
  - Retry logic
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **NOTIF-003**: Geofence trigger notifications
  - When user enters promotion radius
  - Respect quiet hours
  - Respect frequency limits
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **REDEEM-001**: Redemption code generation
  - POST /api/promotions/:id/redeem
  - Generate unique code (alphanumeric + QR)
  - Validate user within radius
  - Check redemption limits
  - **Story Points**: 8
  - **Owner**: Backend Dev

- [ ] **REDEEM-002**: Redemption verification API
  - POST /api/shops/redemptions/verify
  - Validate code
  - Mark as used
  - Prevent duplicate redemptions
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **REDEEM-003**: Redemption history
  - GET /api/users/redemptions
  - Show past redemptions
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **DISC-001**: Discovery mode - Exposure tracking
  - Create discovery_exposures table
  - Track exposure count per user/shop
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **DISC-002**: Discovery feed API
  - GET /api/discovery/feed
  - Return discovered shops (last 7 days)
  - Include exposure count
  - **Story Points**: 5
  - **Owner**: Backend Dev

#### Frontend - Customer App (Priority: P0)
- [ ] **CUST-011**: Service worker for push notifications
  - Register service worker
  - Request notification permission
  - Handle push events
  - Display notifications
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

- [ ] **CUST-012**: Notification preferences
  - Enable/disable notifications
  - Set notification radius
  - Category selection
  - Quiet hours
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-013**: Redemption flow
  - Redeem button on promotion detail
  - Generate code
  - Display QR code + text code
  - Countdown timer
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

- [ ] **CUST-014**: Redemption history
  - List of redeemed promotions
  - Total savings calculation
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

- [ ] **CUST-015**: Discovery mode toggle (Settings)
  - Enable/disable discovery mode
  - Active vs Silent mode
  - Radius slider
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

- [ ] **CUST-016**: Discovery feed
  - List discovered shops
  - Add shop button
  - Exposure warnings
  - "Not Interested" option
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

#### Frontend - Shop Dashboard (Priority: P0)
- [ ] **SHOP-014**: Redemption verification page
  - Enter code manually
  - QR code scanner (camera access)
  - Show promotion details on verification
  - Success/error states
  - **Story Points**: 8
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-015**: Redemptions list
  - Show all redemptions for shop
  - Filter by date, promotion
  - **Story Points**: 3
  - **Owner**: Frontend Dev 1

#### Testing (Priority: P1)
- [ ] **TEST-004**: Notification flow E2E test
  - Subscribe to notifications
  - Trigger notification
  - Receive and display
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **TEST-005**: Redemption flow E2E test
  - Generate code
  - Verify code
  - Ensure single-use
  - **Story Points**: 5
  - **Owner**: Backend Dev + Frontend Dev 1

### Sprint Deliverables
✅ Push notifications working
✅ Customers can redeem promotions
✅ Merchants can verify redemptions
✅ Redemption history visible
✅ Discovery mode (basic) functional

### Definition of Done
- [ ] Notifications received within 30 seconds
- [ ] QR codes scannable
- [ ] Redemption codes single-use
- [ ] Discovery feed shows discovered shops
- [ ] Exposure tracking functional

---

## Sprint 6: Analytics & Polish (Week 13-14)

### Sprint Goals
- Basic analytics for merchants
- Dashboard with key metrics
- Bug fixes and polish
- Performance optimization
- Prepare for beta launch

### Tasks

#### Backend (Priority: P0)
- [ ] **ANALYTICS-001**: Promotion analytics API
  - GET /api/shops/analytics/promotions/:id
  - Total views, unique views
  - Total redemptions
  - Conversion rate
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **ANALYTICS-002**: Dashboard overview API
  - GET /api/shops/analytics/overview
  - Aggregate metrics (24h, 7d, 30d)
  - Views, redemptions, conversion
  - **Story Points**: 5
  - **Owner**: Backend Dev

- [ ] **ANALYTICS-003**: Performance optimization
  - Database query optimization
  - Add indexes where needed
  - Redis caching for analytics
  - **Story Points**: 5
  - **Owner**: Backend Dev

#### Frontend - Shop Dashboard (Priority: P0)
- [ ] **SHOP-016**: Dashboard home with metrics
  - Key metric cards (views, redemptions, conversion)
  - Views over time chart (line chart)
  - Top promotions list
  - **Story Points**: 8
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-017**: Promotion analytics page
  - Detailed metrics for single promotion
  - Charts (views, redemptions)
  - Distance distribution
  - Time-based analytics
  - **Story Points**: 8
  - **Owner**: Frontend Dev 1

- [ ] **SHOP-018**: Polish and bug fixes
  - Fix reported bugs
  - Improve UX based on testing
  - Loading states
  - Error handling
  - **Story Points**: 8
  - **Owner**: Frontend Dev 1

#### Frontend - Customer App (Priority: P0)
- [ ] **CUST-017**: Polish and bug fixes
  - Fix reported bugs
  - Improve transitions/animations
  - Loading states
  - Error handling
  - **Story Points**: 8
  - **Owner**: Frontend Dev 2

- [ ] **CUST-018**: Offline functionality
  - Cache promotions for offline access
  - Queue actions when offline
  - Sync when back online
  - **Story Points**: 5
  - **Owner**: Frontend Dev 2

- [ ] **CUST-019**: Install prompt (PWA)
  - Show install banner
  - Add to home screen
  - **Story Points**: 3
  - **Owner**: Frontend Dev 2

#### Testing & QA (Priority: P0)
- [ ] **TEST-006**: Full regression testing
  - Test all user flows
  - Cross-browser testing
  - Mobile device testing
  - **Story Points**: 8
  - **Owner**: QA/All Devs

- [ ] **TEST-007**: Performance testing
  - Load testing (1000 concurrent users)
  - API response times
  - Page load times
  - **Story Points**: 5
  - **Owner**: Backend Dev + QA

- [ ] **TEST-008**: Security audit
  - Check for vulnerabilities
  - SQL injection prevention
  - XSS prevention
  - CSRF tokens
  - **Story Points**: 5
  - **Owner**: Backend Dev

#### Documentation (Priority: P1)
- [ ] **DOC-002**: API documentation
  - Complete Swagger/OpenAPI docs
  - Example requests/responses
  - **Story Points**: 3
  - **Owner**: Backend Dev

- [ ] **DOC-003**: User guides
  - Merchant quick start guide
  - Customer app tour
  - **Story Points**: 3
  - **Owner**: Product/Design

### Sprint Deliverables
✅ Analytics dashboard complete
✅ All critical bugs fixed
✅ Performance optimized
✅ Security audit passed
✅ Ready for beta launch

### Definition of Done
- [ ] All P0 bugs fixed
- [ ] Analytics data accurate
- [ ] Load testing passed (1000 users)
- [ ] API docs complete
- [ ] Beta launch checklist complete

---

## Post-Sprint 6: Beta Launch Preparation

### Week 15: Internal Testing
- [ ] Internal team testing (alpha)
- [ ] Fix critical bugs
- [ ] Prepare beta user list

### Week 16: Closed Beta Launch
- [ ] Invite 50 beta users (25 merchants, 25 customers)
- [ ] Monitor for issues
- [ ] Gather feedback

### Week 17-18: Iteration
- [ ] Fix bugs reported by beta users
- [ ] Implement quick wins from feedback
- [ ] Prepare for broader launch

---

## Sprint Ceremonies

### Daily Standup (15 minutes)
**Time**: 10:00 AM daily
**Format**:
- What did I do yesterday?
- What will I do today?
- Any blockers?

### Sprint Planning (2 hours)
**When**: First day of sprint
**Attendees**: Full team
**Outcome**: Sprint backlog committed

### Sprint Review (1 hour)
**When**: Last day of sprint
**Attendees**: Team + stakeholders
**Outcome**: Demo completed work

### Sprint Retrospective (1 hour)
**When**: Last day of sprint
**Attendees**: Team only
**Outcome**: Improvement actions

### Backlog Refinement (1 hour)
**When**: Mid-sprint
**Attendees**: Full team
**Outcome**: Next sprint stories estimated

---

## Definition of Ready (Stories)

Before a story can be added to a sprint:
- [ ] User story written
- [ ] Acceptance criteria defined
- [ ] Story points estimated
- [ ] Dependencies identified
- [ ] Designs available (if UI work)
- [ ] API contracts defined (if backend work)

---

## Definition of Done (Stories)

A story is complete when:
- [ ] Code written and reviewed
- [ ] Tests written and passing
- [ ] Deployed to staging
- [ ] Acceptance criteria met
- [ ] Product owner approval
- [ ] Documentation updated (if needed)

---

## Risk Management

### Technical Risks

| Risk | Mitigation |
|------|-----------|
| PostGIS performance issues | Early load testing, optimize queries, add indexes |
| Push notification delivery failures | Retry logic, multiple providers (FCM + Web Push) |
| PWA compatibility issues | Test on real devices early, progressive enhancement |
| Location tracking battery drain | Adaptive intervals, geofence triggers |

### Process Risks

| Risk | Mitigation |
|------|-----------|
| Scope creep | Strict MVP scope, defer non-essential features |
| Team velocity uncertainty | Buffer 20% time, adjust scope if needed |
| Dependencies blocking work | Identify early, parallel work streams |
| Testing bottleneck at end | Test continuously, automate where possible |

---

## Success Metrics

### Sprint Success
- [ ] 80%+ story points completed
- [ ] Zero critical bugs in production
- [ ] All tests passing
- [ ] Code review cycle < 24 hours

### MVP Success (End of Sprint 6)
- [ ] All P0 features complete
- [ ] 50+ beta users onboarded
- [ ] >70% user retention (7 days)
- [ ] <2s page load time
- [ ] >99% uptime in staging

---

## Tools & Collaboration

### Project Management
- **Tool**: Linear, Jira, or GitHub Projects
- **Board**: Kanban with columns: Backlog, Ready, In Progress, Review, Done
- **Updates**: Daily

### Communication
- **Chat**: Slack or Discord
- **Video**: Zoom or Google Meet
- **Docs**: Notion or Confluence

### Code
- **Repository**: GitHub
- **Branching**: Feature branches from `main`
- **PRs**: Require 1 approval
- **Deployment**: Merge to `main` = auto-deploy to staging

### Design
- **Tool**: Figma
- **Handoff**: Figma dev mode or Zeplin
- **Feedback**: In Figma comments

---

## Contingency Plans

### If Behind Schedule

**After Sprint 2:**
- Cut: Social login (OAuth)
- Cut: Logo/avatar uploads (use placeholder)

**After Sprint 4:**
- Cut: Discovery mode smart features
- Cut: Map view in customer app
- Simplify: Analytics (basic metrics only)

**After Sprint 5:**
- Cut: QR code scanner (manual entry only)
- Cut: Offline functionality
- Simplify: Notification preferences

### If Ahead of Schedule

**Add from Phase 2:**
- Promotion templates
- Export analytics (CSV)
- Advanced filters
- Map view for promotions

---

## Sprint 0 Checklist (Before Starting Sprint 1)

- [ ] All team members have dev environment running
- [ ] PostgreSQL + Redis running via Docker
- [ ] All packages install dependencies successfully
- [ ] Database migrations run successfully
- [ ] Frontend apps load in browser
- [ ] Git workflow agreed upon
- [ ] Code review process defined
- [ ] Sprint ceremonies scheduled
- [ ] Project management tool set up
- [ ] Communication channels created

---

**Document Version**: 1.0
**Last Updated**: January 15, 2026
**Status**: Ready to Start
