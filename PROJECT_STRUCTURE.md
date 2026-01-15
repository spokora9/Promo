# Project Structure

This document outlines the recommended directory structure for the location-based promotions platform.

## Monorepo Structure

We recommend using a monorepo approach with workspaces for better code sharing and dependency management.

```
promo/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── shop-dashboard-ci.yml
│       ├── customer-app-ci.yml
│       └── deploy.yml
├── packages/
│   ├── backend/
│   ├── shop-dashboard/
│   ├── customer-app/
│   └── shared/
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json              # Root package.json with workspaces
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── tsconfig.base.json        # Shared TypeScript config
├── README.md
├── ARCHITECTURE_PLAN.md      # (already created)
└── PROJECT_STRUCTURE.md      # (this file)
```

---

## Backend Structure

```
packages/backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schemas.ts      # Zod validation schemas
│   │   │   └── auth.types.ts
│   │   ├── shops/
│   │   │   ├── shops.controller.ts
│   │   │   ├── shops.service.ts
│   │   │   ├── shops.routes.ts
│   │   │   ├── shops.schemas.ts
│   │   │   └── shops.types.ts
│   │   ├── locations/
│   │   │   ├── locations.controller.ts
│   │   │   ├── locations.service.ts
│   │   │   ├── locations.routes.ts
│   │   │   └── locations.types.ts
│   │   ├── promotions/
│   │   │   ├── promotions.controller.ts
│   │   │   ├── promotions.service.ts
│   │   │   ├── promotions.routes.ts
│   │   │   ├── promotions.schemas.ts
│   │   │   └── promotions.types.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.types.ts
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.worker.ts   # BullMQ worker
│   │   │   └── notifications.types.ts
│   │   ├── analytics/
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.types.ts
│   │   └── redemptions/
│   │       ├── redemptions.controller.ts
│   │       ├── redemptions.service.ts
│   │       └── redemptions.types.ts
│   ├── shared/
│   │   ├── services/
│   │   │   ├── geo.service.ts           # Geospatial calculations
│   │   │   ├── cache.service.ts         # Redis caching
│   │   │   ├── storage.service.ts       # S3/file uploads
│   │   │   ├── email.service.ts         # Email sending
│   │   │   └── fcm.service.ts           # Firebase Cloud Messaging
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── ratelimit.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   ├── password.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   └── distance.utils.ts
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── env.config.ts
│   │   └── types/
│   │       ├── express.types.ts
│   │       ├── common.types.ts
│   │       └── api.types.ts
│   ├── database/
│   │   ├── schema.prisma             # Prisma schema
│   │   ├── client.ts                 # Prisma client instance
│   │   ├── migrations/               # Auto-generated migrations
│   │   └── seeds/
│   │       └── seed.ts
│   ├── queue/
│   │   ├── queues.ts                 # Queue definitions
│   │   ├── workers.ts                # Worker registration
│   │   └── jobs/
│   │       ├── notification.job.ts
│   │       ├── analytics.job.ts
│   │       └── cleanup.job.ts
│   ├── websocket/
│   │   ├── socket.server.ts
│   │   ├── socket.handlers.ts
│   │   └── socket.events.ts
│   ├── app.ts                        # Express/Fastify app setup
│   ├── server.ts                     # Server entry point
│   └── routes.ts                     # Route aggregation
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── promotions.test.ts
│   │   └── geolocation.test.ts
│   └── e2e/
│       └── api.test.ts
├── scripts/
│   ├── generate-keys.ts
│   ├── migrate.ts
│   └── seed.ts
├── .env.example
├── .env.test
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## Shop Dashboard Structure

```
packages/shop-dashboard/
├── public/
│   ├── icons/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── maps/
│   │   │   ├── LocationPicker.tsx
│   │   │   ├── RadiusSelector.tsx
│   │   │   └── LocationMap.tsx
│   │   ├── promotions/
│   │   │   ├── PromotionCard.tsx
│   │   │   ├── PromotionForm.tsx
│   │   │   ├── PromotionList.tsx
│   │   │   └── PromotionStats.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ViewsChart.tsx
│   │   │   ├── RedemptionsChart.tsx
│   │   │   └── GeographicMap.tsx
│   │   └── locations/
│   │       ├── LocationForm.tsx
│   │       ├── LocationCard.tsx
│   │       └── LocationList.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── promotions/
│   │   │   ├── PromotionsListPage.tsx
│   │   │   ├── CreatePromotionPage.tsx
│   │   │   ├── EditPromotionPage.tsx
│   │   │   └── PromotionDetailPage.tsx
│   │   ├── locations/
│   │   │   ├── LocationsListPage.tsx
│   │   │   ├── CreateLocationPage.tsx
│   │   │   └── EditLocationPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx
│   │   ├── settings/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePromotions.ts
│   │   ├── useLocations.ts
│   │   ├── useAnalytics.ts
│   │   └── useGeolocation.ts
│   ├── services/
│   │   ├── api.service.ts           # Axios instance
│   │   ├── auth.service.ts
│   │   ├── promotions.service.ts
│   │   ├── locations.service.ts
│   │   ├── analytics.service.ts
│   │   └── upload.service.ts
│   ├── stores/                       # Zustand stores
│   │   ├── authStore.ts
│   │   ├── promotionsStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── promotion.types.ts
│   │   ├── location.types.ts
│   │   └── analytics.types.ts
│   ├── utils/
│   │   ├── format.utils.ts
│   │   ├── validation.utils.ts
│   │   ├── date.utils.ts
│   │   └── distance.utils.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── env.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx                    # React Router setup
│   └── vite-env.d.ts
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Customer App Structure (PWA)

```
packages/customer-app/
├── public/
│   ├── icons/                        # PWA icons (192x192, 512x512)
│   ├── service-worker.js
│   ├── manifest.json
│   ├── offline.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── AppLayout.tsx
│   │   ├── promotions/
│   │   │   ├── PromotionCard.tsx
│   │   │   ├── PromotionDetail.tsx
│   │   │   ├── PromotionList.tsx
│   │   │   └── PromotionMap.tsx
│   │   ├── notifications/
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationSettings.tsx
│   │   └── location/
│   │       ├── LocationPermission.tsx
│   │       └── LocationSettings.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   ├── promotions/
│   │   │   ├── NearbyPromotionsPage.tsx
│   │   │   ├── PromotionDetailPage.tsx
│   │   │   ├── SavedPromotionsPage.tsx
│   │   │   └── MapViewPage.tsx
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── PreferencesPage.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.tsx
│   │   └── onboarding/
│   │       └── OnboardingPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGeolocation.ts
│   │   ├── usePromotions.ts
│   │   ├── useNotifications.ts
│   │   ├── usePushNotifications.ts
│   │   └── useOffline.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── promotions.service.ts
│   │   ├── geolocation.service.ts
│   │   ├── notifications.service.ts
│   │   └── sw.service.ts            # Service Worker management
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── locationStore.ts
│   │   ├── promotionsStore.ts
│   │   └── preferencesStore.ts
│   ├── types/
│   │   ├── promotion.types.ts
│   │   ├── location.types.ts
│   │   ├── notification.types.ts
│   │   └── user.types.ts
│   ├── utils/
│   │   ├── distance.utils.ts
│   │   ├── format.utils.ts
│   │   ├── storage.utils.ts         # IndexedDB/localStorage
│   │   └── battery.utils.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── env.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx
│   ├── registerServiceWorker.ts
│   └── vite-env.d.ts
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts                    # With PWA plugin
├── tailwind.config.js
└── README.md
```

---

## Shared Package Structure

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── promotion.types.ts        # Shared types
│   │   ├── location.types.ts
│   │   ├── user.types.ts
│   │   ├── shop.types.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── errors.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── schemas/                      # Zod schemas
│   │   ├── promotion.schema.ts
│   │   ├── location.schema.ts
│   │   ├── user.schema.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── distance.utils.ts
│   │   ├── validation.utils.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Configuration Files

### Root package.json (Monorepo)

```json
{
  "name": "promo-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  }
}
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .eslintrc.js

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  env: {
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
```

### .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov
.nyc_output

# Production
dist/
build/
.next/
out/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.production
.env.test

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# IDEs
.idea/
.vscode/
*.swp
*.swo
*~

# OS
Thumbs.db

# Build
*.tsbuildinfo

# Logs
logs/
*.log
```

---

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd promo

# Install dependencies
npm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/shop-dashboard/.env.example packages/shop-dashboard/.env
cp packages/customer-app/.env.example packages/customer-app/.env

# Start Docker services (PostgreSQL, Redis)
docker-compose up -d

# Run database migrations
npm run migrate -w packages/backend

# Seed database (optional)
npm run seed -w packages/backend

# Start all services in development mode
npm run dev
```

### Development Commands

```bash
# Start all services
npm run dev

# Start specific workspace
npm run dev -w packages/backend
npm run dev -w packages/shop-dashboard
npm run dev -w packages/customer-app

# Build all packages
npm run build

# Run tests
npm run test                          # All packages
npm run test -w packages/backend      # Specific package

# Lint
npm run lint

# Format code
npm run format

# Database operations
npm run migrate -w packages/backend
npm run migrate:reset -w packages/backend
npm run seed -w packages/backend

# Generate Prisma client
npm run generate -w packages/backend
```

---

## Best Practices

### Code Organization

1. **Feature-based modules**: Group related functionality together
2. **Shared code**: Extract common types/utils to `packages/shared`
3. **Single responsibility**: Each file should have one clear purpose
4. **DRY principle**: Don't repeat yourself across packages

### Naming Conventions

1. **Files**: kebab-case (e.g., `promotion-card.tsx`)
2. **Components**: PascalCase (e.g., `PromotionCard`)
3. **Functions/Variables**: camelCase (e.g., `getUserLocation`)
4. **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RADIUS_KM`)
5. **Types/Interfaces**: PascalCase with descriptive names (e.g., `PromotionWithLocation`)

### Import Organization

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal dependencies from other packages
import { PromotionSchema } from '@promo/shared';

// 3. Internal dependencies from current package
import { promotionService } from '@/services/promotions.service';
import { Button } from '@/components/ui/Button';

// 4. Types
import type { Promotion } from '@/types/promotion.types';

// 5. Styles
import './styles.css';
```

### Error Handling

```typescript
// Backend
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context: { userId } });
  throw new AppError('Operation failed', 500, 'OPERATION_FAILED');
}

// Frontend
try {
  const data = await api.getPromotions();
  return data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle auth error
    logout();
  }
  toast.error('Failed to load promotions');
  throw error;
}
```

---

## Next Steps

1. Initialize the monorepo structure
2. Set up the backend with Fastify + Prisma
3. Set up the shop dashboard with React + Vite
4. Set up the customer app as a PWA
5. Configure Docker and CI/CD
6. Begin Phase 1 implementation

