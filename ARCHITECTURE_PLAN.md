# Location-Based Promotions Platform - Architecture Plan

## Executive Summary

A mobile-first platform connecting shops with nearby customers through location-based promotions and real-time notifications.

## Core Use Cases

### Shop Dashboard
- McDonald's: "Free coffee with small fries" for users within 300m
- Shoe Store: "30% off all shoes for 24h" for users within 15km

### Customer App
- Receive location-based promotions
- Manage notification preferences
- Browse nearby offers

---

## 1. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├──────────────────────────┬──────────────────────────────────┤
│   Shop Dashboard (Web)   │   Customer App (Mobile Web/PWA)  │
│   - React + TypeScript   │   - React Native / PWA           │
│   - Vite                 │   - Native Location APIs         │
└──────────────┬───────────┴────────────────┬─────────────────┘
               │                            │
               └────────────┬───────────────┘
                            │
                    ┌───────▼──────┐
                    │   API Gateway │
                    │   (Express)   │
                    └───────┬──────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ Business│      │  Location │     │Notification│
    │ Logic   │      │  Service  │     │  Service  │
    │ Service │      │           │     │           │
    └────┬────┘      └─────┬─────┘     └─────┬─────┘
         │                 │                  │
         └─────────────┬───┴──────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │
              │   + PostGIS     │
              └─────────────────┘

         ┌────────────────────┐
         │   Redis Cache      │
         │   + Geo-indexing   │
         └────────────────────┘

         ┌────────────────────┐
         │   Message Queue    │
         │   (BullMQ/Redis)   │
         └────────────────────┘
```

---

## 2. RECOMMENDED TECH STACK

### Frontend - Shop Dashboard

**Framework**: React 18+ with TypeScript
- Modern, widely adopted
- Excellent ecosystem
- Strong typing for maintainability

**Build Tool**: Vite
- Fast development experience
- Optimized production builds
- Native ES modules

**UI Framework**:
- **Option A**: Tailwind CSS + shadcn/ui (Recommended)
  - Highly customizable
  - Modern design system
  - Excellent developer experience
- **Option B**: Material-UI (MUI)
  - Enterprise-ready components
  - Comprehensive out-of-the-box

**State Management**:
- React Query (TanStack Query) for server state
- Zustand for client state
- Context API for simple global state

**Form Handling**: React Hook Form + Zod
- Type-safe validation
- Performance optimized
- Excellent DX

**Maps**: Mapbox GL JS or Leaflet
- Interactive location selection
- Geofencing visualization
- Store location management

### Frontend - Customer App

**Framework**: Progressive Web App (PWA) with React
- Cross-platform (iOS, Android, Web)
- Single codebase
- Native-like experience
- Easy deployment

**Alternative**: React Native (if native features required)
- Better native integration
- Superior performance
- Access to native APIs
- Requires more setup

**Geolocation**:
- Web Geolocation API (for PWA)
- react-native-geolocation-service (for React Native)
- Background location tracking

**Notifications**:
- Web Push API + Service Workers (PWA)
- Firebase Cloud Messaging (FCM)
- OneSignal or Expo Notifications

### Backend

**Runtime**: Node.js 20+ LTS
- JavaScript/TypeScript consistency
- Excellent async performance
- Rich ecosystem

**Framework**: Express.js or Fastify
- **Express**: Mature, widely used, extensive middleware
- **Fastify**: Faster, modern, better TypeScript support (Recommended)

**Language**: TypeScript
- Type safety
- Better maintainability
- Improved developer experience

**Database**: PostgreSQL 15+ with PostGIS extension
- ACID compliance
- Powerful geospatial queries
- JSON support
- Proven scalability
- PostGIS for geo-indexing

**Caching**: Redis 7+
- Fast in-memory operations
- Geo-radius queries (GEORADIUS)
- Session management
- Rate limiting

**ORM**: Prisma or Drizzle
- **Prisma**: Excellent DX, migrations, type generation (Recommended)
- **Drizzle**: More SQL-like, better performance

**Authentication**:
- JWT tokens (access + refresh)
- OAuth 2.0 for social login
- Passport.js or better: jose library

**Notification System**:
- Firebase Cloud Messaging (FCM)
- Web Push Protocol
- BullMQ for job queuing

**File Storage**:
- AWS S3 or Cloudflare R2
- For shop logos, promotion images

### DevOps & Infrastructure

**Containerization**: Docker + Docker Compose
- Consistent environments
- Easy deployment
- Service isolation

**Hosting Options**:
- **Backend**: Railway, Render, or DigitalOcean App Platform
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Database**: Managed PostgreSQL (Supabase, Railway, or Neon)
- **Redis**: Upstash or Redis Cloud

**CI/CD**: GitHub Actions
- Automated testing
- Automated deployment
- Version control integration

**Monitoring**:
- Sentry for error tracking
- LogTail or Better Stack for logging
- Uptime monitoring

---

## 3. DATABASE SCHEMA

### Core Tables

```sql
-- Shops/Merchants
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  logo_url TEXT,
  description TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop Locations (physical stores)
CREATE TABLE shop_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shop_locations_coordinates ON shop_locations USING GIST(coordinates);

-- Promotions/Offers
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  terms_conditions TEXT,
  discount_type VARCHAR(50), -- 'percentage', 'fixed_amount', 'free_item', 'bogo'
  discount_value DECIMAL(10, 2),
  image_url TEXT,

  -- Targeting
  target_type VARCHAR(50) NOT NULL, -- 'all_locations', 'specific_locations'
  radius_meters INTEGER NOT NULL, -- e.g., 300 for 300m, 15000 for 15km

  -- Timing
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Usage limits
  max_redemptions_per_user INTEGER DEFAULT 1,
  max_total_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES shops(id)
);

CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_shop ON promotions(shop_id);

-- Junction table for promotions targeting specific locations
CREATE TABLE promotion_locations (
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  location_id UUID REFERENCES shop_locations(id) ON DELETE CASCADE,
  PRIMARY KEY (promotion_id, location_id)
);

-- Users/Customers
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash VARCHAR(255),
  avatar_url TEXT,

  -- Notification preferences
  push_notifications_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true,
  notification_radius_meters INTEGER DEFAULT 5000, -- default 5km

  -- Privacy
  location_sharing_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- User's last known location (for proximity matching)
CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
  accuracy_meters DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_locations_coordinates ON user_locations USING GIST(coordinates);
CREATE INDEX idx_user_locations_user ON user_locations(user_id);

-- User notification preferences per shop/category
CREATE TABLE user_shop_preferences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, shop_id)
);

-- Promotion views (analytics)
CREATE TABLE promotion_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP DEFAULT NOW(),
  user_distance_meters INTEGER
);

-- Promotion redemptions
CREATE TABLE promotion_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_location_id UUID REFERENCES shop_locations(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  redemption_code VARCHAR(50) UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP
);

CREATE INDEX idx_redemptions_promotion ON promotion_redemptions(promotion_id);
CREATE INDEX idx_redemptions_user ON promotion_redemptions(user_id);

-- Notification queue/log
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  notification_type VARCHAR(50), -- 'push', 'email', 'sms'
  status VARCHAR(50), -- 'pending', 'sent', 'failed', 'read'
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
```

### Key Design Decisions

1. **PostGIS Geography Type**: Uses SRID 4326 (WGS84) for accurate distance calculations
2. **UUID Primary Keys**: Better for distributed systems and privacy
3. **Soft Deletes**: `is_active` flags instead of hard deletes
4. **Denormalization**: `current_redemptions` for performance
5. **Flexible Promotion Targeting**: Supports all locations or specific ones
6. **User Privacy**: Separate preferences table, location sharing controls

---

## 4. API DESIGN

### RESTful API Endpoints

#### Shop Dashboard API

```
Authentication
POST   /api/auth/shop/register
POST   /api/auth/shop/login
POST   /api/auth/shop/refresh
POST   /api/auth/shop/logout

Shop Management
GET    /api/shops/me
PUT    /api/shops/me
PATCH  /api/shops/me/logo

Locations
GET    /api/shops/locations
POST   /api/shops/locations
GET    /api/shops/locations/:id
PUT    /api/shops/locations/:id
DELETE /api/shops/locations/:id

Promotions
GET    /api/shops/promotions
POST   /api/shops/promotions
GET    /api/shops/promotions/:id
PUT    /api/shops/promotions/:id
DELETE /api/shops/promotions/:id
PATCH  /api/shops/promotions/:id/toggle-active

Analytics
GET    /api/shops/analytics/overview
GET    /api/shops/analytics/promotions/:id
GET    /api/shops/analytics/redemptions

Redemption Verification
POST   /api/shops/redemptions/verify
GET    /api/shops/redemptions
```

#### Customer App API

```
Authentication
POST   /api/auth/user/register
POST   /api/auth/user/login
POST   /api/auth/user/refresh
POST   /api/auth/user/logout

User Profile
GET    /api/users/me
PUT    /api/users/me
PATCH  /api/users/me/preferences

Location
PUT    /api/users/location
GET    /api/users/nearby-shops

Promotions (Location-Based)
GET    /api/promotions/nearby
  Query params:
    - lat: number (required)
    - lng: number (required)
    - radius: number (optional, default user preference)
    - category: string (optional)

GET    /api/promotions/:id
POST   /api/promotions/:id/view
POST   /api/promotions/:id/redeem

Shop Preferences
GET    /api/users/shop-preferences
PUT    /api/users/shop-preferences/:shopId

Notifications
GET    /api/notifications
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id
```

### WebSocket Events (Real-Time)

```javascript
// Client subscribes to location-based updates
socket.on('connect', () => {
  socket.emit('subscribe:location', { lat, lng, radius });
});

// Server pushes new promotions
socket.on('promotion:new', (promotion) => {
  // Show notification to user
});

// Location updates
socket.emit('location:update', { lat, lng });
```

---

## 5. LOCATION SERVICES IMPLEMENTATION

### Client-Side Geolocation

#### PWA/Web Approach

```javascript
// Continuous location tracking with optimization
const watchLocation = () => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported');
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      // Update backend only if significant movement (>50m)
      if (hasMovedSignificantly(latitude, longitude)) {
        updateUserLocation({ latitude, longitude, accuracy });
      }
    },
    (error) => handleLocationError(error),
    {
      enableHighAccuracy: true,
      maximumAge: 30000, // 30 seconds
      timeout: 27000
    }
  );

  return watchId;
};
```

#### Background Location Tracking

For PWA, use Service Workers:

```javascript
// service-worker.js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-location') {
    event.waitUntil(updateLocation());
  }
});
```

### Server-Side Geospatial Queries

#### Finding Nearby Promotions (PostgreSQL + PostGIS)

```sql
-- Find all active promotions within user's radius
SELECT
  p.*,
  s.name as shop_name,
  s.logo_url as shop_logo,
  sl.name as location_name,
  sl.address,
  ST_Distance(
    sl.coordinates::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  ) as distance_meters
FROM promotions p
JOIN shops s ON p.shop_id = s.id
JOIN promotion_locations pl ON p.id = pl.promotion_id
JOIN shop_locations sl ON pl.location_id = sl.id
WHERE
  p.is_active = true
  AND p.start_date <= NOW()
  AND p.end_date >= NOW()
  AND ST_DWithin(
    sl.coordinates::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    p.radius_meters
  )
ORDER BY distance_meters ASC
LIMIT 50;
```

#### Redis Geo-Caching

Cache shop locations for fast proximity lookups:

```javascript
// Cache shop locations in Redis
await redis.geoadd(
  'shop:locations',
  longitude,
  latitude,
  locationId
);

// Query nearby locations
const nearbyLocations = await redis.georadius(
  'shop:locations',
  userLongitude,
  userLatitude,
  radius,
  'km',
  'WITHDIST',
  'ASC'
);
```

### Geofencing Strategy

```javascript
// Backend service to match users with new promotions
class GeofenceService {
  async checkProximityForNewPromotion(promotionId) {
    const promotion = await getPromotion(promotionId);

    // Find all users within the promotion's radius
    const nearbyUsers = await db.query(`
      SELECT u.id, u.push_token,
             ST_Distance(ul.coordinates, $1) as distance
      FROM users u
      JOIN user_locations ul ON u.id = ul.user_id
      WHERE
        u.push_notifications_enabled = true
        AND u.location_sharing_enabled = true
        AND ST_DWithin(ul.coordinates, $1, $2)
    `, [promotionLocation, promotion.radius_meters]);

    // Queue notifications
    await notificationQueue.addBulk(
      nearbyUsers.map(user => ({
        userId: user.id,
        promotionId: promotion.id,
        type: 'new_promotion_nearby'
      }))
    );
  }
}
```

---

## 6. NOTIFICATION SYSTEM

### Push Notification Architecture

```
┌─────────────┐
│   Backend   │
│   Service   │
└──────┬──────┘
       │
       │ Enqueue notification jobs
       ▼
┌─────────────┐
│   BullMQ    │
│   Queue     │
└──────┬──────┘
       │
       │ Process jobs with retry
       ▼
┌─────────────────────┐
│ Notification Worker │
└──────┬──────────────┘
       │
       ├─► Firebase Cloud Messaging (FCM)
       │   └─► Android/iOS Push
       │
       ├─► Web Push API
       │   └─► PWA Notifications
       │
       └─► Email Service (SendGrid/Resend)
           └─► Email Notifications
```

### Implementation

#### 1. Service Worker (PWA)

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register('/sw.js');

  // Request notification permission
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY
    });

    // Send subscription to backend
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    });
  }
}
```

#### 2. Backend Notification Service

```typescript
// notification.service.ts
import admin from 'firebase-admin';
import webpush from 'web-push';
import { Queue } from 'bullmq';

class NotificationService {
  private notificationQueue: Queue;

  constructor() {
    this.notificationQueue = new Queue('notifications', {
      connection: redisConnection
    });

    // Initialize Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // Initialize Web Push
    webpush.setVapidDetails(
      'mailto:your@email.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
  }

  async sendPromotionNotification(userId: string, promotionId: string) {
    // Add to queue for processing
    await this.notificationQueue.add('promotion-notification', {
      userId,
      promotionId,
      timestamp: Date.now()
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }

  async processNotification(job: Job) {
    const { userId, promotionId } = job.data;

    const user = await getUser(userId);
    const promotion = await getPromotion(promotionId);

    // Send to FCM for mobile
    if (user.fcmToken) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: promotion.title,
          body: promotion.description,
          imageUrl: promotion.image_url
        },
        data: {
          promotionId: promotion.id,
          type: 'new_promotion'
        }
      });
    }

    // Send Web Push for PWA
    if (user.webPushSubscription) {
      await webpush.sendNotification(
        user.webPushSubscription,
        JSON.stringify({
          title: promotion.title,
          body: promotion.description,
          icon: promotion.image_url,
          data: { promotionId: promotion.id }
        })
      );
    }

    // Log notification
    await db.notifications.create({
      userId,
      promotionId,
      status: 'sent',
      sentAt: new Date()
    });
  }
}
```

### Notification Triggers

1. **Location-Based**: User enters promotion geofence
2. **Time-Based**: New promotion created (batch to nearby users)
3. **Event-Based**:
   - Promotion ending soon (24h warning)
   - Limited redemptions remaining
   - Favorite shop new promotion

### User Preferences

```typescript
interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  radius: number; // meters
  categories: string[]; // ['food', 'retail', 'entertainment']
  mutedShops: string[]; // shop IDs
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  frequency: 'realtime' | 'digest_daily' | 'digest_weekly';
}
```

---

## 7. SECURITY CONSIDERATIONS

### Authentication & Authorization

1. **JWT Tokens**
   - Access token (15 min expiry)
   - Refresh token (7 days expiry)
   - HTTP-only cookies for web
   - Secure token storage on mobile

2. **Password Requirements**
   - Minimum 8 characters
   - bcrypt hashing (cost factor 12)
   - Rate limiting on login attempts

3. **API Security**
   - CORS configuration
   - Rate limiting (express-rate-limit)
   - Input validation (Zod)
   - SQL injection prevention (parameterized queries)
   - XSS protection (helmet.js)

### Privacy Considerations

1. **Location Data**
   - User consent required
   - Configurable tracking precision
   - Automatic data expiration (7 days)
   - No location history storage beyond necessary
   - GDPR compliance

2. **User Data**
   - Minimal data collection
   - Right to deletion
   - Data export capability
   - Encrypted at rest
   - Anonymized analytics

### Location Privacy

```typescript
// Fuzzy location for privacy
function fuzzyLocation(lat: number, lng: number, precision: number = 100) {
  // Round to nearest 100 meters for privacy
  const factor = 1 / (precision / 111320); // degrees per meter
  return {
    lat: Math.round(lat / factor) * factor,
    lng: Math.round(lng / factor) * factor
  };
}
```

---

## 8. PERFORMANCE OPTIMIZATION

### Caching Strategy

```typescript
// Multi-layer caching
class CacheService {
  // 1. In-memory cache (fastest)
  private memoryCache = new Map();

  // 2. Redis cache (fast, shared)
  private redis: Redis;

  // 3. Database (slowest)

  async getNearbyPromotions(lat: number, lng: number, radius: number) {
    const cacheKey = `promotions:${lat.toFixed(2)}:${lng.toFixed(2)}:${radius}`;

    // Check memory
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey);
    }

    // Check Redis
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      this.memoryCache.set(cacheKey, data);
      return data;
    }

    // Query database
    const promotions = await db.getNearbyPromotions(lat, lng, radius);

    // Cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(promotions));
    this.memoryCache.set(cacheKey, promotions);

    return promotions;
  }
}
```

### Database Optimization

1. **Indexes**
   - Geospatial indexes (GIST) on coordinates
   - Composite indexes on frequently queried columns
   - Partial indexes for active promotions

2. **Query Optimization**
   - Use `EXPLAIN ANALYZE` for query planning
   - Limit result sets
   - Paginate large datasets
   - Use database connection pooling

3. **Read Replicas**
   - Separate read/write databases
   - Route analytics queries to replicas

### Frontend Performance

1. **Code Splitting**
   - Route-based splitting
   - Lazy load heavy components
   - Dynamic imports

2. **Image Optimization**
   - WebP format with fallbacks
   - Responsive images
   - CDN delivery
   - Lazy loading

3. **PWA Optimization**
   - Service worker caching
   - Offline functionality
   - App shell architecture
   - Precache critical assets

---

## 9. ANALYTICS & METRICS

### Key Metrics to Track

#### Shop Dashboard

```typescript
interface ShopAnalytics {
  promotions: {
    totalViews: number;
    uniqueViews: number;
    totalRedemptions: number;
    conversionRate: number; // redemptions / views
    avgDistanceOfViewers: number;
    peakViewTimes: TimeDistribution;
  };

  locations: {
    performanceByLocation: LocationMetrics[];
    footTraffic: number; // users who came within radius
  };

  revenue: {
    estimatedImpact: number;
    costPerRedemption: number;
  };
}
```

#### Platform Analytics

```typescript
interface PlatformMetrics {
  users: {
    totalActive: number;
    newSignups: number;
    retention: RetentionCohorts;
    avgSessionDuration: number;
  };

  promotions: {
    totalActive: number;
    avgViewsPerPromotion: number;
    avgRedemptionRate: number;
    popularCategories: CategoryStats[];
  };

  geography: {
    activeRegions: RegionStats[];
    coverageHeatmap: HeatmapData;
  };
}
```

### Implementation

```typescript
// Analytics service using ClickHouse or TimescaleDB
class AnalyticsService {
  async trackPromotionView(data: {
    promotionId: string;
    userId: string;
    distance: number;
    timestamp: Date;
  }) {
    // Fast write to analytics database
    await analyticsDB.insert('promotion_views', data);

    // Update counters in Redis
    await redis.hincrby(`promotion:${data.promotionId}`, 'views', 1);
  }

  async getPromotionAnalytics(promotionId: string, timeRange: TimeRange) {
    return {
      views: await this.getViewMetrics(promotionId, timeRange),
      redemptions: await this.getRedemptionMetrics(promotionId, timeRange),
      demographics: await this.getDemographics(promotionId, timeRange)
    };
  }
}
```

---

## 10. MOBILE CONSIDERATIONS

### Progressive Web App (PWA) Requirements

```json
// manifest.json
{
  "name": "PromoNear",
  "short_name": "PromoNear",
  "description": "Discover nearby promotions",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Nearby Offers",
      "url": "/nearby",
      "icons": [{ "src": "/icons/nearby.png", "sizes": "96x96" }]
    }
  ],
  "categories": ["shopping", "lifestyle"],
  "permissions": ["geolocation", "notifications"]
}
```

### Offline Functionality

```javascript
// Service worker cache strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return cached response
      if (response) {
        return response;
      }

      // Network with cache fallback
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open('dynamic-v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Return offline page if network fails
        return caches.match('/offline.html');
      });
    })
  );
});
```

### Battery & Data Optimization

```javascript
// Adaptive location tracking based on battery
const getBatteryStatus = async () => {
  const battery = await navigator.getBattery();
  return {
    level: battery.level,
    charging: battery.charging
  };
};

const getLocationUpdateInterval = async () => {
  const battery = await getBatteryStatus();

  if (battery.charging) {
    return 30000; // 30 seconds when charging
  } else if (battery.level > 0.5) {
    return 60000; // 1 minute with good battery
  } else if (battery.level > 0.2) {
    return 300000; // 5 minutes with medium battery
  } else {
    return 600000; // 10 minutes with low battery
  }
};
```

---

## 11. TESTING STRATEGY

### Backend Testing

```typescript
// Unit tests
describe('GeoService', () => {
  it('should calculate distance correctly', () => {
    const distance = geoService.calculateDistance(
      { lat: 40.7128, lng: -74.0060 }, // NYC
      { lat: 34.0522, lng: -118.2437 }  // LA
    );
    expect(distance).toBeCloseTo(3936000, -3); // ~3936km
  });

  it('should find promotions within radius', async () => {
    const promotions = await promotionService.getNearbyPromotions({
      lat: 40.7128,
      lng: -74.0060,
      radius: 1000
    });

    promotions.forEach(promo => {
      expect(promo.distance).toBeLessThan(1000);
    });
  });
});

// Integration tests
describe('Promotion API', () => {
  it('should create promotion and notify nearby users', async () => {
    const promotion = await createTestPromotion();
    const notifications = await waitForNotifications();

    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].promotionId).toBe(promotion.id);
  });
});
```

### E2E Testing

```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test('user receives notification for nearby promotion', async ({ page, context }) => {
  // Mock geolocation
  await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
  await context.grantPermissions(['geolocation', 'notifications']);

  await page.goto('/');
  await page.click('[data-testid="enable-notifications"]');

  // Create promotion via admin panel
  await createPromotion({
    location: { lat: 40.7130, lng: -74.0062 }, // 20m away
    radius: 100
  });

  // Check notification received
  await expect(page.locator('[data-testid="notification"]')).toBeVisible();
});
```

---

## 12. DEPLOYMENT ARCHITECTURE

### Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: promo_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/promo_app
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  shop-dashboard:
    build: ./shop-dashboard
    ports:
      - "4000:80"
    depends_on:
      - backend

  customer-app:
    build: ./customer-app
    ports:
      - "4001:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

### Environment Variables

```bash
# .env.example
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=promo_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Firebase
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Web Push
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_MAILTO=mailto:your@email.com

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Email
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourapp.com

# Frontend URLs
SHOP_DASHBOARD_URL=https://dashboard.yourapp.com
CUSTOMER_APP_URL=https://app.yourapp.com

# API
API_PORT=3000
API_RATE_LIMIT=100
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 13. COST ESTIMATION

### Monthly Costs (Estimated for 10K active users)

| Service | Provider | Cost |
|---------|----------|------|
| Database (PostgreSQL) | Railway/Supabase | $15-25 |
| Redis Cache | Upstash | $10-20 |
| Backend Hosting | Railway/Render | $20-50 |
| Frontend Hosting | Vercel | $0-20 |
| Object Storage (S3) | AWS/Cloudflare R2 | $5-15 |
| Push Notifications (FCM) | Firebase | Free-$10 |
| Email Service | Resend/SendGrid | $10-20 |
| Monitoring (Sentry) | Sentry | $0-26 |
| Maps API | Mapbox | $0-50 |
| **Total** | | **$70-236/month** |

### Scaling Costs (100K users)

- Database: $50-100
- Redis: $30-60
- Backend: $100-200
- Storage: $20-50
- Notifications: $20-100
- **Total: $250-600/month**

---

## 14. IMPLEMENTATION PHASES

### Phase 1: MVP (4-6 weeks)

**Backend**
- [ ] Project setup (Node.js + TypeScript + Fastify)
- [ ] Database schema + migrations (PostgreSQL + PostGIS)
- [ ] Authentication (JWT for shops and users)
- [ ] Core API endpoints
  - [ ] Shop registration/login
  - [ ] Location management
  - [ ] Promotion CRUD
  - [ ] User registration/login
  - [ ] Nearby promotions query
- [ ] Basic geospatial queries

**Shop Dashboard**
- [ ] Project setup (React + TypeScript + Vite)
- [ ] Authentication pages
- [ ] Shop profile management
- [ ] Location management (with map picker)
- [ ] Promotion creation form
  - [ ] Basic fields (title, description, dates)
  - [ ] Location targeting
  - [ ] Radius selection
- [ ] Active promotions list

**Customer App**
- [ ] Project setup (React PWA)
- [ ] Authentication
- [ ] Location permission flow
- [ ] Nearby promotions list
- [ ] Promotion detail view
- [ ] Basic user preferences

**DevOps**
- [ ] Docker setup
- [ ] Development environment
- [ ] Deployment to staging

### Phase 2: Core Features (3-4 weeks)

**Backend**
- [ ] Redis caching layer
- [ ] Push notification service (FCM)
- [ ] Promotion analytics
- [ ] Redemption system
- [ ] User location tracking
- [ ] BullMQ job queue

**Shop Dashboard**
- [ ] Analytics dashboard
  - [ ] Views/redemptions charts
  - [ ] Geographic distribution
  - [ ] Performance metrics
- [ ] Redemption verification
- [ ] Promotion templates
- [ ] Image upload (S3)

**Customer App**
- [ ] Push notifications
- [ ] Service worker + PWA manifest
- [ ] Notification preferences
- [ ] Shop blocking/muting
- [ ] Promotion redemption flow
- [ ] Favorites/saved promotions

### Phase 3: Enhanced Features (3-4 weeks)

**Backend**
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] A/B testing framework
- [ ] Fraud detection
- [ ] API rate limiting
- [ ] Webhook system

**Shop Dashboard**
- [ ] Multi-user accounts (team management)
- [ ] Advanced scheduling
- [ ] Promotion templates
- [ ] Export analytics
- [ ] Notification history

**Customer App**
- [ ] Map view of promotions
- [ ] Category filtering
- [ ] Search functionality
- [ ] Social sharing
- [ ] Promotion reminders
- [ ] Wallet/saved offers

### Phase 4: Polish & Scale (2-3 weeks)

- [ ] Performance optimization
- [ ] Load testing
- [ ] Security audit
- [ ] E2E testing
- [ ] Documentation
- [ ] Beta testing
- [ ] Production deployment
- [ ] Monitoring setup

---

## 15. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Battery drain from location tracking** | High | Adaptive intervals, battery-aware logic |
| **Privacy concerns** | High | Transparent policies, user controls, minimal data |
| **Notification fatigue** | Medium | Smart throttling, user preferences, ML filtering |
| **Location accuracy** | Medium | Use high-accuracy mode, validation, fallbacks |
| **Scale issues** | Medium | Redis caching, DB optimization, CDN |
| **Abuse/spam** | Medium | Rate limiting, moderation, reporting |
| **Competition** | Low | Focus on UX, local merchants, fair pricing |

---

## 16. SUCCESS METRICS

### User Metrics
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- User retention (D1, D7, D30)
- Avg. session duration
- Location permission grant rate
- Notification opt-in rate

### Business Metrics
- Number of active shops
- Promotions created per shop
- Avg. redemption rate
- User-to-shop engagement ratio
- Revenue per shop
- Customer acquisition cost

### Technical Metrics
- API response time (p50, p95, p99)
- Database query performance
- Push notification delivery rate
- App crash rate
- PWA install rate
- Offline usage rate

---

## 17. FUTURE ENHANCEMENTS

### Phase 5+ Ideas

1. **Machine Learning**
   - Personalized promotion recommendations
   - Optimal notification timing
   - Fraud detection
   - Demand prediction

2. **Advanced Features**
   - Loyalty programs
   - Referral system
   - In-app payments
   - QR code redemption
   - Augmented reality promotions

3. **Platform Expansion**
   - Native iOS/Android apps
   - Merchant POS integration
   - API for third-party apps
   - Widget for shop websites

4. **Analytics**
   - Foot traffic attribution
   - ROI calculator
   - Competitive insights
   - Heatmap visualizations

5. **Integrations**
   - Social media (share deals)
   - Calendar (reminder integration)
   - Apple Wallet / Google Pay
   - CRM systems (Salesforce, HubSpot)

---

## CONCLUSION

This architecture provides a solid foundation for a scalable, modern location-based promotions platform. The tech stack prioritizes:

- **Developer Experience**: TypeScript, modern frameworks, excellent tooling
- **Performance**: Redis caching, optimized queries, CDN delivery
- **Scalability**: Horizontal scaling, queue-based processing, microservices-ready
- **User Privacy**: Transparent tracking, user controls, minimal data retention
- **Mobile-First**: PWA for cross-platform reach, native-like experience

The platform is designed to start simple (MVP) and scale to millions of users with the right architectural decisions in place from day one.

**Recommended Next Steps:**
1. Review and approve architecture
2. Set up development environment
3. Initialize projects (backend, shop-dashboard, customer-app)
4. Create detailed sprint plans
5. Begin Phase 1 implementation

