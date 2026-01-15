# Discovery Mode - Feature Specification

## Overview

Discovery Mode allows users to explore nearby businesses and their offers while maintaining control over notification volume. Businesses can create special "discovery offers" to attract new customers, while the system prevents abuse through intelligent tracking and limits.

---

## 1. User Discovery Mode

### 1.1 Discovery Mode States

```typescript
enum DiscoveryModeState {
  OFF = 'off',                    // No discovery notifications
  ACTIVE = 'active',              // Real-time notifications for all nearby shops
  SILENT = 'silent',              // No notifications, but offers are logged for later review
  SMART = 'smart'                 // AI-powered: Only high-relevance notifications, rest are silent
}
```

### 1.2 User Experience

#### Active Discovery Mode
```
User enables "Active Discovery"
  ↓
User walks/drives around city
  ↓
User passes Shop A (within 500m)
  ↓
Push notification: "🔍 Discovery: Shop A has 30% off for new visitors!"
  ↓
User can:
  - View offer details
  - Add shop to favorites (starts receiving all future offers)
  - Dismiss (still counts as exposure)
  - Redeem immediately
```

#### Silent Discovery Mode
```
User enables "Silent Discovery"
  ↓
User walks/drives around city
  ↓
User passes Shops A, B, C, D (no interruptions)
  ↓
Offers are silently logged
  ↓
Later, user opens app
  ↓
"Discovery Feed" shows: "You discovered 4 new shops today"
  ↓
User browses offers at their leisure
  ↓
User adds shops they're interested in
```

#### Smart Discovery Mode (Phase 2)
```
User enables "Smart Discovery"
  ↓
System uses ML to determine relevance
  ↓
High-relevance offers → Push notification
Low-relevance offers → Silent log
  ↓
Example factors:
  - User's favorite categories
  - Time of day (coffee in morning, dinner in evening)
  - User's typical spending patterns
  - Distance from user
```

### 1.3 Discovery Feed

**Location**: Home tab → "Discovery" section

**Features:**
- Shows all discovered shops (last 7 days)
- Grouped by: Today, Yesterday, This Week
- Sorted by: Distance, Offer value, Relevance
- Each card shows:
  - Shop name and logo
  - Distance when discovered
  - Discovery offer details
  - "Add Shop" CTA button
  - "View Details" button
  - "Not Interested" option

**Filtering:**
- By category
- By distance
- By offer type
- By date discovered

---

## 2. Business Discovery Offers

### 2.1 Discovery Offer Creation

Businesses can create special offers specifically for users in discovery mode.

**Discovery Offer Fields:**

```typescript
interface DiscoveryOffer {
  // Standard promotion fields
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_item' | 'bogo';
  discountValue: number;

  // Discovery-specific fields
  isDiscoveryOffer: boolean;              // Flag as discovery offer
  discoveryBoost: number;                 // % better than regular offer (e.g., 25% → 30%)
  maxDiscoveryExposures: number;          // Max times a user can see this (default: 5)
  discoveryDuration: number;              // Days offer valid (typically longer, e.g., 30 days)
  autoConvertAfterExposures: boolean;     // After max exposures, show regular offer instead

  // Targeting
  discoveryModeOnly: boolean;             // Only visible to discovery users
  targetNewUsersOnly: boolean;            // Only users who've never engaged with this shop
}
```

**Example Use Cases:**

```typescript
// Example 1: Coffee Shop - New Customer Special
{
  title: "Welcome! Free Pastry with Any Coffee",
  isDiscoveryOffer: true,
  discoveryBoost: 100,  // Regular users get 10% off, discovery gets free pastry
  maxDiscoveryExposures: 3,
  discoveryDuration: 30,
  discoveryModeOnly: true
}

// Example 2: Restaurant - First-Time Visitor Discount
{
  title: "30% Off Your First Visit",
  isDiscoveryOffer: true,
  discoveryBoost: 50,  // Regular: 20% off, Discovery: 30% off
  maxDiscoveryExposures: 5,
  discoveryDuration: 60,
  autoConvertAfterExposures: true  // After 5 views, show regular 20% offer
}

// Example 3: Gym - Long-Term Discovery Offer
{
  title: "Try Us Free for 7 Days",
  isDiscoveryOffer: true,
  maxDiscoveryExposures: 10,  // Multiple exposures OK (commute route)
  discoveryDuration: 90,
  targetNewUsersOnly: true
}
```

### 2.2 Discovery Offer Dashboard

**New Section in Merchant Dashboard:**

- "Discovery Performance" tab
- Metrics:
  - Discovery impressions (users who saw offer)
  - Discovery engagement rate (clicked to view details)
  - Add-to-favorites rate (% who added shop)
  - Discovery redemption rate
  - Cost per acquisition (discovery offer value vs. regular customers)
- Comparison: Discovery users vs. Regular users
- Insights: "Users typically add your shop after 3 exposures"

---

## 3. Anti-Abuse System

### 3.1 Discovery Exposure Tracking

**Database Schema Addition:**

```sql
CREATE TABLE discovery_exposures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,

  -- Exposure tracking
  exposure_count INTEGER DEFAULT 1,
  first_exposure_at TIMESTAMP DEFAULT NOW(),
  last_exposure_at TIMESTAMP DEFAULT NOW(),

  -- Engagement tracking
  total_views INTEGER DEFAULT 0,          -- Times user clicked to view details
  total_dismissals INTEGER DEFAULT 0,     -- Times user dismissed notification
  total_not_interested INTEGER DEFAULT 0, -- Times user marked "not interested"

  -- Status
  status VARCHAR(50) DEFAULT 'active',    -- 'active', 'grace_period', 'exhausted', 'converted'
  grace_period_started_at TIMESTAMP,
  exhausted_at TIMESTAMP,
  converted_at TIMESTAMP,                 -- When user added shop to favorites

  -- Redemption
  redeemed_during_discovery BOOLEAN DEFAULT false,
  redemption_at TIMESTAMP,

  -- Metadata
  user_coordinates GEOGRAPHY(POINT, 4326), -- Where user was during exposure
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, shop_id)
);

CREATE INDEX idx_discovery_exposures_user ON discovery_exposures(user_id);
CREATE INDEX idx_discovery_exposures_shop ON discovery_exposures(shop_id);
CREATE INDEX idx_discovery_exposures_status ON discovery_exposures(status);
```

### 3.2 Tiered Exposure System

**The system uses a progressive approach to prevent abuse while allowing legitimate discovery:**

```typescript
interface ExposureTier {
  tier: number;
  exposureRange: [number, number];  // [min, max] exposures
  offerMultiplier: number;          // % of original discovery offer
  notificationBehavior: 'immediate' | 'delayed' | 'silent' | 'none';
  ctaMessage: string;
}

const EXPOSURE_TIERS: ExposureTier[] = [
  {
    tier: 1,
    exposureRange: [1, 3],
    offerMultiplier: 1.0,           // 100% - Full discovery offer
    notificationBehavior: 'immediate',
    ctaMessage: "Add shop to see all future offers"
  },
  {
    tier: 2,
    exposureRange: [4, 7],
    offerMultiplier: 0.85,          // 85% - Slightly reduced
    notificationBehavior: 'delayed', // 5-minute delay before notification
    ctaMessage: "Add this shop to your favorites to keep seeing offers"
  },
  {
    tier: 3,
    exposureRange: [8, 12],
    offerMultiplier: 0.7,           // 70% - Noticeably reduced
    notificationBehavior: 'silent',  // No notification, only in feed
    ctaMessage: "Add now or you'll miss future offers from this shop"
  },
  {
    tier: 4,                        // Grace period
    exposureRange: [13, 15],
    offerMultiplier: 0.5,           // 50% - Standard offer level
    notificationBehavior: 'none',    // Not shown at all
    ctaMessage: "Last chance to add this shop"
  },
  {
    tier: 5,                        // Exhausted
    exposureRange: [16, Infinity],
    offerMultiplier: 0,             // 0% - No discovery offers
    notificationBehavior: 'none',
    ctaMessage: "Add shop to see their offers"
  }
];
```

### 3.3 Exposure Rules & Logic

**Rule 1: Exposure Counting**

```typescript
function shouldCountExposure(
  user: User,
  shop: Shop,
  interaction: 'notification' | 'view' | 'dismiss' | 'not_interested'
): boolean {
  // Notification shown: Always counts
  if (interaction === 'notification') return true;

  // User viewed details: Always counts
  if (interaction === 'view') return true;

  // User dismissed: Counts
  if (interaction === 'dismiss') return true;

  // User marked not interested: Counts double (user_not_interested += 2)
  if (interaction === 'not_interested') return true;

  return false;
}
```

**Rule 2: Time-Based Reset**

```typescript
interface ExposureResetRules {
  fullReset: {
    after: number;        // days
    condition: string;
  };
  partialReset: {
    after: number;        // days
    reduction: number;    // % reduction in exposure count
  };
}

const RESET_RULES: ExposureResetRules = {
  fullReset: {
    after: 180,  // 6 months
    condition: "User hasn't seen shop in 6 months → Full reset to 0 exposures"
  },
  partialReset: {
    after: 90,   // 3 months
    reduction: 50, // Reduce exposure count by 50%
    // Example: User had 8 exposures, after 3 months → 4 exposures
  }
};

// Example implementation
async function getEffectiveExposureCount(userId: string, shopId: string): Promise<number> {
  const record = await db.discoveryExposures.findUnique({
    where: { userId_shopId: { userId, shopId } }
  });

  if (!record) return 0;

  const daysSinceLastExposure = daysSince(record.lastExposureAt);

  // Full reset after 6 months
  if (daysSinceLastExposure >= 180) {
    await db.discoveryExposures.update({
      where: { id: record.id },
      data: { exposureCount: 0, status: 'active' }
    });
    return 0;
  }

  // Partial reset after 3 months
  if (daysSinceLastExposure >= 90) {
    const reducedCount = Math.floor(record.exposureCount * 0.5);
    await db.discoveryExposures.update({
      where: { id: record.id },
      data: { exposureCount: reducedCount }
    });
    return reducedCount;
  }

  return record.exposureCount;
}
```

**Rule 3: Geographic Pattern Detection**

```typescript
enum UserShopRelationship {
  ONE_TIME_VISITOR = 'one_time_visitor',     // Passed shop once or twice
  FREQUENT_PASSER = 'frequent_passer',       // Passes shop regularly (commute)
  NEIGHBORHOOD = 'neighborhood',              // Shop is near user's home
  OCCASIONAL = 'occasional'                   // Visits area occasionally
}

async function detectRelationship(
  userId: string,
  shopId: string
): Promise<UserShopRelationship> {
  const exposures = await db.discoveryExposures.findMany({
    where: { userId, shopId },
    orderBy: { lastExposureAt: 'desc' },
    take: 30  // Last 30 exposures
  });

  if (exposures.length === 0) return UserShopRelationship.ONE_TIME_VISITOR;

  // Calculate frequency
  const daysSinceFirst = daysSince(exposures[0].firstExposureAt);
  const frequency = exposures.length / Math.max(daysSinceFirst, 1);

  // Frequent passer: Sees shop 3+ times per week
  if (frequency >= 0.4) {  // ~3 times/week
    return UserShopRelationship.FREQUENT_PASSER;
  }

  // Neighborhood: Shop within 2km of user's home (if we have home location)
  const userHome = await getUserHomeLocation(userId);
  const shop = await getShopLocation(shopId);
  if (userHome && calculateDistance(userHome, shop) < 2000) {
    return UserShopRelationship.NEIGHBORHOOD;
  }

  // Occasional: Sees shop monthly
  if (frequency >= 0.13) {  // ~1 time/week
    return UserShopRelationship.OCCASIONAL;
  }

  return UserShopRelationship.ONE_TIME_VISITOR;
}

// Adjust exposure limits based on relationship
function getMaxExposures(relationship: UserShopRelationship): number {
  switch (relationship) {
    case UserShopRelationship.FREQUENT_PASSER:
      return 20;  // More exposures for commuters (need time to decide)
    case UserShopRelationship.NEIGHBORHOOD:
      return 15;  // More exposures for neighbors
    case UserShopRelationship.OCCASIONAL:
      return 10;  // Standard exposures
    case UserShopRelationship.ONE_TIME_VISITOR:
      return 5;   // Fewer exposures, likely not interested
    default:
      return 10;
  }
}
```

**Rule 4: Engagement-Based Adjustment**

```typescript
function calculateEngagementScore(exposure: DiscoveryExposure): number {
  let score = 0;

  // Positive signals
  if (exposure.totalViews > 0) score += 2 * exposure.totalViews;
  if (exposure.redeemedDuringDiscovery) score += 10;

  // Negative signals
  if (exposure.totalDismissals > 0) score -= 1 * exposure.totalDismissals;
  if (exposure.totalNotInterested > 0) score -= 5 * exposure.totalNotInterested;

  return score;
}

function adjustExposureLimit(
  baseLimit: number,
  engagementScore: number
): number {
  // High engagement: Increase limit by 50%
  if (engagementScore >= 10) {
    return Math.floor(baseLimit * 1.5);
  }

  // Low engagement: Decrease limit by 30%
  if (engagementScore <= -5) {
    return Math.floor(baseLimit * 0.7);
  }

  return baseLimit;
}
```

### 3.4 Special Cases

**Case 1: User Redeems During Discovery**

```typescript
async function handleDiscoveryRedemption(
  userId: string,
  shopId: string,
  promotionId: string
) {
  // Mark exposure as redeemed
  await db.discoveryExposures.update({
    where: { userId_shopId: { userId, shopId } },
    data: {
      redeemedDuringDiscovery: true,
      redemptionAt: new Date(),
      status: 'converted'
    }
  });

  // Automatically add shop to user's favorites
  await db.userShopPreferences.create({
    data: {
      userId,
      shopId,
      notificationsEnabled: true,
      addedVia: 'discovery_redemption'
    }
  });

  // User now gets all future offers from this shop
  // No more discovery offers needed
}
```

**Case 2: User Manually Adds Shop**

```typescript
async function handleShopAdd(userId: string, shopId: string) {
  // Update exposure record
  await db.discoveryExposures.update({
    where: { userId_shopId: { userId, shopId } },
    data: {
      status: 'converted',
      convertedAt: new Date()
    }
  });

  // Create preference record
  await db.userShopPreferences.create({
    data: {
      userId,
      shopId,
      notificationsEnabled: true,
      addedVia: 'discovery_mode'
    }
  });
}
```

**Case 3: User Removes Then Re-Adds Shop**

```typescript
async function handleShopRemoval(userId: string, shopId: string) {
  // Don't delete exposure record, just update preference
  await db.userShopPreferences.delete({
    where: { userId_shopId: { userId, shopId } }
  });

  // Keep exposure history
  // If user re-adds later, they won't get discovery offers again
  // (exposure count is preserved)
}

// If user tries to re-add:
async function canUserReAddShop(userId: string, shopId: string): Promise<boolean> {
  const preference = await db.userShopPreferences.findUnique({
    where: { userId_shopId: { userId, shopId } },
    include: { history: true }
  });

  // Check removal history
  const removals = preference?.history.filter(h => h.action === 'removed') || [];

  // Limit: Max 3 removal/re-add cycles
  if (removals.length >= 3) {
    return false;  // No more discovery offers
  }

  return true;
}
```

**Case 4: User Marks "Not Interested"**

```typescript
async function handleNotInterested(userId: string, shopId: string) {
  await db.discoveryExposures.update({
    where: { userId_shopId: { userId, shopId } },
    data: {
      totalNotInterested: { increment: 1 },
      status: 'exhausted',
      exhaustedAt: new Date()
    }
  });

  // Add to user's blocked shops
  await db.userBlockedShops.create({
    data: {
      userId,
      shopId,
      reason: 'not_interested_discovery',
      blockedAt: new Date()
    }
  });

  // User won't see any offers from this shop anymore
  // Can manually unblock in settings
}
```

**Case 5: Multi-Location Shops**

```typescript
async function getShopExposureCount(
  userId: string,
  shopId: string,
  locationId?: string
): Promise<number> {
  // For chain stores, count exposures per shop, not per location
  // This prevents users from exploiting by visiting different locations

  const totalExposures = await db.discoveryExposures.aggregate({
    where: { userId, shopId },
    _sum: { exposureCount: true }
  });

  return totalExposures._sum.exposureCount || 0;
}

// Special rule: If user adds one location, they get all locations
async function handleChainShopAdd(userId: string, shopId: string) {
  // Get all locations for this shop
  const locations = await db.shopLocations.findMany({
    where: { shopId }
  });

  // Add preference for the parent shop
  await db.userShopPreferences.create({
    data: {
      userId,
      shopId,
      notificationsEnabled: true,
      includesAllLocations: true
    }
  });

  // User now gets offers from ALL locations
}
```

**Case 6: Suspected Abuse Detection**

```typescript
interface AbuseSignal {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

async function detectAbusePatterns(userId: string): Promise<AbuseSignal[]> {
  const signals: AbuseSignal[] = [];

  // Signal 1: Too many discovery exposures in short time
  const recentExposures = await db.discoveryExposures.count({
    where: {
      userId,
      lastExposureAt: { gte: subDays(new Date(), 1) }
    }
  });

  if (recentExposures > 50) {
    signals.push({
      type: 'excessive_exposures',
      severity: 'high',
      description: 'User has 50+ discovery exposures in 24 hours'
    });
  }

  // Signal 2: Rapid discovery mode toggling
  const modeChanges = await db.userActivityLog.count({
    where: {
      userId,
      action: 'discovery_mode_toggle',
      timestamp: { gte: subHours(new Date(), 1) }
    }
  });

  if (modeChanges > 10) {
    signals.push({
      type: 'rapid_toggling',
      severity: 'high',
      description: 'User toggled discovery mode 10+ times in 1 hour'
    });
  }

  // Signal 3: Never adding shops despite high engagement
  const viewedShops = await db.discoveryExposures.count({
    where: {
      userId,
      totalViews: { gte: 3 }
    }
  });

  const addedShops = await db.userShopPreferences.count({
    where: { userId }
  });

  if (viewedShops > 20 && addedShops === 0) {
    signals.push({
      type: 'no_conversions',
      severity: 'medium',
      description: 'User viewed 20+ shops but never added any'
    });
  }

  // Signal 4: Multiple redemptions without adding shops
  const redemptions = await db.discoveryExposures.count({
    where: {
      userId,
      redeemedDuringDiscovery: true
    }
  });

  if (redemptions > 3 && addedShops === 0) {
    // This shouldn't happen - redemption should auto-add
    signals.push({
      type: 'redemption_anomaly',
      severity: 'high',
      description: 'Multiple redemptions without shop additions (data integrity issue)'
    });
  }

  return signals;
}

// Automated response to abuse
async function handleAbusiveUser(userId: string, signals: AbuseSignal[]) {
  const highSeverityCount = signals.filter(s => s.severity === 'high').length;

  if (highSeverityCount >= 2) {
    // Temporary discovery mode restriction
    await db.users.update({
      where: { id: userId },
      data: {
        discoveryModeRestricted: true,
        discoveryModeRestrictionUntil: addDays(new Date(), 7),
        discoveryModeRestrictionReason: signals.map(s => s.type).join(', ')
      }
    });

    // Notify user
    await sendNotification(userId, {
      type: 'account_warning',
      title: 'Discovery Mode Temporarily Restricted',
      body: 'We detected unusual activity. Discovery mode will be available again in 7 days.'
    });

    // Log for manual review
    await db.abuseReports.create({
      data: {
        userId,
        type: 'discovery_mode_abuse',
        signals: JSON.stringify(signals),
        autoResolved: false
      }
    });
  }
}
```

---

## 4. User Interface

### 4.1 Discovery Mode Toggle

**Location**: Customer App → Settings → Discovery Mode

```
┌─────────────────────────────────────┐
│  Discovery Mode                     │
│                                     │
│  Discover new shops and offers      │
│  while you're out and about         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ○ Off                       │   │
│  │ ● Active (Show all)         │   │
│  │ ○ Silent (No notifications) │   │
│  │ ○ Smart (AI-powered)        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Discovery Radius: [====○────] 5km │
│                                     │
│  [ ] Pause during work hours        │
│      (9am - 5pm)                    │
│                                     │
│  Discovered today: 12 shops         │
│  [View Discovery Feed →]            │
└─────────────────────────────────────┘
```

### 4.2 Discovery Notification

```
┌────────────────────────────────────┐
│  🔍 LoCo Discovery                 │
│                                    │
│  Sarah's Coffee Shop               │
│  ☕ Free Pastry with Any Coffee    │
│                                    │
│  📍 150m away · Ends in 2 days     │
│                                    │
│  Discovery Offer · Add to continue │
│  seeing offers from this shop      │
└────────────────────────────────────┘
```

### 4.3 Discovery Feed

**Location**: Customer App → Home → Discovery Tab

```
┌─────────────────────────────────────┐
│  Discovery Feed        [Filter] [×] │
├─────────────────────────────────────┤
│                                     │
│  Today                              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🍕 Mario's Pizza      [Add ♡] │ │
│  │ 25% Off First Visit           │ │
│  │ 📍 450m · Italian · $         │ │
│  │ Discovered at 1:23 PM         │ │
│  │                               │ │
│  │ [View Details]  [Not Int.]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 👟 Fit Gym          [Add ♡]   │ │
│  │ 7 Days Free Trial             │ │
│  │ 📍 1.2km · Fitness · $$       │ │
│  │ 3/5 exposures used            │ │
│  │ ⚠️ Add soon or lose access    │ │
│  │                               │ │
│  │ [View Details]  [Not Int.]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  Yesterday                          │
│  ...                                │
└─────────────────────────────────────┘
```

### 4.4 Exposure Warning States

**Low Exposures (1-3):**
```
┌───────────────────────────────┐
│ Sarah's Coffee Shop           │
│ ☕ Free Pastry with Coffee    │
│                               │
│ [Add Shop] to see all offers  │
└───────────────────────────────┘
```

**Medium Exposures (4-7):**
```
┌───────────────────────────────┐
│ Sarah's Coffee Shop           │
│ ☕ Free Pastry with Coffee    │
│                               │
│ ⏰ 5/7 discovery views used   │
│ Add now to keep seeing offers │
│                               │
│ [Add Shop] [Not Interested]   │
└───────────────────────────────┘
```

**High Exposures (8-12):**
```
┌───────────────────────────────┐
│ Sarah's Coffee Shop           │
│ ☕ Free Pastry with Coffee    │
│                               │
│ ⚠️ 10/12 discovery views used │
│ Last chance to add this shop! │
│                               │
│ [Add Shop] [Not Interested]   │
└───────────────────────────────┘
```

**Grace Period (13-15):**
```
┌───────────────────────────────┐
│ Sarah's Coffee Shop           │
│ ☕ 15% Off (Reduced Offer)    │
│                               │
│ ❌ 13/15 exposures used       │
│ Final chance to add           │
│                               │
│ [Add Shop]                    │
└───────────────────────────────┘
```

**Exhausted (16+):**
```
┌───────────────────────────────┐
│ Sarah's Coffee Shop           │
│                               │
│ 🚫 Discovery limit reached    │
│ Add shop to see their offers  │
│                               │
│ [Add Shop]                    │
└───────────────────────────────┘
```

### 4.5 Merchant Discovery Dashboard

**Location**: Merchant Dashboard → Promotions → Create Discovery Offer

```
┌─────────────────────────────────────────┐
│  Create Discovery Offer                 │
├─────────────────────────────────────────┤
│                                         │
│  Basic Information                      │
│  Title: [Free Coffee with Breakfast   ] │
│  Description: [                       ] │
│                                         │
│  Discovery Settings                     │
│  ┌───────────────────────────────────┐ │
│  │ ☑ Discovery Mode Offer            │ │
│  │                                   │ │
│  │ Discovery Boost: [___30___] %    │ │
│  │ Regular users: 20% off            │ │
│  │ Discovery users: 30% off          │ │
│  │                                   │ │
│  │ Max Exposures per User: [__5__]  │ │
│  │ Recommended: 5-10 for commuters   │ │
│  │                                   │ │
│  │ Duration: [__30__] days           │ │
│  │ Discovery offers typically last   │ │
│  │ longer than regular promotions    │ │
│  │                                   │ │
│  │ ☑ Show to new customers only      │ │
│  │ ☑ Convert to regular after limit  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Create Offer]        [Save as Draft] │
└─────────────────────────────────────────┘
```

---

## 5. Analytics & Insights

### 5.1 User Analytics

**Discovery Mode Metrics (User Profile):**

```typescript
interface UserDiscoveryMetrics {
  // Activity
  discoveryModeEnabled: boolean;
  discoveryModeType: 'active' | 'silent' | 'smart';
  totalShopsDiscovered: number;
  shopsAddedFromDiscovery: number;
  conversionRate: number;  // % of discovered shops added

  // Engagement
  avgExposuresBeforeAdd: number;
  avgTimeBetweenDiscoveryAndAdd: number; // hours
  redemptionsDuringDiscovery: number;

  // Preferences
  preferredDiscoveryRadius: number;
  mostDiscoveredCategories: string[];
}
```

### 5.2 Merchant Analytics

**Discovery Offer Performance:**

```typescript
interface DiscoveryOfferMetrics {
  // Reach
  totalDiscoveryImpressions: number;
  uniqueUsersReached: number;
  avgExposuresPerUser: number;

  // Engagement
  viewRate: number;              // % who clicked to view details
  addRate: number;               // % who added shop
  redemptionRate: number;        // % who redeemed

  // Conversion Funnel
  exposures: number;             // 1000 exposures
  views: number;                 // 200 views (20%)
  adds: number;                  // 50 adds (5% of exposures, 25% of views)
  redemptions: number;           // 30 redemptions (3% of exposures, 60% of adds)

  // Insights
  avgExposuresBeforeAdd: number; // "Users typically add after 4 exposures"
  peakDiscoveryTimes: string[];  // "Most discoveries: 8-10am, 5-7pm"
  conversionByExposure: {        // Conversion rate by exposure number
    exposure1: number,
    exposure2: number,
    // ...
  }
}
```

### 5.3 Platform Analytics

**System-Wide Discovery Metrics:**

```typescript
interface PlatformDiscoveryMetrics {
  // Adoption
  usersWithDiscoveryEnabled: number;
  percentageByMode: {
    active: number,
    silent: number,
    smart: number
  };

  // Activity
  dailyDiscoveries: number;
  avgDiscoveriesPerActiveUser: number;

  // Effectiveness
  overallAddRate: number;
  avgExposuresBeforeAdd: number;
  discoveryRedemptionRate: number;

  // Anti-Abuse
  restrictedUsers: number;
  abuseSignalsDetected: number;
  falsePositiveRate: number;
}
```

---

## 6. Implementation Phases

### Phase 1: Basic Discovery Mode (MVP)

**Weeks 1-2:**
- [ ] Database schema for discovery_exposures
- [ ] Basic discovery mode toggle (Active/Off)
- [ ] Exposure counting logic
- [ ] Simple tier system (3 tiers)

**Weeks 3-4:**
- [ ] Discovery feed UI
- [ ] Discovery notification badges
- [ ] Add shop from discovery
- [ ] Basic analytics

### Phase 2: Silent & Smart Modes

**Weeks 5-6:**
- [ ] Silent discovery mode
- [ ] Discovery feed improvements
- [ ] Batch notification summaries
- [ ] Enhanced filtering

**Weeks 7-8:**
- [ ] Smart mode (ML-based)
- [ ] Relevance scoring
- [ ] Personalized recommendations

### Phase 3: Anti-Abuse System

**Weeks 9-10:**
- [ ] Advanced exposure tracking
- [ ] Geographic pattern detection
- [ ] Engagement-based adjustments
- [ ] Time-based resets

**Weeks 11-12:**
- [ ] Abuse detection algorithms
- [ ] Automated restrictions
- [ ] Admin review dashboard
- [ ] Appeals process

### Phase 4: Merchant Discovery Offers

**Weeks 13-14:**
- [ ] Discovery offer creation UI
- [ ] Discovery-specific targeting
- [ ] A/B testing framework
- [ ] Merchant analytics dashboard

---

## 7. Success Metrics

### User Metrics
- **Discovery Mode Adoption**: >60% of users enable it
- **Add Rate**: >15% of discovered shops get added
- **Avg Exposures Before Add**: 3-5 exposures
- **Redemption During Discovery**: >20% of added shops

### Merchant Metrics
- **Discovery Offer Usage**: >40% of merchants create discovery offers
- **Discovery ROI**: CPA (cost per acquisition) <$3 per new customer
- **Conversion Lift**: Discovery offers convert 2x better than regular

### Platform Metrics
- **Abuse Detection Rate**: <2% of users flagged
- **False Positive Rate**: <5% of restrictions appealed and reversed
- **System Performance**: Discovery queries <100ms

---

## 8. Privacy & Ethics

### Privacy Considerations

1. **Transparency**
   - Clear explanation of what discovery mode does
   - Show users exactly which shops have "seen" them
   - Allow viewing/deleting discovery history

2. **Control**
   - Easy on/off toggle
   - Granular category controls
   - Block shops immediately

3. **Data Minimization**
   - Only store exposure counts, not full location history
   - Anonymize discovery patterns after 90 days
   - Delete exposure data if user deletes account

### Ethical Considerations

1. **No Manipulation**
   - Don't exploit addictive behaviors
   - Don't pressure users to add shops
   - Transparent about exposure limits

2. **Fair to Merchants**
   - Clear pricing for discovery offers
   - No hidden costs
   - Accurate analytics

3. **Balanced Incentives**
   - System should benefit both users and merchants
   - Prevent race to bottom on pricing
   - Reward quality over quantity

---

## 9. FAQ

**Q: Can users "game" the system by toggling discovery mode on/off?**
A: No. Exposures are counted whether discovery mode is on or off. If a user is within range and has previously used discovery mode, we track it.

**Q: What if a user legitimately passes a shop 50 times on their commute?**
A: The system detects "frequent passer" patterns and extends the exposure limit to 20. The goal is to give them time to decide, not pressure them.

**Q: Can merchants see individual user data?**
A: No. Merchants only see aggregate analytics. They know "50 users discovered your shop" but not who those users are.

**Q: What happens after a user exhausts their discovery exposures?**
A: They can still manually search for and add the shop. Discovery offers just won't be shown automatically anymore.

**Q: Can users reset their exposure count by deleting and recreating their account?**
A: We use device fingerprinting and can detect this. Suspicious patterns trigger manual review.

**Q: How do you handle false positives in abuse detection?**
A: Users can appeal restrictions. We review manually and adjust algorithms to reduce false positives.

---

## 10. Technical Notes

### Performance Optimization

1. **Geo-Indexing**
   - Use PostGIS GIST indexes on coordinates
   - Redis geo-caching for hot queries
   - Pre-compute discovery-eligible shops

2. **Batch Processing**
   - Process discovery exposures in background
   - Update counters asynchronously
   - Batch notification sends

3. **Caching Strategy**
   - Cache exposure counts for 5 minutes
   - Cache shop eligibility for 15 minutes
   - Invalidate on user action

### Security

1. **Rate Limiting**
   - Max 10 discovery mode toggles per hour
   - Max 100 discovery feed loads per day
   - Throttle suspicious patterns

2. **Data Validation**
   - Validate location coordinates
   - Verify user is actually in range
   - Prevent coordinate spoofing

---

This discovery mode feature creates a win-win-win:
- **Users** discover new businesses without spam
- **Merchants** acquire new customers cost-effectively
- **Platform** reduces cold-start problem and increases engagement
