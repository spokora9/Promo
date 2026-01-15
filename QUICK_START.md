# Quick Start Guide

This guide will help you get the location-based promotions platform up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ LTS ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/downloads))
- **VS Code** or your preferred IDE

---

## Step 1: Initialize the Project

### 1.1 Set up the Monorepo Structure

```bash
# Create main directories
mkdir -p packages/{backend,shop-dashboard,customer-app,shared}

# Initialize root package.json
npm init -y

# Enable workspaces
npm pkg set workspaces[0]="packages/*"
```

### 1.2 Install Root Dependencies

```bash
# Install Turborepo for monorepo management
npm install -D turbo prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
EOF
```

---

## Step 2: Set up Backend

### 2.1 Initialize Backend Package

```bash
cd packages/backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install fastify @fastify/cors @fastify/helmet @fastify/jwt @fastify/multipart
npm install @prisma/client bcrypt zod dotenv
npm install ioredis bullmq
npm install firebase-admin web-push

# Install dev dependencies
npm install -D typescript @types/node @types/bcrypt tsx prisma nodemon
npm install -D @types/web-push

# Initialize TypeScript
npx tsc --init
```

### 2.2 Create Backend Structure

```bash
# Create directory structure
mkdir -p src/{modules,shared,database,queue}
mkdir -p src/modules/{auth,shops,locations,promotions,users,notifications,analytics,redemptions}
mkdir -p src/shared/{services,middleware,utils,config,types}

# Create entry files
touch src/server.ts src/app.ts src/routes.ts
```

### 2.3 Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env
```

### 2.4 Update package.json Scripts

```json
{
  "name": "@promo/backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "generate": "prisma generate",
    "studio": "prisma studio",
    "seed": "tsx prisma/seed.ts",
    "test": "echo \"Tests not configured yet\""
  }
}
```

### 2.5 Create .env File

```bash
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promo_dev?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# CORS
ALLOWED_ORIGINS="http://localhost:4000,http://localhost:4001"

# Firebase (optional for now)
FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""

# Web Push (generate with: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_MAILTO="mailto:your@email.com"

# AWS S3 (optional for now)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION="us-east-1"
EOF
```

### 2.6 Create Prisma Schema

```bash
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]
}

model Shop {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  passwordHash String  @map("password_hash")
  logoUrl     String?  @map("logo_url")
  description String?
  category    String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  locations   ShopLocation[]
  promotions  Promotion[]

  @@map("shops")
}

model ShopLocation {
  id          String   @id @default(uuid())
  shopId      String   @map("shop_id")
  name        String
  address     String
  city        String?
  state       String?
  country     String?
  postalCode  String?  @map("postal_code")
  // Note: coordinates will be Unsupported("geography(Point, 4326)") type
  // We'll use raw SQL for geo queries
  latitude    Float
  longitude   Float
  phone       String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  shop        Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  promotions  PromotionLocation[]

  @@map("shop_locations")
}

model Promotion {
  id                     String   @id @default(uuid())
  shopId                 String   @map("shop_id")
  title                  String
  description            String
  termsConditions        String?  @map("terms_conditions")
  discountType           String?  @map("discount_type")
  discountValue          Decimal? @map("discount_value") @db.Decimal(10, 2)
  imageUrl               String?  @map("image_url")
  targetType             String   @map("target_type")
  radiusMeters           Int      @map("radius_meters")
  startDate              DateTime @map("start_date")
  endDate                DateTime @map("end_date")
  isActive               Boolean  @default(true) @map("is_active")
  maxRedemptionsPerUser  Int?     @default(1) @map("max_redemptions_per_user")
  maxTotalRedemptions    Int?     @map("max_total_redemptions")
  currentRedemptions     Int      @default(0) @map("current_redemptions")
  createdAt              DateTime @default(now()) @map("created_at")
  updatedAt              DateTime @updatedAt @map("updated_at")

  shop                   Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  locations              PromotionLocation[]
  views                  PromotionView[]
  redemptions            PromotionRedemption[]
  notifications          Notification[]

  @@map("promotions")
}

model PromotionLocation {
  promotionId String @map("promotion_id")
  locationId  String @map("location_id")

  promotion   Promotion    @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  location    ShopLocation @relation(fields: [locationId], references: [id], onDelete: Cascade)

  @@id([promotionId, locationId])
  @@map("promotion_locations")
}

model User {
  id                          String   @id @default(uuid())
  email                       String?  @unique
  phone                       String?  @unique
  firstName                   String?  @map("first_name")
  lastName                    String?  @map("last_name")
  passwordHash                String?  @map("password_hash")
  avatarUrl                   String?  @map("avatar_url")
  pushNotificationsEnabled    Boolean  @default(true) @map("push_notifications_enabled")
  emailNotificationsEnabled   Boolean  @default(true) @map("email_notifications_enabled")
  notificationRadiusMeters    Int      @default(5000) @map("notification_radius_meters")
  locationSharingEnabled      Boolean  @default(true) @map("location_sharing_enabled")
  createdAt                   DateTime @default(now()) @map("created_at")
  updatedAt                   DateTime @updatedAt @map("updated_at")
  lastLogin                   DateTime? @map("last_login")

  location                    UserLocation?
  shopPreferences             UserShopPreference[]
  promotionViews              PromotionView[]
  redemptions                 PromotionRedemption[]
  notifications               Notification[]

  @@map("users")
}

model UserLocation {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")
  latitude        Float
  longitude       Float
  accuracyMeters  Decimal? @map("accuracy_meters") @db.Decimal(10, 2)
  updatedAt       DateTime @updatedAt @map("updated_at")

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_locations")
}

model UserShopPreference {
  userId               String   @map("user_id")
  shopId               String   @map("shop_id")
  notificationsEnabled Boolean  @default(true) @map("notifications_enabled")
  createdAt            DateTime @default(now()) @map("created_at")

  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, shopId])
  @@map("user_shop_preferences")
}

model PromotionView {
  id                String   @id @default(uuid())
  promotionId       String   @map("promotion_id")
  userId            String?  @map("user_id")
  viewedAt          DateTime @default(now()) @map("viewed_at")
  userDistanceMeters Int?    @map("user_distance_meters")

  promotion         Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  user              User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("promotion_views")
}

model PromotionRedemption {
  id             String    @id @default(uuid())
  promotionId    String    @map("promotion_id")
  userId         String    @map("user_id")
  shopLocationId String?   @map("shop_location_id")
  redeemedAt     DateTime  @default(now()) @map("redeemed_at")
  redemptionCode String    @unique @map("redemption_code")
  isVerified     Boolean   @default(false) @map("is_verified")
  verifiedAt     DateTime? @map("verified_at")

  promotion      Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("promotion_redemptions")
}

model Notification {
  id               String    @id @default(uuid())
  userId           String    @map("user_id")
  promotionId      String?   @map("promotion_id")
  notificationType String    @map("notification_type")
  status           String    @default("pending")
  sentAt           DateTime? @map("sent_at")
  readAt           DateTime? @map("read_at")
  errorMessage     String?   @map("error_message")
  createdAt        DateTime  @default(now()) @map("created_at")

  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  promotion        Promotion? @relation(fields: [promotionId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
EOF
```

---

## Step 3: Set up Shop Dashboard

### 3.1 Initialize Shop Dashboard

```bash
cd ../shop-dashboard

# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install additional dependencies
npm install react-router-dom axios zustand
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install mapbox-gl @mapbox/mapbox-gl-geocoder
npm install recharts date-fns

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui (optional, for UI components)
# Follow: https://ui.shadcn.com/docs/installation/vite
```

### 3.2 Create .env File

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=your-mapbox-token
EOF
```

### 3.3 Update package.json Scripts

```json
{
  "name": "@promo/shop-dashboard",
  "scripts": {
    "dev": "vite --port 4000",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

---

## Step 4: Set up Customer App (PWA)

### 4.1 Initialize Customer App

```bash
cd ../customer-app

# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install react-router-dom axios zustand
npm install @tanstack/react-query
npm install localforage # For offline storage

# Install PWA plugin
npm install -D vite-plugin-pwa

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4.2 Configure PWA

```bash
# Update vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'PromoNear',
        short_name: 'PromoNear',
        description: 'Discover nearby promotions and deals',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 4001
  }
});
EOF
```

### 4.3 Create .env File

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
EOF
```

---

## Step 5: Set up Shared Package

```bash
cd ../shared

# Initialize package.json
npm init -y

# Install dependencies
npm install zod

# Install dev dependencies
npm install -D typescript

# Create structure
mkdir -p src/{types,schemas,constants,utils}
touch src/index.ts
```

---

## Step 6: Set up Docker

### 6.1 Create docker-compose.yml in Root

```bash
cd ../../..

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    container_name: promo-postgres
    environment:
      POSTGRES_DB: promo_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: promo-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF
```

---

## Step 7: Start Development

### 7.1 Start Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 7.2 Set up Database

```bash
# Run migrations
cd packages/backend
npm run migrate

# (Optional) Seed database with test data
npm run seed

# Open Prisma Studio to view database
npm run studio
```

### 7.3 Start All Services

```bash
# From root directory
cd ../..

# Start all services in development mode
npm run dev

# This will start:
# - Backend API on http://localhost:3000
# - Shop Dashboard on http://localhost:4000
# - Customer App on http://localhost:4001
```

---

## Step 8: Verify Setup

### 8.1 Check Backend

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

### 8.2 Check Shop Dashboard

Open http://localhost:4000 in your browser

### 8.3 Check Customer App

Open http://localhost:4001 in your browser

---

## Step 9: Generate VAPID Keys (for Push Notifications)

```bash
# Install web-push CLI globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys

# Copy the keys to your .env files
```

---

## Step 10: Optional Integrations

### Firebase (Push Notifications)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app
4. Download service account JSON
5. Add credentials to backend `.env`

### Mapbox (Maps)

1. Go to [Mapbox](https://www.mapbox.com/)
2. Create account and get API token
3. Add token to shop-dashboard `.env`

### AWS S3 (File Storage)

1. Create S3 bucket
2. Create IAM user with S3 permissions
3. Add credentials to backend `.env`

---

## Useful Commands

```bash
# Root level
npm run dev              # Start all services
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run format           # Format code with Prettier
npm run clean            # Clean all node_modules

# Backend
cd packages/backend
npm run dev              # Start backend only
npm run migrate          # Run database migrations
npm run studio           # Open Prisma Studio
npm run seed             # Seed database

# Frontend
cd packages/shop-dashboard
npm run dev              # Start shop dashboard only

cd packages/customer-app
npm run dev              # Start customer app only

# Docker
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
docker-compose ps        # List services
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Redis Connection Issues

```bash
# Test Redis connection
docker exec -it promo-redis redis-cli ping
# Expected: PONG
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or 4000, 4001

# Kill process
kill -9 <PID>
```

### PostGIS Extension Error

```bash
# Connect to database and enable PostGIS manually
docker exec -it promo-postgres psql -U postgres -d promo_dev

# In psql:
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

---

## Next Steps

Now that your development environment is set up, you can:

1. Review the [ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md) for detailed architecture
2. Review the [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code organization
3. Start implementing Phase 1 features (see ARCHITECTURE_PLAN.md section 14)
4. Set up authentication endpoints
5. Build the promotion management system
6. Implement geolocation features

---

## Support

If you encounter issues:

1. Check the documentation in this repository
2. Review the [troubleshooting](#troubleshooting) section
3. Check Docker logs: `docker-compose logs`
4. Verify environment variables are set correctly

Happy coding!
