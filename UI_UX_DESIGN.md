# LoCo - UI/UX Design Specification

**Version**: 1.0
**Date**: January 15, 2026
**Status**: Design Phase

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Design System](#2-design-system)
3. [Shop Dashboard Designs](#3-shop-dashboard-designs)
4. [Customer App Designs](#4-customer-app-designs)
5. [Component Library](#5-component-library)
6. [Responsive Design](#6-responsive-design)
7. [Accessibility](#7-accessibility)
8. [Animation & Interactions](#8-animation--interactions)

---

## 1. Design Principles

### Core Principles

**1. Clarity Over Cleverness**
- Clear, simple interfaces
- No hidden functionality
- Obvious CTAs
- Self-explanatory icons

**2. Mobile-First**
- Design for mobile, scale up to desktop
- Touch-friendly (min 44x44px tap targets)
- Thumb-zone optimization
- One-handed operation where possible

**3. Speed & Performance**
- Fast load times
- Instant feedback
- Skeleton screens during load
- Optimistic UI updates

**4. Trustworthy & Professional**
- Clean, modern design
- Consistent branding
- Professional imagery
- Secure feeling (lock icons, HTTPS everywhere)

**5. Delight in Details**
- Smooth animations
- Helpful micro-interactions
- Thoughtful empty states
- Celebration moments (successful redemption)

---

## 2. Design System

### Colors

#### Primary Palette

```css
/* Primary - Indigo */
--color-primary-50: #EEF2FF;
--color-primary-100: #E0E7FF;
--color-primary-200: #C7D2FE;
--color-primary-300: #A5B4FC;
--color-primary-400: #818CF8;
--color-primary-500: #6366F1;  /* Main brand color */
--color-primary-600: #4F46E5;
--color-primary-700: #4338CA;
--color-primary-800: #3730A3;
--color-primary-900: #312E81;

/* Success - Green */
--color-success-50: #F0FDF4;
--color-success-500: #22C55E;
--color-success-600: #16A34A;
--color-success-700: #15803D;

/* Warning - Amber */
--color-warning-50: #FFFBEB;
--color-warning-500: #F59E0B;
--color-warning-600: #D97706;

/* Error - Red */
--color-error-50: #FEF2F2;
--color-error-500: #EF4444;
--color-error-600: #DC2626;

/* Neutral - Gray */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

#### Color Usage

- **Primary**: CTAs, links, active states
- **Success**: Confirmations, successful actions, positive metrics
- **Warning**: Cautions, expiring promotions, limits approaching
- **Error**: Errors, validation failures, critical alerts
- **Neutral**: Text, backgrounds, borders

### Typography

#### Font Family

```css
/* Sans-serif for UI */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace for codes */
--font-mono: 'Fira Code', 'Courier New', monospace;
```

#### Font Sizes

```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

#### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Fully rounded */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 3. Shop Dashboard Designs

### 3.1 Login Page

```
┌──────────────────────────────────────────┐
│                                          │
│         [LoCo Logo + Wordmark]           │
│                                          │
│     ┌──────────────────────────────┐    │
│     │  Shop Dashboard              │    │
│     │                              │    │
│     │  Email                       │    │
│     │  [____________________]      │    │
│     │                              │    │
│     │  Password                    │    │
│     │  [____________________] 👁    │    │
│     │                              │    │
│     │  [ ] Remember me             │    │
│     │                              │    │
│     │  [   Sign In   ]  (Primary)  │    │
│     │                              │    │
│     │  Forgot password?            │    │
│     │                              │    │
│     │  ───────── or ────────       │    │
│     │                              │    │
│     │  [🔵 Sign in with Google]    │    │
│     │                              │    │
│     │  Don't have an account?      │    │
│     │  Create one →                │    │
│     └──────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**Key Features:**
- Centered single-column layout
- Social login option (Google)
- Clear CTAs
- "Remember me" for convenience
- Link to forgot password
- Link to registration

---

### 3.2 Dashboard Home

```
┌────────────────────────────────────────────────────────────┐
│  [☰] LoCo Dashboard    [🔔]  [👤 Sarah's Coffee ▼]        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─ Sidebar ────┐  ┌─ Main Content ──────────────────┐   │
│  │              │  │                                  │   │
│  │ 📊 Dashboard │  │  Welcome back, Sarah! 👋          │   │
│  │ 📍 Locations │  │                                  │   │
│  │ 🎯 Promotions│  │  ┌──────┐ ┌──────┐ ┌──────┐    │   │
│  │ 📈 Analytics │  │  │ 245  │ │  18  │ │ 7.3% │    │   │
│  │ ⚙️  Settings  │  │  │Views │ │Redem.│ │ Conv │    │   │
│  │              │  │  │Today │ │Today │ │ Rate │    │   │
│  │              │  │  └──────┘ └──────┘ └──────┘    │   │
│  │              │  │                                  │   │
│  │              │  │  Active Promotions (3)          │   │
│  │              │  │                                  │   │
│  │              │  │  ┌────────────────────────────┐ │   │
│  │              │  │  │ ☕ Free Coffee Special     │ │   │
│  │              │  │  │ 👁 89 views  ✓ 12 redem.  │ │   │
│  │              │  │  │ 📍 Downtown · 500m radius │ │   │
│  │              │  │  │ Ends in 3 days            │ │   │
│  │              │  │  │ [View Analytics] [Edit]   │ │   │
│  │              │  │  └────────────────────────────┘ │   │
│  │              │  │                                  │   │
│  │              │  │  ┌────────────────────────────┐ │   │
│  │              │  │  │ 🥐 Morning Pastry Deal    │ │   │
│  │              │  │  │ 👁 124 views ✓ 8 redem.   │ │   │
│  │              │  │  │ 📍 All locations · 1km    │ │   │
│  │              │  │  │ Ends today at 11am        │ │   │
│  │              │  │  │ [View Analytics] [Edit]   │ │   │
│  │              │  │  └────────────────────────────┘ │   │
│  │              │  │                                  │   │
│  │              │  │  [+ Create New Promotion]       │   │
│  │              │  │                                  │   │
│  └──────────────┘  └──────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Sidebar navigation (collapsible on mobile)
- Key metrics at a glance (cards)
- List of active promotions with quick actions
- Prominent CTA for creating new promotion
- Notifications icon in header
- Profile dropdown in header

---

### 3.3 Create Promotion Page

```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Promotions                                       │
│                                                            │
│  Create New Promotion                                      │
│                                                            │
│  ┌─ Form ──────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Step 1 of 4: Basic Information                     │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │                                                      │  │
│  │  Promotion Title *                                  │  │
│  │  [_________________________________________]        │  │
│  │  (e.g., "Free Coffee with Breakfast")              │  │
│  │                                                      │  │
│  │  Description *                                      │  │
│  │  [_________________________________________]        │  │
│  │  [_________________________________________]        │  │
│  │  [_________________________________________]        │  │
│  │  Max 500 characters                                 │  │
│  │                                                      │  │
│  │  Promotion Image                                    │  │
│  │  ┌────────────────────┐                            │  │
│  │  │                    │                            │  │
│  │  │   📷  Upload Image │                            │  │
│  │  │   or drag & drop   │                            │  │
│  │  │                    │                            │  │
│  │  └────────────────────┘                            │  │
│  │  JPG, PNG, WEBP (max 10MB)                         │  │
│  │                                                      │  │
│  │                        [Cancel]  [Next: Discount →] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘

Step 2: Discount Details
┌─────────────────────────────────────────────────┐
│  Discount Type *                                │
│  ○ Percentage off                               │
│  ○ Fixed amount off                             │
│  ● Free item                                    │
│  ○ Buy one get one (BOGO)                       │
│                                                 │
│  Discount Value                                 │
│  [________] (e.g., "25" for 25% off)            │
│                                                 │
│  Terms & Conditions                             │
│  [_________________________________________]    │
│  [_________________________________________]    │
│  (Optional but recommended)                     │
│                                                 │
│                  [← Back]  [Next: Targeting →]  │
│                                                 │
└─────────────────────────────────────────────────┘

Step 3: Location & Targeting
┌─────────────────────────────────────────────────┐
│  Target Locations *                             │
│  ● All locations                                │
│  ○ Specific locations                           │
│                                                 │
│  [If specific locations selected:]              │
│  ☑ Downtown Coffee Shop                         │
│  ☑ Main Street Location                         │
│  ☐ Airport Branch                               │
│                                                 │
│  Geofencing Radius *                            │
│  [======○================] 1.5 km               │
│  100m ────────────────────────── 50km           │
│                                                 │
│  📍 Preview on Map                              │
│  ┌──────────────────────────┐                  │
│  │      🗺️ Map View         │                  │
│  │   [Shows radius circles  │                  │
│  │    around locations]     │                  │
│  └──────────────────────────┘                  │
│                                                 │
│                  [← Back]  [Next: Schedule →]   │
│                                                 │
└─────────────────────────────────────────────────┘

Step 4: Schedule & Limits
┌─────────────────────────────────────────────────┐
│  Start Date & Time *                            │
│  [2026-01-20] at [08:00 AM]                     │
│                                                 │
│  End Date & Time *                              │
│  [2026-01-22] at [11:00 AM]                     │
│                                                 │
│  ⚙️ Advanced Options                            │
│                                                 │
│  Max Redemptions per User                       │
│  [__1__] redemption(s)                          │
│                                                 │
│  Total Redemption Limit                         │
│  [__50__] redemptions (Optional)                │
│                                                 │
│  [ ] This is a Discovery Mode offer             │
│      (Special offers for exploring users)       │
│                                                 │
│  ─────────────────────────────────────          │
│                                                 │
│  Preview                                        │
│  ┌─────────────────────────────┐               │
│  │ How customers will see it:  │               │
│  │                             │               │
│  │ [Promotion card preview]    │               │
│  │                             │               │
│  └─────────────────────────────┘               │
│                                                 │
│    [← Back]  [Save Draft]  [Publish Promotion] │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- Multi-step wizard (4 steps)
- Progress indicator
- Clear validation and hints
- Map preview for geofencing
- Promotion preview before publishing
- Save as draft option
- Back/Next navigation

---

### 3.4 Analytics Page

```
┌────────────────────────────────────────────────────────────┐
│  Analytics                                  [Export ▼]     │
│                                                            │
│  ┌─ Filters ──────────────────────────────────────────┐   │
│  │ Date Range: [Last 7 Days ▼]   Promotion: [All ▼]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  1,234   │ │    892   │ │    87    │ │   7.0%   │    │
│  │  Views   │ │  Unique  │ │ Redem.   │ │  Conv.   │    │
│  │  ↑ 12%   │ │  Users   │ │  ↑ 8%    │ │  Rate    │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                            │
│  Views Over Time                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │       ╱╲                                            │  │
│  │      ╱  ╲      ╱╲                                  │  │
│  │   ╱╲╱    ╲    ╱  ╲    ╱╲                          │  │
│  │  ╱        ╲╱╲╱    ╲╱╲╱  ╲                         │  │
│  │ ────────────────────────────                       │  │
│  │ Mon  Tue  Wed  Thu  Fri  Sat  Sun                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌─ Left Column ────────┐  ┌─ Right Column ─────────┐   │
│  │                      │  │                         │   │
│  │  Top Promotions      │  │  Geographic Heatmap     │   │
│  │                      │  │                         │   │
│  │  1. Free Coffee      │  │  ┌───────────────────┐ │   │
│  │     245 views        │  │  │                   │ │   │
│  │     18 redem. (7.3%) │  │  │   🗺️ Heatmap      │ │   │
│  │                      │  │  │   [Red = high]    │ │   │
│  │  2. Pastry Deal      │  │  │   [Blue = low]    │ │   │
│  │     124 views        │  │  │                   │ │   │
│  │     8 redem. (6.5%)  │  │  └───────────────────┘ │   │
│  │                      │  │                         │   │
│  │  3. Lunch Special    │  │  Avg Distance: 1.2km    │   │
│  │     89 views         │  │  Peak Time: 8-10am      │   │
│  │     12 redem. (13%)  │  │                         │   │
│  │                      │  │                         │   │
│  └──────────────────────┘  └─────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Date range filter
- Key metrics with trend indicators
- Line chart for views over time
- Top promotions list with conversion rates
- Geographic heatmap
- Export functionality

---

## 4. Customer App Designs

### 4.1 Splash Screen (PWA)

```
┌─────────────────┐
│                 │
│                 │
│                 │
│    [LoCo Logo]  │
│                 │
│   LoCo          │
│   Discover      │
│   nearby deals  │
│                 │
│   Loading...    │
│   ━━━━━         │
│                 │
│                 │
└─────────────────┘
```

---

### 4.2 Onboarding Flow

**Screen 1: Welcome**
```
┌─────────────────────────┐
│                         │
│     [Illustration]      │
│     👋 🏪 📍            │
│                         │
│  Welcome to LoCo!       │
│                         │
│  Discover amazing deals │
│  from businesses near   │
│  you, automatically.    │
│                         │
│  ●○○                    │
│                         │
│      [Get Started]      │
│                         │
│  Already have account?  │
│       Sign In           │
│                         │
└─────────────────────────┘
```

**Screen 2: Location Permission**
```
┌─────────────────────────┐
│                         │
│     [Illustration]      │
│     📍 🗺️               │
│                         │
│  Enable Location        │
│                         │
│  We need your location  │
│  to show you relevant   │
│  deals nearby.          │
│                         │
│  Your privacy matters.  │
│  We only track when     │
│  you're using the app.  │
│                         │
│  ○●○                    │
│                         │
│   [Enable Location]     │
│                         │
│      Skip for now       │
│                         │
└─────────────────────────┘
```

**Screen 3: Notifications**
```
┌─────────────────────────┐
│                         │
│     [Illustration]      │
│     🔔 ✨               │
│                         │
│  Get Notified           │
│                         │
│  Receive alerts when    │
│  you're near great      │
│  promotions.            │
│                         │
│  ✓ Only relevant deals  │
│  ✓ Full control         │
│  ✓ No spam, promise!    │
│                         │
│  ○○●                    │
│                         │
│  [Enable Notifications] │
│                         │
│   Maybe later           │
│                         │
└─────────────────────────┘
```

---

### 4.3 Home Screen

```
┌─────────────────────────────────────┐
│  📍 Downtown          [🔔]  [👤]    │
├─────────────────────────────────────┤
│                                     │
│  🔍 Search promotions...            │
│                                     │
│  Nearby Promotions (12)             │
│  [Filters ▼]  Sort: Distance ▼      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ☕ Sarah's Coffee Shop          ││
│  │ Free Coffee with Breakfast      ││
│  │                                 ││
│  │ [Promo Image]                   ││
│  │                                 ││
│  │ 📍 150m away · Ends in 2 days   ││
│  │ ⭐ 4.8 (124 reviews)             ││
│  │                                 ││
│  │ [View Offer →]                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🍕 Mario's Pizza                ││
│  │ 25% Off All Orders              ││
│  │                                 ││
│  │ [Promo Image]                   ││
│  │                                 ││
│  │ 📍 450m away · Ends tonight     ││
│  │ ⭐ 4.6 (89 reviews)              ││
│  │                                 ││
│  │ [View Offer →]                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 👟 Fit Gym                      ││
│  │ 7 Days Free Trial               ││
│  │ ...                             ││
│                                     │
├─────────────────────────────────────┤
│  [🏠 Home] [🔍 Discovery] [♡ Saved] │
│  [🎟️ Redeemed] [⚙️ Settings]       │
└─────────────────────────────────────┘
```

**Key Features:**
- Current location at top
- Search bar
- Filter and sort options
- Card-based promotion list
- Distance and time remaining
- Star ratings
- Bottom navigation
- Clear CTA ("View Offer")

---

### 4.4 Promotion Detail

```
┌─────────────────────────────────────┐
│  ← Back               [♡ Save] [⋮]  │
│                                     │
│  [Hero Image - Full Width]          │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │     [Promotion Photo]           ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ☕ Sarah's Coffee Shop             │
│  📍 150m away · Open now            │
│  ⭐ 4.8 (124 reviews)                │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Free Coffee with Breakfast      ││
│  │                                 ││
│  │ Buy any breakfast item and get  ││
│  │ a free coffee of any size.      ││
│  │                                 ││
│  │ ⏰ Ends in 2 days                ││
│  │ 🎟️ 8/50 redeemed                 ││
│  └─────────────────────────────────┘│
│                                     │
│  Terms & Conditions                 │
│  • Valid Mon-Fri, 7am-11am          │
│  • One redemption per customer      │
│  • Cannot be combined with others   │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│  📍 Location                         │
│  123 Main Street, Downtown          │
│  [Get Directions →]                 │
│                                     │
│  🕐 Hours                            │
│  Mon-Fri: 7am-7pm                   │
│  Sat-Sun: 8am-8pm                   │
│                                     │
│  ☎️ Contact                          │
│  (555) 123-4567                     │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│  [     Redeem Now     ] (Primary)   │
│                                     │
└─────────────────────────────────────┘
```

**Key Features:**
- Full-width hero image
- Business name and rating
- Promotion details in card
- Terms & conditions expandable
- Location, hours, contact info
- Get directions link
- Prominent redeem CTA

---

### 4.5 Redemption Code Screen

```
┌─────────────────────────────────────┐
│  ✓ Code Generated                   │
│                                     │
│  ☕ Sarah's Coffee Shop             │
│  Free Coffee with Breakfast         │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│  Show this code at checkout:        │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │      [QR Code - Large]          ││
│  │                                 ││
│  │      LC3K-MN78-XR45             ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ⏰ Code expires in: 23:45:12        │
│                                     │
│  📍 Valid at: Downtown Location     │
│  123 Main Street                    │
│                                     │
│  [Get Directions]                   │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│  ℹ️ How to use:                      │
│  1. Visit the store                 │
│  2. Show this code to staff         │
│  3. Enjoy your free coffee!         │
│                                     │
│  Need help? Contact support         │
│                                     │
│  [Close]                            │
│                                     │
└─────────────────────────────────────┘
```

**Key Features:**
- Success indicator at top
- Large QR code (easy to scan)
- Alphanumeric code (backup)
- Countdown timer
- Location validation
- Clear instructions
- Help link

---

### 4.6 Discovery Mode

**Discovery Mode Toggle (Settings)**
```
┌─────────────────────────────────────┐
│  ← Settings                         │
│                                     │
│  Discovery Mode           [ON] 🟢   │
│                                     │
│  Discover new shops and offers      │
│  while you're out and about.        │
│                                     │
│  Discovery Type                     │
│  ● Active - Get notified            │
│  ○ Silent - No notifications        │
│  ○ Smart - AI-powered (Coming soon) │
│                                     │
│  Discovery Radius                   │
│  [======○=============] 5 km        │
│  500m ───────────────────── 25km    │
│                                     │
│  [ ] Pause during work hours        │
│      (9am - 5pm)                    │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│  Today's Discovery                  │
│  📊 12 shops discovered              │
│  ♡ 2 shops added                    │
│                                     │
│  [View Discovery Feed →]            │
│                                     │
└─────────────────────────────────────┘
```

**Discovery Feed**
```
┌─────────────────────────────────────┐
│  Discovery Feed       [Filter] [×]  │
│                                     │
│  🔍 Browse shops you discovered     │
│                                     │
│  Today (8)                          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🍕 Mario's Pizza       [Add ♡]  ││
│  │ 25% Off First Visit             ││
│  │                                 ││
│  │ [Promo Image - Small]           ││
│  │                                 ││
│  │ 📍 450m · Italian · $$           ││
│  │ Discovered at 1:23 PM           ││
│  │                                 ││
│  │ [View Details]  [Not Interested]││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 👟 Fit Gym             [Add ♡]  ││
│  │ 7 Days Free Trial               ││
│  │                                 ││
│  │ [Promo Image - Small]           ││
│  │                                 ││
│  │ 📍 1.2km · Fitness · $$          ││
│  │ ⚠️ 3/5 exposures used            ││
│  │ Add now to keep seeing offers   ││
│  │                                 ││
│  │ [View Details]  [Not Interested]││
│  └─────────────────────────────────┘│
│                                     │
│  Yesterday (4)                      │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
```

**Key Features:**
- Discovery mode toggle with visual indicator
- Three mode options (Active/Silent/Smart)
- Radius slider
- Pause during work hours option
- Daily stats
- Discovery feed with prominent "Add" CTAs
- Exposure warnings for shops nearing limit
- "Not Interested" option

---

### 4.7 Settings

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  Settings                           │
│                                     │
│  ┌─ Profile ─────────────────────┐ │
│  │ [Avatar] Sarah Johnson         │ │
│  │ sarah@email.com                │ │
│  │ [Edit Profile →]               │ │
│  └────────────────────────────────┘ │
│                                     │
│  Notifications                      │
│  Push Notifications        [ON] 🟢  │
│  Email Notifications      [OFF] ⚪  │
│  [Manage →]                         │
│                                     │
│  Location & Discovery               │
│  Location Services         [ON] 🟢  │
│  Discovery Mode            [ON] 🟢  │
│  Notification Radius       5 km     │
│  [Manage →]                         │
│                                     │
│  Preferences                        │
│  Favorite Categories               │
│  Food & Drink, Retail, Services    │
│  [Manage →]                         │
│                                     │
│  Shops                              │
│  Following                  24      │
│  Muted                      3       │
│  [Manage →]                         │
│                                     │
│  Privacy & Security                 │
│  Privacy Settings          [→]      │
│  Data & Privacy            [→]      │
│  Download My Data          [→]      │
│  Delete Account            [→]      │
│                                     │
│  About                              │
│  Help Center               [→]      │
│  Terms of Service          [→]      │
│  Privacy Policy            [→]      │
│  Version 1.0.0                      │
│                                     │
│  [Sign Out]                         │
│                                     │
└─────────────────────────────────────┘
```

**Key Features:**
- Profile card at top
- Grouped settings sections
- Toggle switches for quick actions
- Navigation arrows for detailed settings
- Privacy and data controls
- Help and legal info
- Sign out button at bottom

---

## 5. Component Library

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  min-height: 44px;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  background: var(--color-primary-800);
  transform: scale(0.98);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--color-primary-600);
  border: 2px solid var(--color-primary-600);
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  min-height: 44px;
}

/* Icon Button */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.card-promotion {
  overflow: hidden;
}

.card-promotion img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
```

### Input Fields

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  min-height: 44px;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-error {
  border-color: var(--color-error-500);
}

.input-label {
  display: block;
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
}
```

### Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.badge-success {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.badge-warning {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.badge-error {
  background: var(--color-error-50);
  color: var(--color-error-700);
}
```

---

## 6. Responsive Design

### Breakpoints

```css
/* Mobile First Approach */

/* Extra small devices (phones, <576px) */
/* Default styles apply here */

/* Small devices (landscape phones, ≥576px) */
@media (min-width: 576px) { }

/* Medium devices (tablets, ≥768px) */
@media (min-width: 768px) { }

/* Large devices (desktops, ≥992px) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, ≥1200px) */
@media (min-width: 1200px) { }
```

### Mobile-Specific Considerations

1. **Bottom Navigation**: Thumb-zone optimized
2. **Sticky Headers**: Keep context visible while scrolling
3. **Full-Width CTAs**: Easy to tap
4. **Large Touch Targets**: Minimum 44x44px
5. **Reduce Clutter**: Show only essential info on mobile

---

## 7. Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**
- Text: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

**Keyboard Navigation**
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip to main content link

**Screen Readers**
- Semantic HTML (header, nav, main, article)
- ARIA labels for icons
- Alt text for images
- Form labels associated with inputs

**Examples:**

```html
<!-- Button with icon -->
<button aria-label="Add to favorites">
  <svg>...</svg>
</button>

<!-- Form input -->
<label for="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-hint"
/>
<p id="email-hint">We'll never share your email</p>

<!-- Image -->
<img
  src="coffee.jpg"
  alt="Free coffee promotion at Sarah's Coffee Shop"
/>
```

---

## 8. Animation & Interactions

### Micro-Interactions

**Button Press**
```css
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.btn:active {
  animation: button-press 0.15s ease;
}
```

**Success Checkmark**
```css
@keyframes checkmark {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(360deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.success-icon {
  animation: checkmark 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Slide In From Bottom (Modals)**
```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal {
  animation: slide-up 0.3s ease-out;
}
```

**Shimmer Loading (Skeleton Screens)**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Loading States

**Inline Spinner**
```
  ⏳ Loading...
```

**Button Loading**
```
  [⏳ Processing...]  (Disabled)
```

**Skeleton Cards**
```
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│ ▓▓▓▓▓▓▓▓▓▓         │
│                     │
│ ▓▓▓▓▓▓  ▓▓▓▓▓▓     │
└─────────────────────┘
```

### Toast Notifications

```
┌─────────────────────────────────┐
│ ✓ Success!                      │
│ Promotion created successfully  │
│                            [×]  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ⚠ Warning                       │
│ Promotion ends in 1 hour        │
│                            [×]  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ✗ Error                         │
│ Failed to redeem. Try again.    │
│                            [×]  │
└─────────────────────────────────┘
```

**Position**: Top-right (desktop), Top-center (mobile)
**Duration**: 3-5 seconds
**Dismissible**: Yes (X button)

---

## Next Steps

1. **Create High-Fidelity Mockups**
   - Use Figma or similar tool
   - Apply design system
   - Create interactive prototype

2. **Usability Testing**
   - Test with 5-10 users
   - Gather feedback
   - Iterate on designs

3. **Develop Component Library**
   - Build reusable React components
   - Use Tailwind CSS or styled-components
   - Storybook for documentation

4. **Implement Responsive Design**
   - Mobile-first approach
   - Test on real devices
   - Ensure touch targets are adequate

5. **Accessibility Audit**
   - Test with screen readers
   - Keyboard navigation
   - Color contrast checks

---

## Resources

- **Design Tool**: Figma (recommended)
- **Icon Library**: Heroicons, Lucide Icons
- **Illustrations**: unDraw, Storyset
- **Stock Photos**: Unsplash, Pexels
- **Fonts**: Inter (Google Fonts)
- **Design Inspiration**: Dribbble, Mobbin

---

**Document Version**: 1.0
**Last Updated**: January 15, 2026
**Status**: Ready for Development
