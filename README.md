# LoCo - Location Commerce Platform

A modern, scalable platform connecting local businesses with nearby customers through location-based promotions and real-time notifications.

## Overview

LoCo (Location Commerce) enables shops and businesses to create targeted promotions for customers based on their proximity to store locations. Customers receive real-time notifications when they're near participating businesses, creating opportunities for increased foot traffic and sales.

### Key Features

#### For Businesses (Shop Dashboard)
- Create and manage promotions with customizable parameters
- Set geofencing radius (e.g., 300m, 5km, 15km)
- Target all locations or specific stores
- Real-time analytics and performance metrics
- Track views, redemptions, and conversion rates
- Manage multiple store locations with interactive maps

#### For Customers (Mobile App)
- Discover nearby promotions automatically
- Receive push notifications for relevant deals
- Customize notification preferences by category and distance
- Block/mute specific businesses
- Save favorite promotions
- Redeem offers with unique codes

## Use Case Examples

- **McDonald's**: "Free coffee with small fries" for users within 300m
- **Shoe Store**: "30% off all shoes for 24h" for users within 15km
- **Cafe**: "Buy 1 get 1 free" for users within 500m during morning hours

## Tech Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL 15+ with PostGIS extension
- **Cache**: Redis 7+ with geo-indexing
- **ORM**: Prisma
- **Queue**: BullMQ
- **Authentication**: JWT with refresh tokens
- **Notifications**: Firebase Cloud Messaging + Web Push API

### Frontend - Shop Dashboard
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Maps**: Mapbox GL JS

### Frontend - Customer App
- **Type**: Progressive Web App (PWA)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite + PWA Plugin
- **State**: React Query + Zustand
- **Offline**: Service Workers + IndexedDB
- **Geolocation**: Web Geolocation API

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Railway (backend), Vercel (frontend)
- **Monitoring**: Sentry + LogTail

## Architecture Highlights

- **Monorepo structure** with Turborepo for efficient builds
- **Geospatial queries** using PostGIS for accurate distance calculations
- **Multi-layer caching** (memory, Redis, database) for optimal performance
- **Real-time notifications** via WebSockets and push notifications
- **Scalable queue-based** background job processing
- **Mobile-first PWA** with offline support and native-like experience

## Documentation

### Planning & Requirements
- [📋 Product Requirements Document (PRD)](./PRD.md) - Complete product specifications
- [🎨 UI/UX Design Specification](./UI_UX_DESIGN.md) - Complete design system and wireframes
- [📅 Sprint Plan](./SPRINT_PLAN.md) - 12-week implementation roadmap
- [🔍 Discovery Mode Specification](./DISCOVERY_MODE_SPEC.md) - Detailed feature specification

### Technical
- [🏗️ Architecture Plan](./ARCHITECTURE_PLAN.md) - Comprehensive technical architecture
- [📁 Project Structure](./PROJECT_STRUCTURE.md) - Code organization and conventions
- [🚀 Quick Start Guide](./QUICK_START.md) - Original development setup guide
- [✨ Get Started](./GET_STARTED.md) - Quick start for development (START HERE)

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd promo

# Install dependencies
npm install

# Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
# Edit .env files with your configuration

# Run database migrations
npm run migrate -w packages/backend

# Start all services
npm run dev

# Access the applications:
# - Backend API: http://localhost:3000
# - Shop Dashboard: http://localhost:4000
# - Customer App: http://localhost:4001
```

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md).

## Project Structure

```
promo/
├── packages/
│   ├── backend/           # Fastify API server
│   ├── shop-dashboard/    # React dashboard for businesses
│   ├── customer-app/      # PWA for customers
│   └── shared/            # Shared types and utilities
├── docker-compose.yml     # Local development services
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace config
```

## Development

```bash
# Start all services
npm run dev

# Start specific service
npm run dev -w packages/backend
npm run dev -w packages/shop-dashboard
npm run dev -w packages/customer-app

# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Database operations
npm run migrate -w packages/backend
npm run studio -w packages/backend
npm run seed -w packages/backend
```

## Key Features Implementation

### Geolocation Services
- Continuous location tracking with battery optimization
- Adaptive update intervals based on battery level
- PostGIS for efficient geospatial queries
- Redis geo-indexing for fast proximity lookups

### Notification System
- Multi-channel delivery (Push, Email, SMS)
- User preference management
- Quiet hours and frequency controls
- Queue-based processing with retry logic

### Analytics
- Real-time view and redemption tracking
- Geographic distribution visualization
- Performance metrics per promotion
- ROI and conversion rate calculations

### Security
- JWT-based authentication with refresh tokens
- bcrypt password hashing (cost factor 12)
- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS and CSRF protection

### Privacy
- Granular location sharing controls
- Configurable tracking precision
- Automatic data expiration
- GDPR compliance ready
- User data export and deletion

## Deployment

### Development
```bash
docker-compose up -d
npm run dev
```

### Production
```bash
# Build all packages
npm run build

# Deploy backend to Railway
railway up --service backend

# Deploy frontends to Vercel
vercel --prod
```

See [ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md) for detailed deployment instructions.

## Implementation Phases

### Phase 1: MVP (4-6 weeks)
- Core authentication
- Location management
- Basic promotion CRUD
- Nearby promotions query
- Simple analytics

### Phase 2: Core Features (3-4 weeks)
- Push notifications
- Redis caching
- Redemption system
- Enhanced analytics
- PWA features

### Phase 3: Enhanced Features (3-4 weeks)
- Advanced analytics
- A/B testing
- Multi-user accounts
- Social features
- Map visualizations

### Phase 4: Polish & Scale (2-3 weeks)
- Performance optimization
- Load testing
- Security audit
- Production deployment

## Performance Targets

- API Response Time: < 200ms (p95)
- Database Queries: < 100ms (p95)
- Push Notification Delivery: > 95%
- PWA Load Time: < 2s (first load)
- Offline Functionality: Full read access

## Estimated Costs

### 10K Active Users
- Infrastructure: $70-236/month
- Includes: Database, Redis, hosting, storage, notifications

### 100K Active Users
- Infrastructure: $250-600/month
- Horizontal scaling ready

## Contributing

1. Follow the coding standards in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. Write tests for new features
3. Update documentation
4. Create pull requests with descriptive titles

## Security

- Report security vulnerabilities privately
- Follow responsible disclosure practices
- Security audits planned for production release

## License

[Add your license here]

## Support

For questions or issues:
1. Check the documentation
2. Review [troubleshooting guide](./QUICK_START.md#troubleshooting)
3. Open an issue on GitHub

## Roadmap

- [ ] Phase 1: MVP Development
- [ ] Phase 2: Core Features
- [ ] Phase 3: Enhanced Features
- [ ] Phase 4: Production Launch
- [ ] Machine Learning recommendations
- [ ] Native iOS/Android apps
- [ ] AR features
- [ ] Loyalty programs

---

Built with ❤️ for local businesses and their customers
