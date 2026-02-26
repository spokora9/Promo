# LoCo — Complete Production Architecture Plan

**Version**: 2.0
**Date**: February 2026
**Status**: Authoritative reference — supersedes all previous architecture docs
**Scope**: App Store (iOS), Google Play (Android), Web (shop dashboard)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Current State vs Target State](#2-current-state-vs-target-state)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Architecture](#4-database-architecture)
5. [Customer App Architecture](#5-customer-app-architecture)
6. [Shop Dashboard Architecture](#6-shop-dashboard-architecture)
7. [Notification System Architecture](#7-notification-system-architecture)
8. [Redemption System Architecture](#8-redemption-system-architecture)
9. [Analytics Architecture](#9-analytics-architecture)
10. [File Storage Architecture](#10-file-storage-architecture)
11. [Caching Architecture](#11-caching-architecture)
12. [Security Architecture](#12-security-architecture)
13. [Infrastructure & Deployment](#13-infrastructure--deployment)
14. [CI/CD Pipeline](#14-cicd-pipeline)
15. [Testing Architecture](#15-testing-architecture)
16. [Environment Configuration](#16-environment-configuration)
17. [Implementation Roadmap](#17-implementation-roadmap)
18. [API Contract Reference](#18-api-contract-reference)

---

## 1. System Overview

### 1.1 Platform Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├──────────────────────────────────┬──────────────────────────────────────────┤
│     Shop Dashboard (Web)         │      Customer App (iOS + Android)        │
│  React 19 + Vite + Tailwind      │      Expo SDK 52 + React Native          │
│  Deployed: Vercel / Netlify      │      Distributed: App Store + Play Store  │
│  URL: dashboard.loco.app         │      Bundle ID: com.loco.customerapp     │
└──────────────┬───────────────────┴──────────────────┬───────────────────────┘
               │                                       │
               │  HTTPS REST + Bearer JWT              │  HTTPS REST + Bearer JWT
               │                                       │
┌──────────────▼───────────────────────────────────────▼───────────────────────┐
│                         API GATEWAY / REVERSE PROXY                           │
│                     Nginx (or Caddy) — TLS termination                        │
│                         api.loco.app → port 3000                              │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼───────────────────────────────────────────┐
│                         FASTIFY 5 API SERVER                                  │
│                    packages/backend/src/server.ts                             │
│                                                                               │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │    Auth     │  │  Promotions   │  │   Locations  │  │     Users        │ │
│  │  Module     │  │   Module      │  │   Module     │  │     Module       │ │
│  └─────────────┘  └───────────────┘  └──────────────┘  └──────────────────┘ │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Shops     │  │ Redemptions   │  │  Analytics   │  │  Notifications   │ │
│  │  Module     │  │   Module ❌   │  │  Module ❌   │  │   Module ❌      │ │
│  └─────────────┘  └───────────────┘  └──────────────┘  └──────────────────┘ │
│  ┌─────────────┐  ┌───────────────┐                                          │
│  │  Discovery  │  │    Files      │                                           │
│  │  Module ❌  │  │  Module ❌    │                                           │
│  └─────────────┘  └───────────────┘                                          │
└────────────────────────┬───────────────────────────────────────────────────┘
                         │
         ┌───────────────┼────────────────────────┐
         │               │                         │
┌────────▼──────┐ ┌──────▼────────┐      ┌────────▼──────────┐
│  PostgreSQL   │ │    Redis 7    │      │  File Storage     │
│  + PostGIS    │ │               │      │  (S3 / R2)        │
│  Primary DB   │ │  Cache +      │      │  Images, logos    │
│               │ │  BullMQ ❌    │      │                   │
└───────────────┘ └───────────────┘      └───────────────────┘
                         │
                ┌────────▼────────┐
                │  BullMQ Workers  │
                │  (separate proc) │
                │  ❌ Not built    │
                │  - Geofence Job  │
                │  - Notif Worker  │
                │  - Promo Cron    │
                └─────────────────┘

❌ = Not yet built
```

### 1.2 Technology Stack (Locked Versions)

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Mobile app | Expo / React Native | SDK 52 | New Architecture enabled |
| Web dashboard | React | 19 | Vite 6 |
| API server | Fastify | 5.x | TypeScript |
| ORM | Prisma | 6.x | |
| Database | PostgreSQL + PostGIS | 15 + 3.3 | |
| Cache / Queue | Redis + BullMQ | 7 / 5.x | BullMQ not yet integrated |
| Auth | JWT (jsonwebtoken) | — | 15m access / 7d refresh |
| Mobile state | Zustand | 5.x | persisted via AsyncStorage |
| Mobile data fetching | TanStack Query | 5.x | |
| Monorepo | Turborepo | latest | |

---

## 2. Current State vs Target State

### 2.1 Backend Modules

| Module | File | Status | Notes |
|---|---|---|---|
| Auth (shop + user) | `src/modules/auth/` | ✅ Complete | register, login, refresh, logout |
| Locations CRUD | `src/modules/locations/` | ✅ Complete | geocoding via Google Maps |
| Profile (shop) | `src/modules/profile/` | ✅ Complete | |
| Promotions CRUD | `src/modules/promotions/` | ✅ Complete | create, read, update, delete, activate, pause, stats, nearby, view track |
| Users | `src/modules/users/` | ✅ Complete | location update, profile, follow/unfollow |
| Shops (public) | `src/modules/shops/` | ✅ Complete | public profile, discovery endpoint stub |
| **Redemptions** | `src/modules/redemptions/` | ❌ Missing | generate code, verify code, history |
| **Notifications** | `src/modules/notifications/` | ❌ Missing | push token store, send push, VAPID |
| **Discovery** | `src/modules/discovery/` | ❌ Missing | exposure tracking, discovery feed API |
| **Analytics** | `src/modules/analytics/` | ❌ Missing | overview, per-promotion stats |
| **Files** | `src/modules/files/` | ❌ Missing | logo/image upload to S3 |
| **BullMQ Workers** | `src/workers/` | ❌ Missing | geofence job, notification worker, promo cron |

### 2.2 Customer App Screens

| Screen | File | Status | Notes |
|---|---|---|---|
| Onboarding | `app/onboarding.tsx` | ✅ Complete | |
| Login | `app/auth/login.tsx` | ✅ Complete | |
| Register | `app/auth/register.tsx` | ✅ Complete | |
| Home (nearby promos) | `app/(tabs)/index.tsx` | ✅ Complete | search, filter, radius picker |
| Discovery | `app/(tabs)/discovery.tsx` | ✅ Complete | mode selector, shop list |
| Favorites | `app/(tabs)/favorites.tsx` | ⚠️ Needs review | |
| Profile/Settings | `app/(tabs)/profile.tsx` | ⚠️ Needs review | |
| Promotion Detail | `app/promotion/[id].tsx` | ✅ Complete | "Redeem" button shows "Coming Soon" |
| Shop Detail | `app/shop/[id].tsx` | ✅ Complete | |
| **Redemption Screen** | `app/redemption/[id].tsx` | ❌ Missing | QR code + text code + countdown |
| **Redemption History** | `app/(tabs)/redeemed.tsx` | ❌ Missing | list of past redemptions |
| **Notification Inbox** | `app/notifications.tsx` | ❌ Missing | |

### 2.3 Shop Dashboard Pages

| Page | File | Status | Notes |
|---|---|---|---|
| Login | `src/pages/LoginPage.tsx` | ✅ Complete | |
| Register | `src/pages/RegisterPage.tsx` | ✅ Complete | |
| Dashboard Home | `src/pages/DashboardPage.tsx` | ⚠️ Placeholder | Stats show "-" / "Coming Soon" |
| Locations List | `src/pages/LocationsPage.tsx` | ✅ Complete | |
| Location Form | `src/pages/LocationFormPage.tsx` | ✅ Complete | |
| Promotions List | `src/pages/PromotionsPage.tsx` | ✅ Complete | |
| Promotion Form | `src/pages/PromotionFormPage.tsx` | ✅ Complete | |
| Profile | `src/pages/ProfilePage.tsx` | ✅ Complete | |
| **Dashboard w/ Real Metrics** | `src/pages/DashboardPage.tsx` | ❌ Missing | replace placeholders with live data |
| **Redemption Verify** | `src/pages/RedemptionVerifyPage.tsx` | ❌ Missing | QR scanner + manual code entry |
| **Redemptions List** | `src/pages/RedemptionsPage.tsx` | ❌ Missing | history with filters |
| **Analytics Page** | `src/pages/AnalyticsPage.tsx` | ❌ Missing | charts, per-promo breakdown |

---

## 3. Backend Architecture

### 3.1 Project Structure (Complete Target)

```
packages/backend/src/
├── index.ts                          # Entry point — starts Fastify + workers
├── server.ts                         # Fastify instance builder
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts        ✅
│   │   ├── auth.routes.ts            ✅
│   │   ├── auth.schema.ts            ✅
│   │   └── auth.service.ts           ✅
│   │
│   ├── locations/
│   │   ├── locations.controller.ts   ✅
│   │   ├── locations.routes.ts       ✅
│   │   ├── locations.schema.ts       ✅
│   │   └── locations.service.ts      ✅
│   │
│   ├── profile/
│   │   ├── profile.controller.ts     ✅
│   │   ├── profile.routes.ts         ✅
│   │   ├── profile.schema.ts         ✅
│   │   └── profile.service.ts        ✅
│   │
│   ├── promotions/
│   │   ├── promotions.controller.ts  ✅
│   │   ├── promotions.routes.ts      ✅  — missing: /redeem, /verify routes
│   │   ├── promotions.schema.ts      ✅
│   │   └── promotions.service.ts     ✅  — missing: redeemPromotion(), verifyCode()
│   │
│   ├── shops/
│   │   ├── shops.routes.ts           ✅
│   │   └── shops.service.ts          ✅  — missing: discovery feed
│   │
│   ├── users/
│   │   ├── users.controller.ts       ✅
│   │   ├── users.routes.ts           ✅  — missing: push-token, favorites, redemptions
│   │   └── users.service.ts          ✅
│   │
│   ├── redemptions/                  ❌ CREATE THIS MODULE
│   │   ├── redemptions.controller.ts
│   │   ├── redemptions.routes.ts
│   │   ├── redemptions.schema.ts
│   │   └── redemptions.service.ts
│   │
│   ├── notifications/                ❌ CREATE THIS MODULE
│   │   ├── notifications.controller.ts
│   │   ├── notifications.routes.ts
│   │   ├── notifications.schema.ts
│   │   └── notifications.service.ts
│   │
│   ├── discovery/                    ❌ CREATE THIS MODULE
│   │   ├── discovery.controller.ts
│   │   ├── discovery.routes.ts
│   │   └── discovery.service.ts
│   │
│   ├── analytics/                    ❌ CREATE THIS MODULE
│   │   ├── analytics.controller.ts
│   │   ├── analytics.routes.ts
│   │   └── analytics.service.ts
│   │
│   └── files/                        ❌ CREATE THIS MODULE
│       ├── files.controller.ts
│       ├── files.routes.ts
│       └── files.service.ts
│
├── workers/                          ❌ CREATE THIS DIRECTORY
│   ├── index.ts                      # Starts all workers
│   ├── geofence.worker.ts            # Polls user locations vs promotions
│   ├── notification.worker.ts        # Processes notification queue
│   └── promotion-lifecycle.worker.ts # Auto-activates/deactivates promotions
│
└── shared/
    ├── config/
    │   ├── database.ts               ✅
    │   └── redis.ts                  ✅  — connected but unused
    ├── middleware/
    │   └── auth.middleware.ts        ✅
    ├── services/
    │   ├── geocoding.service.ts      ✅
    │   ├── expo-push.service.ts      ❌ CREATE — wraps Expo Push API
    │   └── qrcode.service.ts         ❌ CREATE — generates QR codes as base64
    └── utils/
        └── errors.ts                 ✅
```

### 3.2 All API Routes — Complete Target

All routes are prefixed with `/api/v1`.

#### Auth Routes (`/auth`)

| Method | Path | Auth | Status |
|---|---|---|---|
| POST | `/auth/shops/register` | None | ✅ |
| POST | `/auth/shops/login` | None | ✅ |
| GET | `/auth/shops/me` | Shop JWT | ✅ |
| POST | `/auth/users/register` | None | ✅ |
| POST | `/auth/users/login` | None | ✅ |
| GET | `/auth/users/me` | User JWT | ✅ |
| POST | `/auth/refresh` | None | ✅ |
| POST | `/auth/logout` | Any JWT | ✅ |

#### Shop Management Routes (`/shops`)

| Method | Path | Auth | Status |
|---|---|---|---|
| GET | `/shops/:id` | None | ✅ |
| GET | `/shops/discovery` | None | ✅ (stub exists) |
| GET | `/shops/promotions` | Shop | ✅ |
| POST | `/shops/promotions` | Shop | ✅ |
| GET | `/shops/promotions/:id` | Shop | ✅ |
| PUT | `/shops/promotions/:id` | Shop | ✅ |
| DELETE | `/shops/promotions/:id` | Shop | ✅ |
| POST | `/shops/promotions/:id/activate` | Shop | ✅ |
| POST | `/shops/promotions/:id/pause` | Shop | ✅ |
| GET | `/shops/promotions/:id/stats` | Shop | ✅ |
| POST | `/shops/promotions/:id/image` | Shop | ❌ file upload |
| POST | `/shops/logo` | Shop | ❌ file upload |
| GET | `/shops/redemptions` | Shop | ❌ list redemptions |
| POST | `/shops/redemptions/verify` | Shop | ❌ verify a code |
| GET | `/shops/analytics/overview` | Shop | ❌ dashboard stats |
| GET | `/shops/analytics/promotions/:id` | Shop | ❌ per-promo analytics |

#### Location Routes (`/shops/locations`)

| Method | Path | Auth | Status |
|---|---|---|---|
| GET | `/shops/locations` | Shop | ✅ |
| POST | `/shops/locations` | Shop | ✅ |
| PUT | `/shops/locations/:id` | Shop | ✅ |
| DELETE | `/shops/locations/:id` | Shop | ✅ |

#### Promotions (Public/Customer) Routes

| Method | Path | Auth | Status |
|---|---|---|---|
| GET | `/promotions/nearby` | None | ✅ |
| GET | `/promotions/:id` | None | ✅ |
| POST | `/promotions/:id/view` | None | ✅ |
| POST | `/promotions/:id/redeem` | User | ❌ generate redemption code |

#### User Routes (`/users`)

| Method | Path | Auth | Status |
|---|---|---|---|
| POST | `/users/location` | User | ✅ |
| GET | `/users/profile` | User | ✅ |
| PUT | `/users/profile` | User | ✅ |
| GET | `/users/shops/following` | User | ✅ |
| POST | `/users/shops/:id/follow` | User | ✅ |
| DELETE | `/users/shops/:id/follow` | User | ✅ |
| POST | `/users/push-token` | User | ❌ register Expo push token |
| GET | `/users/redemptions` | User | ❌ redemption history |
| GET | `/users/favorites/shops` | User | ❌ (API client calls this, no route) |
| GET | `/users/favorites/promotions` | User | ❌ |
| POST | `/users/favorites/promotions/:id` | User | ❌ |
| DELETE | `/users/favorites/promotions/:id` | User | ❌ |

#### Notifications Routes

| Method | Path | Auth | Status |
|---|---|---|---|
| POST | `/notifications/subscribe` | User | ❌ store VAPID subscription |
| GET | `/notifications` | User | ❌ list user notifications |
| PATCH | `/notifications/:id/read` | User | ❌ mark as read |

#### Discovery Routes

| Method | Path | Auth | Status |
|---|---|---|---|
| GET | `/discovery/feed` | User | ❌ return discovered shops |
| POST | `/discovery/dismiss/:shopId` | User | ❌ dismiss a shop |
| POST | `/discovery/not-interested/:shopId` | User | ❌ |

---

## 4. Database Architecture

### 4.1 Current Schema Summary

The Prisma schema at `packages/backend/prisma/schema.prisma` already contains all necessary models:

| Model | Purpose | Status |
|---|---|---|
| `Shop` | Merchant account | ✅ Complete |
| `ShopLocation` | Physical store addresses with lat/lon | ✅ Complete |
| `Promotion` | Promotion definitions with geofencing | ✅ Complete |
| `User` | Customer accounts | ✅ Complete |
| `UserLocation` | Last known user coordinates | ✅ Complete |
| `UserShopPreference` | Followed shops | ✅ Complete |
| `PromotionView` | View analytics events | ✅ Complete |
| `PromotionRedemption` | Redemption records + codes | ✅ Complete |
| `Notification` | Notification delivery log | ✅ Complete |
| `DiscoveryExposure` | Discovery mode tracking per user/shop | ✅ Complete |
| `PushSubscription` | Web Push VAPID subscriptions | ✅ Complete |

### 4.2 Schema Additions Required

The current schema models are sufficient for V1. However, the following fields/tables need to be added:

#### Add to `Shop` model
```prisma
// Missing — referenced in auth.service.ts:154 but not in schema
lastLoginAt  DateTime? @map("last_login_at")
status       String    @default("active")  // referenced in auth.service.ts but missing
```

> **Action**: Run `npx prisma migrate dev --name add-shop-status-lastlogin`

#### Add `PushToken` model (for Expo push tokens — different from VAPID `PushSubscription`)
```prisma
model PushToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique              // Expo push token: ExponentPushToken[...]
  platform  String                        // "ios" | "android"
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("push_tokens")
}
```

#### Add `UserFavoritePromotion` model
```prisma
model UserFavoritePromotion {
  userId      String   @map("user_id")
  promotionId String   @map("promotion_id")
  createdAt   DateTime @default(now()) @map("created_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  promotion Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)

  @@id([userId, promotionId])
  @@map("user_favorite_promotions")
}
```

### 4.3 Database Indexes for Performance

Add these to the schema for production query performance:

```prisma
// On PromotionRedemption — for shop owner lookups
@@index([shopLocationId])   // currently missing

// On Notification
@@index([createdAt])        // for date-range queries in analytics

// On PushToken
@@index([platform])         // for batching by platform
```

### 4.4 PostGIS Query Strategy

The nearby promotions query in `promotions.service.ts:203` uses raw SQL with `ST_DWithin` and `ST_MakePoint`. This is correct. The geofence worker will use the same pattern to find users within active promotion radii:

```sql
-- Geofence match query (to run in worker every 5 minutes)
SELECT DISTINCT u.id, u.email, p.id as promotion_id, p.title
FROM users u
JOIN user_locations ul ON ul.user_id = u.id
JOIN promotions p ON p.status = 'active' AND p.end_date >= NOW()
JOIN shops s ON s.id = p.shop_id AND s.is_active = true
JOIN shop_locations sl ON sl.shop_id = s.id AND sl.is_active = true
WHERE
  u.push_notifications_enabled = true
  AND (p.target_all_locations = true OR sl.id = ANY(p.target_location_ids))
  AND ST_DWithin(
    ST_MakePoint(ul.longitude, ul.latitude)::geography,
    ST_MakePoint(sl.longitude, sl.latitude)::geography,
    p.radius_meters
  )
  AND ul.updated_at >= NOW() - INTERVAL '10 minutes'  -- only recently-active users
```

---

## 5. Customer App Architecture

### 5.1 Navigation Structure (Complete Target)

```
app/
├── _layout.tsx                    # Root — auth gate, query client, location init
│
├── onboarding.tsx                 ✅  # Shown once on first launch
│
├── auth/
│   ├── login.tsx                  ✅
│   └── register.tsx               ✅
│
├── (tabs)/
│   ├── _layout.tsx                ✅  # Tab bar: Home | Discover | Saved | Profile
│   ├── index.tsx                  ✅  # Home — nearby promotions feed
│   ├── discovery.tsx              ✅  # Discovery mode + discovered shops
│   ├── favorites.tsx              ⚠️  # Saved promotions + followed shops
│   ├── profile.tsx                ⚠️  # Settings, notifications, location prefs
│   └── redeemed.tsx               ❌  # Redemption history tab — ADD THIS
│
├── promotion/
│   └── [id].tsx                   ✅  # Promotion detail — "Redeem" button live
│
├── shop/
│   └── [id].tsx                   ✅  # Shop public profile
│
└── redemption/
    └── [id].tsx                   ❌  # QR code display screen — ADD THIS
```

### 5.2 State Management

All stores live in `packages/customer-app/src/stores/`:

| Store | File | Purpose | Status |
|---|---|---|---|
| `useAuthStore` | `authStore.ts` | user, token, refreshToken, isAuthenticated | ✅ persisted to AsyncStorage |
| `useLocationStore` | `locationStore.ts` | currentLocation, permissionStatus | ✅ |
| `useDiscoveryStore` | `discoveryStore.ts` | mode (off/active/silent) | ✅ |
| `useNotificationStore` | ❌ to create | unread count, notification list | ❌ |
| `useRedemptionStore` | ❌ to create | active redemption code, countdown | ❌ |

### 5.3 Location & Geofencing Architecture

The location service at `src/services/location.ts` has all the infrastructure:

```
App Launch
    │
    ▼
requestLocationPermissions()
    │ granted
    ▼
getCurrentLocation() ──► update locationStore + POST /users/location
    │
    ▼
startBackgroundLocationTracking()
    Interval: 5 minutes OR 100m moved
    Task: BACKGROUND_LOCATION_TASK
        │ fires
        ▼
    updateUserLocation() → POST /users/location
        │
        ▼
    [Backend worker sees new location]
    [Matches against active promotions]
    [Queues push notification via BullMQ]
        │
        ▼
    Expo Push Notification received
```

**What's missing**: The geofence task handler at `location.ts:46` logs `'Entered geofence'` but does nothing further. The backend worker that reads user locations and matches them to promotions does not exist.

### 5.4 Redemption Screen (`app/redemption/[id].tsx`)

This screen must be created. Flow:

```
User taps "Redeem This Offer" on promotion/[id].tsx
    │
    ▼
POST /api/v1/promotions/:id/redeem
    │ Response: { code: "LOCO-ABC123", qrCodeBase64: "...", expiresAt: "..." }
    ▼
app/redemption/[id].tsx renders:
    - Large QR code image (from base64)
    - Text code "LOCO-ABC123" (large, monospace)
    - Countdown timer (codes expire in 10 minutes)
    - "Show to staff to redeem" instruction
    - Share button (optional)
```

### 5.5 Push Notifications — Mobile Side

The service at `src/services/notifications.ts` is complete. The missing link is:

1. `registerPushToken()` in `notifications.ts:59` calls `Notifications.getExpoPushTokenAsync({ projectId: process.env.EAS_PROJECT_ID })` — the `EAS_PROJECT_ID` env var must be set and the real EAS project must be created.
2. `registerPushToken(token)` in `api.ts:146` calls `POST /users/push-token` — **this route does not exist on the backend yet**.
3. The app root layout must call `requestNotificationPermissions()` and `startBackgroundLocationTracking()` after login.

### 5.6 App Configuration Gaps (`app.json`)

| Item | Current Value | Required Action |
|---|---|---|
| `extra.eas.projectId` | `"your-project-id"` | Run `eas init`, replace with real ID |
| `ios.config.googleMapsApiKey` | `"YOUR_GOOGLE_MAPS_API_KEY_IOS"` | Add real key from Google Cloud Console |
| `android.config.googleMaps.apiKey` | `"YOUR_GOOGLE_MAPS_API_KEY_ANDROID"` | Add real key |
| App icons | `./assets/icon.png` etc. | Create 1024×1024 PNG icon + splash |
| `ios.buildNumber` | missing | Add `"1"` |
| `android.versionCode` | missing | Add `1` |

---

## 6. Shop Dashboard Architecture

### 6.1 Page Structure (Complete Target)

```
src/
├── App.tsx                        ✅  # Router — all routes defined
├── main.tsx                       ✅
├── index.css                      ✅
│
├── components/
│   ├── ProtectedRoute.tsx         ✅
│   ├── Sidebar.tsx                ❌  # Navigation sidebar — currently inline in each page
│   ├── StatCard.tsx               ❌  # Reusable metric card component
│   ├── QRScanner.tsx              ❌  # Camera-based QR scanner for redemption verification
│   └── Chart.tsx                  ❌  # Recharts wrapper for analytics
│
├── pages/
│   ├── LoginPage.tsx              ✅
│   ├── RegisterPage.tsx           ✅
│   ├── DashboardPage.tsx          ⚠️  # Replace "-" placeholders with live data
│   ├── LocationsPage.tsx          ✅
│   ├── LocationFormPage.tsx       ✅
│   ├── PromotionsPage.tsx         ✅
│   ├── PromotionFormPage.tsx      ✅
│   ├── ProfilePage.tsx            ✅
│   ├── RedemptionVerifyPage.tsx   ❌  # QR scanner + manual code entry
│   ├── RedemptionsPage.tsx        ❌  # History table with filters
│   └── AnalyticsPage.tsx          ❌  # Per-promotion charts
│
├── lib/
│   ├── api.ts                     ✅
│   ├── locations-api.ts           ✅
│   ├── promotions-api.ts          ✅
│   ├── analytics-api.ts           ❌  # GET /shops/analytics/overview
│   └── redemptions-api.ts         ❌  # GET + POST /shops/redemptions/*
│
└── stores/
    └── authStore.ts               ✅
```

### 6.2 Dashboard Home — Required Live Metrics

Replace the current placeholder content in `DashboardPage.tsx:93-103` with API-driven data from `GET /api/v1/shops/analytics/overview`:

```typescript
interface AnalyticsOverview {
  activePromotions: number;
  totalViews24h: number;
  totalViews7d: number;
  totalRedemptions24h: number;
  totalRedemptions7d: number;
  conversionRate7d: string;           // e.g. "4.2%"
  topPromotion: { id: string; title: string; views: number } | null;
}
```

### 6.3 Redemption Verification Flow (Shop Dashboard)

```
Staff opens /verify
    │
    ▼
Option A: QR Scanner (desktop/mobile browser)
    - Uses react-qr-scanner or html5-qrcode library
    - Decodes QR → extracts code string
    │
Option B: Manual entry
    - Text input for code "LOCO-ABC123"
    │
    ▼ (either path)
POST /api/v1/shops/redemptions/verify  { code: "LOCO-ABC123" }
    │
    ├── 200 OK → show promotion title, customer name, savings amount, green checkmark
    └── 4xx → "Code already used" / "Code expired" / "Invalid code"
```

---

## 7. Notification System Architecture

### 7.1 Overview

LoCo uses **Expo Push Notifications** (not raw APNs/FCM directly) for the mobile app. Expo acts as a proxy to both APNs (iOS) and FCM (Android).

```
Backend Worker (every 5 min)
    │
    ▼
[Query: users near active promotion radius]
    │
    ▼
[For each match — check: not already notified in last 4h]
    │
    ▼
BullMQ: enqueue notification job
    │
    ▼
Notification Worker (consumer)
    │
    ▼
Expo Push API: POST https://exp.host/--/api/v2/push/send
    Body: {
      to: "ExponentPushToken[xxxx]",
      title: "☕ 20% off at Blue Bottle Coffee!",
      body: "You're 150m away. Offer ends tonight.",
      data: { promotionId: "uuid", shopId: "uuid" },
      channelId: "promotions"
    }
    │
    ▼
iOS APNs / Android FCM
    │
    ▼
User device receives notification
    │ Tap
    ▼
app navigates to /promotion/:id
```

### 7.2 Backend Files to Create

#### `src/shared/services/expo-push.service.ts`
```typescript
// Wraps the Expo Push API
// Handles chunking (max 100 per request)
// Handles TicketError / DeviceNotRegistered cleanup
export class ExpoPushService {
  static async sendNotifications(messages: ExpoPushMessage[]): Promise<void>
  static async checkTickets(tickets: ExpoPushTicket[]): Promise<void>
}
```

#### `src/modules/notifications/notifications.service.ts`
```typescript
export class NotificationsService {
  static async registerPushToken(userId: string, token: string, platform: string): Promise<void>
  static async sendProximityNotification(userId: string, promotionId: string): Promise<void>
  static async getUserNotifications(userId: string): Promise<Notification[]>
  static async markAsRead(notificationId: string, userId: string): Promise<void>
}
```

#### `src/workers/notification.worker.ts`
```typescript
// BullMQ consumer for 'notifications' queue
// Processes each job: calls ExpoPushService.sendNotifications()
// On DeviceNotRegistered error: deletes the push token from DB
const worker = new Worker('notifications', async (job) => { ... }, { connection: redis });
```

#### `src/workers/geofence.worker.ts`
```typescript
// Runs every 5 minutes via BullMQ repeatable job
// 1. Queries PostgreSQL with the ST_DWithin PostGIS query
// 2. Filters: user hasn't been notified about this promotion in last 4 hours
//    (check notifications table: WHERE userId = X AND promotionId = Y AND createdAt > NOW() - 4h)
// 3. Enqueues a job on 'notifications' queue for each match
// 4. Writes a record to notifications table with status='pending'
const worker = new Worker('geofence', geofenceJob, { connection: redis });
await queue.add('geofence-scan', {}, { repeat: { every: 5 * 60 * 1000 } });
```

#### `src/workers/promotion-lifecycle.worker.ts`
```typescript
// Runs every 1 minute
// Auto-activates promotions where startDate <= NOW() AND status = 'draft'
// Auto-expires promotions where endDate < NOW() AND status = 'active'
```

### 7.3 BullMQ Queue Setup

Add to `src/index.ts` (alongside Fastify startup):

```typescript
import { startWorkers } from './workers/index';
await startWorkers(); // starts geofence, notification, lifecycle workers
```

Required npm packages to add to `packages/backend/package.json`:
```json
"bullmq": "^5.x",
"expo-server-sdk": "^3.x"
```

---

## 8. Redemption System Architecture

### 8.1 Redemption Code Format

- Format: `LOCO-[A-Z0-9]{6}` (e.g. `LOCO-K7X9P2`)
- Stored in `PromotionRedemption.redemptionCode` (already `@unique` in schema)
- Expires: 10 minutes after generation (enforce in service, not schema)
- Single-use: enforced by `isVerified` flag + `verifiedAt` timestamp

### 8.2 QR Code Content

The QR code encodes a URL that the shop's dashboard scanner can read:
```
https://dashboard.loco.app/verify?code=LOCO-K7X9P2
```

This allows staff to either:
1. Open the QR scanner in the dashboard app
2. Physically hand the phone — the URL auto-fills the verification field

### 8.3 Backend: Redemption Module

#### `src/modules/redemptions/redemptions.service.ts`
```typescript
export class RedemptionsService {

  static async redeemPromotion(promotionId: string, userId: string): Promise<RedemptionResult>
  // Checks:
  // 1. Promotion exists, is active, not expired
  // 2. maxRedemptionsPerUser not exceeded for this user
  // 3. maxTotalRedemptions not exceeded
  // Generates: unique code using nanoid or crypto.randomBytes
  // Creates: PromotionRedemption record { isVerified: false }
  // Returns: { code, qrCodeBase64, expiresAt }

  static async verifyCode(code: string, shopId: string): Promise<VerifyResult>
  // Checks:
  // 1. Code exists in PromotionRedemption
  // 2. Not already verified (isVerified === false)
  // 3. Created within last 10 minutes (createdAt + 10min > NOW())
  // 4. Promotion belongs to this shopId (security check)
  // Updates: isVerified = true, verifiedAt = NOW()
  // Increments: promotion.currentRedemptions
  // Returns: promotion details, customer name, savings

  static async getUserRedemptions(userId: string): Promise<PromotionRedemption[]>
  static async getShopRedemptions(shopId: string, filters?: RedemptionFilters): Promise<PromotionRedemption[]>
}
```

#### `src/modules/redemptions/redemptions.routes.ts`
```typescript
// POST /promotions/:id/redeem        — authenticateUser
// POST /shops/redemptions/verify     — authenticateShop
// GET  /users/redemptions            — authenticateUser
// GET  /shops/redemptions            — authenticateShop
```

### 8.4 QR Code Generation

Use the `qrcode` npm package server-side to generate a base64 PNG:
```typescript
import QRCode from 'qrcode';

const qrCodeBase64 = await QRCode.toDataURL(
  `https://dashboard.loco.app/verify?code=${code}`,
  { width: 300, margin: 2 }
);
```

Add to `packages/backend/package.json`: `"qrcode": "^1.5.x"`

### 8.5 Customer App: Redemption Screen

**New file**: `packages/customer-app/app/redemption/[id].tsx`

```
State:
  - loading: boolean
  - redemption: { code, qrCodeBase64, expiresAt } | null
  - secondsRemaining: number
  - isExpired: boolean

On mount:
  - POST /promotions/:id/redeem
  - Start countdown interval (expiresAt - now)

Render:
  ┌──────────────────────────────┐
  │  Redeeming: "20% Off Coffee" │
  │                              │
  │    [QR Code — 250×250px]     │
  │                              │
  │        LOCO-K7X9P2           │  ← large monospace text
  │                              │
  │    ⏱ Expires in 08:43        │  ← countdown
  │                              │
  │  Show this to staff          │
  └──────────────────────────────┘

On expiry:
  - Show "Code expired. Tap to get a new code."
  - Disable countdown, show refresh button
```

---

## 9. Analytics Architecture

### 9.1 Data Sources

All analytics data is derived from existing tables:
- `PromotionView` — view events (promotionId, userId, viewedAt, userDistanceMeters)
- `PromotionRedemption` — redemption events (promotionId, userId, redeemedAt, isVerified)
- `Promotion.currentRedemptions` — denormalized redemption count

### 9.2 Analytics API Endpoints

#### `GET /api/v1/shops/analytics/overview`
Returns aggregate metrics for the shop dashboard home:
```typescript
{
  activePromotions: number,
  totalViews: { "24h": number, "7d": number, "30d": number },
  totalRedemptions: { "24h": number, "7d": number, "30d": number },
  conversionRate: { "7d": string },   // "4.2%"
  topPromotion: { id, title, views, redemptions } | null
}
```

#### `GET /api/v1/shops/analytics/promotions/:id`
Returns detailed stats for a single promotion:
```typescript
{
  promotionId: string,
  views: PromotionView[],              // time-series for charting
  redemptions: PromotionRedemption[],
  totalViews: number,
  uniqueViewers: number,
  totalRedemptions: number,
  conversionRate: string,
  avgDistanceMeters: number,
  viewsByDay: { date: string, count: number }[],   // last 30 days
  redemptionsByDay: { date: string, count: number }[]
}
```

### 9.3 Shop Dashboard Analytics Page

Add `recharts` to `packages/shop-dashboard/package.json`.

```
AnalyticsPage.tsx layout:

┌─────────────────────────────────────────────────┐
│  Analytics Overview        [Last 7d ▼]          │
├────────────┬──────────────┬─────────────────────┤
│ 2,341 views│ 89 redemptions│  3.8% conversion   │
├────────────┴──────────────┴─────────────────────┤
│  Views Over Time (line chart)                   │
│  ~~~~~~~~~~~~~~~                                │
├─────────────────────────────────────────────────┤
│  Top Promotions (table)                         │
│  | Title | Views | Redeemed | Conversion |      │
└─────────────────────────────────────────────────┘
```

### 9.4 Caching Analytics Queries

Analytics overview queries should be cached in Redis (TTL: 5 minutes) to avoid repeated aggregation queries:

```typescript
const cacheKey = `analytics:overview:${shopId}:7d`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
// ... run query ...
await redis.setex(cacheKey, 300, JSON.stringify(result));
```

---

## 10. File Storage Architecture

### 10.1 What Needs File Storage

| Asset | Who uploads | Where stored |
|---|---|---|
| Shop logo | Shop owner via dashboard | S3 / R2 |
| Promotion image | Shop owner via dashboard | S3 / R2 |
| User avatar | Customer via mobile app | S3 / R2 |

### 10.2 Storage Provider: Cloudflare R2 (Recommended)

Cloudflare R2 is S3-compatible with no egress fees. Use the AWS SDK v3:

```bash
# packages/backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Environment variables:
```env
R2_ACCOUNT_ID=xxxx
R2_ACCESS_KEY_ID=xxxx
R2_SECRET_ACCESS_KEY=xxxx
R2_BUCKET_NAME=loco-assets
R2_PUBLIC_URL=https://assets.loco.app
```

### 10.3 Upload Flow

**Shop dashboard** uploads images via presigned URL to avoid routing large binaries through the API server:

```
1. POST /api/v1/files/presign  { filename: "logo.png", contentType: "image/png" }
   ← returns { uploadUrl: "https://r2.../...", publicUrl: "https://assets.loco.app/..." }

2. Frontend: PUT uploadUrl with raw file bytes (direct to R2, no server involved)

3. Frontend: PATCH /api/v1/shops/profile  { logoUrl: publicUrl }
```

### 10.4 Image Optimization

Add `sharp` to backend for server-side resizing before storage:
- Shop logo: resize to 512×512, convert to WebP
- Promotion image: resize to max 1200px wide, convert to WebP
- User avatar: resize to 256×256

---

## 11. Caching Architecture

Redis is connected (`src/shared/config/redis.ts`) but not used anywhere in the codebase. The `CACHE_TTL` constants are defined but unused. Here is the complete caching strategy:

### 11.1 Cache Keys and TTLs

| Key Pattern | TTL | Populated By | Invalidated By |
|---|---|---|---|
| `nearby:{lat_grid}:{lon_grid}:{radius}` | 5 min | `GET /promotions/nearby` | Promotion create/update/activate |
| `promotion:{id}` | 10 min | `GET /promotions/:id` | Promotion update |
| `shop:{id}` | 10 min | `GET /shops/:id` | Shop profile update |
| `analytics:overview:{shopId}:{period}` | 5 min | `GET /analytics/overview` | Any new view/redemption |
| `discovery:{lat_grid}:{lon_grid}` | 15 min | `GET /shops/discovery` | New shop/location added |

### 11.2 Location Grid Snapping

For the nearby cache key, snap coordinates to a 500m grid to improve cache hit rate:

```typescript
const snapToGrid = (coord: number, gridSize = 0.005) =>
  Math.round(coord / gridSize) * gridSize;
// 0.005 degrees ≈ 500m
const gridLat = snapToGrid(latitude);
const gridLon = snapToGrid(longitude);
const cacheKey = `nearby:${gridLat}:${gridLon}:${radiusMeters}`;
```

---

## 12. Security Architecture

### 12.1 Current Issues to Fix

| Issue | Location | Fix |
|---|---|---|
| CORS `origin: '*'` | `server.ts:39` | Change to `process.env.CORS_ORIGIN` with exact domain list |
| JWT secret fallback | `auth.service.ts:6-7` | Remove fallback strings; throw on missing env var |
| No rate limiting | All auth routes | Add `@fastify/rate-limit` plugin |
| Refresh tokens not rotated | `auth.service.ts:291` | Implement refresh token rotation + blocklist in Redis |
| No input sanitization | Various | Zod schemas exist but raw SQL uses Prisma tagged templates (safe) |
| `passwordHash` in Shop model | `auth.service.ts:155` | Already excluded from select — verify all endpoints |

### 12.2 Rate Limiting

Install: `npm install @fastify/rate-limit`

Apply per-route limits in `server.ts`:
```typescript
await fastify.register(import('@fastify/rate-limit'), {
  global: false,  // opt-in per route
});

// Auth routes: strict limits
fastify.post('/auth/shops/login', {
  config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  handler: AuthController.loginShop,
});

// Nearby promotions: moderate limit
fastify.get('/promotions/nearby', {
  config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
});
```

### 12.3 Refresh Token Rotation

Current implementation in `auth.service.ts:291` generates new tokens but does not blocklist the old refresh token. Fix:

```typescript
// On refresh: store old refresh token hash in Redis with TTL = 7d
// Mark it as "used"
const oldTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
await redis.setex(`revoked_refresh:${oldTokenHash}`, 7 * 24 * 60 * 60, '1');

// On any refresh attempt: check if token hash is in revoked set
const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
const isRevoked = await redis.get(`revoked_refresh:${hash}`);
if (isRevoked) throw new UnauthorizedError('Refresh token already used');
```

### 12.4 Redemption Security

The `POST /promotions/:id/redeem` endpoint must:
1. Verify the user's last known location is within the promotion radius (check `UserLocation` table)
2. Or accept the user's current location in the request body and verify server-side
3. Rate-limit: max 5 redemption attempts per user per hour

### 12.5 HTTPS / TLS

All production traffic must be TLS-encrypted:
- API: Caddy or Nginx with Let's Encrypt auto-renew
- Dashboard: handled by Vercel/Netlify
- Mobile app: enforced by App Transport Security (iOS) and Network Security Config (Android)

---

## 13. Infrastructure & Deployment

### 13.1 Environments

| Environment | Purpose | Branch |
|---|---|---|
| Local | Development | any |
| Staging | QA + testing | `develop` |
| Production | Live users | `main` |

### 13.2 Recommended Cloud Architecture

**Minimum viable production setup (cost-effective for launch):**

```
┌────────────────────────────────────────────────────────────┐
│                    Railway.app (or Fly.io)                  │
│                                                            │
│  ┌─────────────────┐    ┌─────────────────────────────┐   │
│  │  Fastify API    │    │  PostgreSQL + PostGIS        │   │
│  │  Node 20        │    │  (Railway managed)           │   │
│  │  1GB RAM        │    │  1GB RAM, 10GB storage       │   │
│  └─────────────────┘    └─────────────────────────────┘   │
│  ┌─────────────────┐    ┌─────────────────────────────┐   │
│  │  BullMQ Workers │    │  Redis                      │   │
│  │  (same process  │    │  (Railway managed)           │   │
│  │   or separate)  │    │  256MB                       │   │
│  └─────────────────┘    └─────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

┌─────────────────┐   ┌─────────────────────┐
│  Vercel         │   │  Cloudflare R2      │
│  Shop Dashboard │   │  Asset storage      │
│  (static)       │   │  (logos, images)    │
└─────────────────┘   └─────────────────────┘

┌─────────────────────────────────────────────┐
│  Expo Application Services (EAS)           │
│  Mobile app builds + OTA updates           │
│  eas build --platform all                  │
└─────────────────────────────────────────────┘
```

### 13.3 Backend Dockerfile

Create `packages/backend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --workspace=packages/backend --workspace=packages/shared
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
RUN npm run build --workspace=packages/backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### 13.4 Production Environment Variables

Create `packages/backend/.env.production` (never commit — inject via platform secrets):

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/loco_prod?schema=public&sslmode=require

# Redis
REDIS_URL=redis://:password@host:6379

# Auth
JWT_SECRET=<64 random bytes hex>
JWT_REFRESH_SECRET=<64 random bytes hex>

# CORS
CORS_ORIGIN=https://dashboard.loco.app

# Google Maps (geocoding)
GOOGLE_MAPS_API_KEY=<key>

# Cloudflare R2
R2_ACCOUNT_ID=<id>
R2_ACCESS_KEY_ID=<key>
R2_SECRET_ACCESS_KEY=<secret>
R2_BUCKET_NAME=loco-assets-prod
R2_PUBLIC_URL=https://assets.loco.app

# App
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

Create `packages/customer-app/.env.production`:
```env
API_URL=https://api.loco.app/api/v1
EAS_PROJECT_ID=<real-project-id-from-eas-init>
```

Create `packages/shop-dashboard/.env.production`:
```env
VITE_API_URL=https://api.loco.app/api/v1
```

### 13.5 EAS Build Configuration

Create `packages/customer-app/eas.json`:
```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "API_URL": "http://localhost:3000/api/v1" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "API_URL": "https://staging-api.loco.app/api/v1" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "API_URL": "https://api.loco.app/api/v1" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@apple.id",
        "ascAppId": "<app-store-connect-app-id>",
        "appleTeamId": "<team-id>"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## 14. CI/CD Pipeline

### 14.1 GitHub Actions Workflows

Create `.github/workflows/` directory with:

#### `.github/workflows/ci.yml` — runs on every PR
```yaml
name: CI
on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:15-3.3
        env:
          POSTGRES_DB: loco_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run db:migrate:test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/loco_test
      - run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/loco_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
```

#### `.github/workflows/deploy-staging.yml` — runs on push to `develop`
```yaml
name: Deploy Staging
on:
  push:
    branches: [develop]
jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-github-action@v1  # or flyctl
        with:
          service: loco-api-staging
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build --workspace=packages/shop-dashboard
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### `.github/workflows/deploy-production.yml` — runs on push to `main`
```yaml
name: Deploy Production
on:
  push:
    branches: [main]
jobs:
  deploy-api:
    # Same as staging but targets production service
  deploy-dashboard:
    # Same as staging but with --prod flag on Vercel
  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive --profile production
        working-directory: packages/customer-app
```

### 14.2 Database Migration Strategy

Never run `prisma migrate deploy` automatically without a review gate. Strategy:

```
1. Developer runs: npx prisma migrate dev --name <description>   (local)
2. Migration SQL reviewed in PR
3. On merge to main: manual trigger or post-deploy hook runs:
   npx prisma migrate deploy   (production)
```

---

## 15. Testing Architecture

**Current state: zero test files exist.** The following test strategy covers all layers.

### 15.1 Backend Tests

Install: `npm install --save-dev vitest @vitest/coverage-v8 supertest`

Structure:
```
packages/backend/
└── src/
    └── __tests__/
        ├── auth.test.ts              # register, login, refresh, logout
        ├── promotions.test.ts        # CRUD + nearby query
        ├── redemptions.test.ts       # generate code, verify, limits
        ├── locations.test.ts         # CRUD + geocoding
        ├── notifications.test.ts     # push token store, send
        ├── analytics.test.ts         # overview, per-promo
        └── geofence.worker.test.ts   # mock PostGIS, verify match logic
```

Each test file uses a test database (separate schema or transaction rollback):
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globalSetup: './src/__tests__/setup.ts',  // migrate test DB
    hookTimeout: 30000,
  }
});
```

### 15.2 Customer App Tests

Install: `npm install --save-dev jest @testing-library/react-native`

```
packages/customer-app/
└── src/
    └── __tests__/
        ├── stores/
        │   ├── authStore.test.ts
        │   └── locationStore.test.ts
        ├── services/
        │   ├── location.test.ts
        │   └── notifications.test.ts
        └── components/
            ├── PromotionCard.test.tsx
            └── RedemptionScreen.test.tsx
```

### 15.3 E2E Tests

Use Detox (mobile) or Playwright (dashboard web):

**Priority E2E flows:**
1. Shop: register → add location → create promotion → activate
2. Customer: register → grant location → see nearby promotion → redeem
3. Shop: verify redemption code → success
4. Geofence: user enters radius → push notification received

---

## 16. Environment Configuration

### 16.1 All Environment Variables — Complete Reference

#### `packages/backend/.env`
```env
# Server
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/loco_dev

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=                          # REQUIRED — min 32 chars
JWT_REFRESH_SECRET=                  # REQUIRED — min 32 chars

# Geocoding
GOOGLE_MAPS_API_KEY=                 # Optional — fallback uses mock coords

# CORS
CORS_ORIGIN=http://localhost:5173    # Dashboard dev URL

# File Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=loco-assets-dev
R2_PUBLIC_URL=http://localhost:3000/assets   # local mock

# Workers
GEOFENCE_INTERVAL_MS=300000          # 5 minutes
NOTIFICATION_COOLDOWN_HOURS=4        # Don't re-notify for 4 hours
```

#### `packages/customer-app/.env`
```env
API_URL=http://localhost:3000/api/v1
EAS_PROJECT_ID=                      # From: eas init
```

#### `packages/shop-dashboard/.env`
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 17. Implementation Roadmap

Based on the current state (Sprint 3 complete), here is the prioritized build order for production.

### Phase 1: Core Completion (Weeks 1–2) — Unblock the app

**Goal**: Every button in the app does something real.

| Task | File(s) | Priority |
|---|---|---|
| Backend: Redemption module | `src/modules/redemptions/` | P0 |
| Backend: `POST /promotions/:id/redeem` | `promotions.routes.ts` | P0 |
| Backend: `POST /shops/redemptions/verify` | `redemptions.routes.ts` | P0 |
| Backend: `POST /users/push-token` | `users.routes.ts` | P0 |
| Mobile: Redemption screen | `app/redemption/[id].tsx` | P0 |
| Mobile: Wire up "Redeem" button in `promotion/[id].tsx:288` | `app/promotion/[id].tsx` | P0 |
| Mobile: Redemption history tab | `app/(tabs)/redeemed.tsx` | P1 |
| Dashboard: Redemption verify page | `src/pages/RedemptionVerifyPage.tsx` | P0 |
| Add QR scanner library | `packages/shop-dashboard/package.json` | P0 |
| Add qrcode package to backend | `packages/backend/package.json` | P0 |

### Phase 2: Notifications (Weeks 3–4) — Core differentiator

| Task | File(s) | Priority |
|---|---|---|
| Backend: BullMQ integration | `src/workers/`, `src/index.ts` | P0 |
| Backend: Geofence worker | `src/workers/geofence.worker.ts` | P0 |
| Backend: Notification worker | `src/workers/notification.worker.ts` | P0 |
| Backend: Expo Push service | `src/shared/services/expo-push.service.ts` | P0 |
| Backend: Promotion lifecycle cron | `src/workers/promotion-lifecycle.worker.ts` | P1 |
| Mobile: Call `requestNotificationPermissions()` on login | `app/_layout.tsx` | P0 |
| Mobile: Handle notification tap → navigate to promotion | `app/_layout.tsx` | P0 |
| EAS: Create real project (`eas init`) | `packages/customer-app/` | P0 |
| app.json: Replace API key placeholders | `app.json` | P0 |

### Phase 3: Analytics & Dashboard Polish (Week 5)

| Task | File(s) | Priority |
|---|---|---|
| Backend: Analytics overview endpoint | `src/modules/analytics/` | P0 |
| Backend: Per-promotion analytics | `src/modules/analytics/` | P1 |
| Dashboard: Live metrics on DashboardPage | `src/pages/DashboardPage.tsx` | P0 |
| Dashboard: Analytics page with charts | `src/pages/AnalyticsPage.tsx` | P1 |
| Dashboard: Add Recharts | `packages/shop-dashboard/package.json` | P1 |
| Backend: Redis caching for nearby query | `promotions.service.ts` | P1 |

### Phase 4: File Uploads & Discovery (Week 6)

| Task | File(s) | Priority |
|---|---|---|
| Backend: File upload module (R2) | `src/modules/files/` | P1 |
| Backend: Discovery feed endpoint | `src/modules/discovery/` | P1 |
| Backend: Exposure tracking | `src/modules/discovery/` | P1 |
| Mobile: Favorites tab complete | `app/(tabs)/favorites.tsx` | P1 |
| Mobile: Profile/settings complete | `app/(tabs)/profile.tsx` | P1 |
| Schema: Add `lastLoginAt` + `status` to Shop | `schema.prisma` | P0 |
| Schema: Add `PushToken` model | `schema.prisma` | P0 |
| Schema: Add `UserFavoritePromotion` model | `schema.prisma` | P1 |

### Phase 5: Security, Testing & Infra (Weeks 7–8)

| Task | Priority |
|---|---|
| Fix CORS from `*` to real domain | P0 |
| Remove JWT secret fallback strings | P0 |
| Add `@fastify/rate-limit` to auth routes | P0 |
| Implement refresh token rotation + Redis blocklist | P0 |
| Write backend tests (auth, promotions, redemptions) | P0 |
| Set up GitHub Actions CI workflow | P0 |
| Create `packages/backend/Dockerfile` | P0 |
| Create `packages/customer-app/eas.json` | P0 |
| Deploy backend to Railway/Fly.io staging | P0 |
| Deploy dashboard to Vercel staging | P0 |

### Phase 6: App Store Submission (Week 9)

| Task | Notes |
|---|---|
| Create 1024×1024 app icon | Required for both stores |
| Create splash screen (2048×2048) | iOS + Android |
| Create screenshots (6 sizes for iOS) | App Store Connect requirement |
| Apple Developer account enrollment | $99/year |
| Google Play Console account | $25 one-time |
| Privacy Policy page | Required for location + notifications |
| Create `eas.json` with submit config | |
| `eas build --platform all --profile production` | |
| `eas submit --platform all` | |

---

## 18. API Contract Reference

### 18.1 Response Envelope

All API responses use this envelope (already implemented):
```typescript
// Success
{ "success": true, "data": <payload> }

// Error
{ "success": false, "error": "Human-readable message", "details": [...] }
```

### 18.2 Authentication Header

All authenticated requests must include:
```
Authorization: Bearer <accessToken>
```

### 18.3 Key Request/Response Contracts (Missing Endpoints)

#### `POST /promotions/:id/redeem` (User auth)
```typescript
// Request: no body (user identified by JWT, location from UserLocation table)
// Optional body:
{ "latitude": number, "longitude": number }

// 200 Response:
{
  "success": true,
  "data": {
    "code": "LOCO-K7X9P2",
    "qrCodeBase64": "data:image/png;base64,...",
    "expiresAt": "2026-02-25T14:30:00Z",
    "promotion": { "id": "...", "title": "20% Off Coffee" }
  }
}

// 400: Already redeemed max times
// 400: Promotion expired or inactive
// 403: User not within radius
// 429: Rate limit exceeded
```

#### `POST /shops/redemptions/verify` (Shop auth)
```typescript
// Request:
{ "code": "LOCO-K7X9P2" }

// 200 Response:
{
  "success": true,
  "data": {
    "promotion": { "id": "...", "title": "20% Off Coffee" },
    "user": { "firstName": "Alex", "lastName": "J." },  // partial name only
    "redeemedAt": "2026-02-25T14:22:00Z",
    "discountValue": "20% OFF"
  }
}

// 400: Code already verified
// 400: Code expired (older than 10 minutes)
// 404: Code not found
// 403: Code belongs to a different shop's promotion
```

#### `POST /users/push-token` (User auth)
```typescript
// Request:
{ "token": "ExponentPushToken[xxxxxx]", "platform": "ios" | "android" }

// 200 Response:
{ "success": true, "data": { "registered": true } }
```

#### `GET /shops/analytics/overview` (Shop auth)
```typescript
// Query params: ?period=7d | 24h | 30d  (default: 7d)

// 200 Response:
{
  "success": true,
  "data": {
    "activePromotions": 3,
    "totalViews": { "24h": 45, "7d": 312, "30d": 1240 },
    "totalRedemptions": { "24h": 2, "7d": 18, "30d": 89 },
    "conversionRate7d": "5.8%",
    "topPromotion": {
      "id": "...",
      "title": "Happy Hour 50% Off",
      "views": 142,
      "redemptions": 11
    }
  }
}
```

---

*This document is the single authoritative architecture reference for the LoCo platform.*
*Update this document whenever a missing module is completed or a new architectural decision is made.*
