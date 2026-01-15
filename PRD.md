# Product Requirements Document (PRD)
# LoCo - Location Commerce Platform

**Version**: 1.0
**Date**: January 15, 2026
**Status**: Draft
**Owner**: Product Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Problem Statement](#3-problem-statement)
4. [Target Users](#4-target-users)
5. [User Personas](#5-user-personas)
6. [User Stories](#6-user-stories)
7. [Core Features](#7-core-features)
8. [User Experience & Flows](#8-user-experience--flows)
9. [Functional Requirements](#9-functional-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Success Metrics](#11-success-metrics)
12. [Technical Constraints](#12-technical-constraints)
13. [Release Strategy](#13-release-strategy)
14. [Risks & Mitigation](#14-risks--mitigation)
15. [Open Questions](#15-open-questions)

---

## 1. Executive Summary

**LoCo** (Location Commerce) is a mobile-first platform that connects local businesses with nearby customers through location-based promotions and real-time notifications. The platform enables merchants to create targeted offers that automatically reach potential customers when they're physically near their stores, driving foot traffic and increasing sales.

### Key Value Propositions

**For Businesses:**
- Increase foot traffic through targeted, location-based marketing
- Reach customers at the moment of highest purchase intent
- Pay only for actual customer engagement (views/redemptions)
- Track real-time analytics and ROI

**For Customers:**
- Discover relevant deals and promotions automatically
- Save money on purchases they're already making
- No spam - only notifications for places they care about
- Full control over privacy and notification preferences

---

## 2. Product Vision

**Vision Statement:**
"To become the leading platform for hyperlocal commerce, connecting every local business with nearby customers at the perfect moment."

**Mission:**
Empower local businesses to compete with large chains by giving them the tools to reach customers through intelligent, location-based marketing, while providing customers with a personalized shopping experience that saves them money and time.

### 3-Year Goals

- **Year 1**: Launch MVP in 3 major cities, onboard 500+ businesses, 50K+ users
- **Year 2**: Expand to 20 cities, reach 5,000+ businesses, 500K+ users
- **Year 3**: National coverage, 25K+ businesses, 5M+ users, introduce premium features

---

## 3. Problem Statement

### Business Problems

1. **High Customer Acquisition Costs**: Small businesses spend 20-30% of revenue on advertising with poor targeting
2. **Limited Digital Reach**: Local shops lack the tools and expertise to compete online
3. **Ineffective Marketing**: Traditional flyers, billboards, and ads have low conversion rates
4. **Timing Issues**: Promotions reach customers at wrong times (e.g., email at midnight)
5. **No Foot Traffic Data**: Businesses don't know how many people pass by their stores

### Customer Problems

1. **Discovery Gap**: Hard to find deals and promotions from nearby local businesses
2. **Spam Overload**: Email/SMS marketing is intrusive and poorly targeted
3. **Missed Opportunities**: Users miss limited-time deals because they don't know about them
4. **App Fatigue**: Too many loyalty apps to download and manage
5. **Privacy Concerns**: Fear of being tracked constantly by apps

### Market Opportunity

- **$250B+ local commerce market** in the US alone
- **78% of mobile searches** for local businesses result in offline purchase within 24 hours
- **72% of consumers** say they'd engage with personalized marketing based on location
- **Smartphones penetration**: 85%+ in target demographics
- **Existing solutions**: Either too expensive (Groupon), too complex (loyalty apps), or privacy-invasive

---

## 4. Target Users

### Primary Users

**1. Merchants (Businesses)**
- Small to medium-sized businesses (1-50 locations)
- Categories: Food & Beverage, Retail, Services, Entertainment
- Tech-savvy enough to use a web dashboard
- Budget-conscious, ROI-focused
- Ages: 25-55
- Locations: Urban and suburban areas

**2. Consumers (Customers)**
- Mobile-first users
- Ages: 18-45 (primary), 45-65 (secondary)
- Urban/suburban dwellers
- Deal-conscious but not "extreme couponers"
- Privacy-aware
- Comfortable with location sharing for value

### Secondary Users

- Marketing agencies managing multiple clients
- Franchise managers overseeing multiple locations
- Shopping mall/complex managers

---

## 5. User Personas

### Persona 1: Sarah the Small Business Owner

**Demographics:**
- Age: 34
- Role: Owner of a local coffee shop
- Location: Downtown area, urban
- Tech comfort: Medium

**Goals:**
- Increase weekday morning traffic (currently slow)
- Compete with nearby Starbucks
- Build a loyal customer base
- Track marketing ROI

**Pain Points:**
- Can't afford expensive advertising
- Email marketing has <5% open rates
- Doesn't know how to reach nearby office workers
- Unsure which promotions work

**Needs from LoCo:**
- Easy promotion creation
- Target morning commuters within 500m
- See real-time results
- Affordable pricing (under $100/month)

**User Quote:**
*"I know hundreds of people walk past my shop every morning, but I have no way to tell them about my promotions. I need something simple that just works."*

---

### Persona 2: Marcus the Urban Professional

**Demographics:**
- Age: 28
- Role: Software Engineer
- Location: Urban downtown
- Tech comfort: High

**Goals:**
- Find good lunch deals near office
- Discover new local restaurants
- Save money without effort
- Support local businesses

**Pain Points:**
- Overwhelmed by irrelevant notifications
- Too many loyalty apps to manage
- Often misses limited-time deals
- Concerned about location privacy

**Needs from LoCo:**
- Relevant notifications only
- Easy on/off controls
- Battery-efficient
- Clear privacy settings

**User Quote:**
*"I want to know about deals near me, but I don't want to be spammed. Just show me what's relevant when I'm actually nearby."*

---

### Persona 3: Jennifer the Suburban Parent

**Demographics:**
- Age: 42
- Role: Marketing Manager & Parent of 2
- Location: Suburban area
- Tech comfort: Medium-High

**Goals:**
- Save on family expenses
- Find activities for kids
- Support local community
- Efficient shopping

**Pain Points:**
- Limited time to research deals
- Misses sales at favorite stores
- Too busy to check multiple apps
- Wants deals without the hassle

**Needs from LoCo:**
- Notifications for stores she cares about
- Category filtering (kids, groceries, etc.)
- Quiet hours during work/sleep
- Weekend activity ideas

**User Quote:**
*"Between work and kids, I don't have time to hunt for deals. I just want to automatically know when my favorite stores have promotions."*

---

### Persona 4: David the Multi-Location Franchise Manager

**Demographics:**
- Age: 47
- Role: Regional Manager for 8 franchise locations
- Location: Multiple cities
- Tech comfort: Medium

**Goals:**
- Increase traffic across all locations
- Test different promotions
- Compare location performance
- Standardize marketing

**Pain Points:**
- Managing 8 different local marketing efforts
- Inconsistent promotion performance
- Difficult to compare data
- Expensive agency fees

**Needs from LoCo:**
- Multi-location dashboard
- A/B testing capability
- Consolidated analytics
- Role-based access for store managers

**User Quote:**
*"I need to see which promotions work at which locations. Right now, every store manager does their own thing and I have no visibility."*

---

## 6. User Stories

### Epic 1: Merchant Onboarding & Setup

#### Must Have (P0)

**US-1.1: Merchant Registration**
As a business owner, I want to create an account with my business information, so that I can start using the platform.

**Acceptance Criteria:**
- Can register with email and password
- Must provide business name, category, and address
- Email verification required
- Password must meet security requirements (8+ chars)
- Receives welcome email with next steps

---

**US-1.2: Add Store Locations**
As a business owner, I want to add my store location(s) with addresses, so customers can find my promotions when nearby.

**Acceptance Criteria:**
- Can add multiple locations
- Address autocomplete/validation
- Can set location on an interactive map
- Can add phone number and hours
- Can mark locations as active/inactive

---

**US-1.3: Upload Business Logo**
As a business owner, I want to upload my logo, so my promotions look professional and branded.

**Acceptance Criteria:**
- Supports JPG, PNG, WEBP formats
- Max file size: 5MB
- Auto-resizes to standard dimensions
- Preview before confirming
- Can update/delete logo

---

### Epic 2: Promotion Management

#### Must Have (P0)

**US-2.1: Create Basic Promotion**
As a business owner, I want to create a promotion with title, description, and dates, so I can advertise my offers.

**Acceptance Criteria:**
- Can enter title (max 100 chars)
- Can enter description (max 500 chars)
- Can set start and end date/time
- Can select target locations (all or specific)
- Can set geofencing radius (100m to 50km)
- Preview before publishing

---

**US-2.2: Set Promotion Terms**
As a business owner, I want to define discount details and terms, so customers know exactly what they're getting.

**Acceptance Criteria:**
- Can select discount type (%, fixed amount, free item, BOGO)
- Can enter discount value
- Can add terms and conditions
- Can set max redemptions per user
- Can set total redemption limit

---

**US-2.3: Add Promotion Image**
As a business owner, I want to add an attractive image to my promotion, so it catches customers' attention.

**Acceptance Criteria:**
- Supports JPG, PNG, WEBP formats
- Max file size: 10MB
- Shows image preview
- Optional (can create promotion without image)
- Suggested dimensions provided

---

**US-2.4: View Active Promotions**
As a business owner, I want to see all my active promotions in one place, so I can manage them easily.

**Acceptance Criteria:**
- Shows list of all promotions
- Can filter by status (active, scheduled, ended)
- Shows key metrics (views, redemptions)
- Can sort by date, performance
- Can quick-activate/deactivate

---

**US-2.5: Edit/Delete Promotions**
As a business owner, I want to edit or delete promotions, so I can fix mistakes or end promotions early.

**Acceptance Criteria:**
- Can edit all fields before promotion starts
- Can edit description, dates, and limits after start
- Cannot change discount amount after start (fraud prevention)
- Can deactivate anytime
- Confirmation required for deletion

---

#### Should Have (P1)

**US-2.6: Duplicate Promotion**
As a business owner, I want to duplicate a successful promotion, so I can quickly create similar offers.

**Acceptance Criteria:**
- One-click duplicate from promotion list
- All fields copied except dates
- Opens in edit mode
- Must explicitly publish

---

**US-2.7: Schedule Recurring Promotions**
As a business owner, I want to schedule recurring promotions (e.g., "Happy Hour every Friday"), so I don't have to recreate them weekly.

**Acceptance Criteria:**
- Can set recurrence pattern (daily, weekly, monthly)
- Can set end date for recurrence
- Shows all upcoming instances
- Can edit/cancel individual instances

---

### Epic 3: Analytics & Insights

#### Must Have (P0)

**US-3.1: View Promotion Performance**
As a business owner, I want to see how many people viewed and redeemed my promotion, so I know if it's working.

**Acceptance Criteria:**
- Shows total views and unique views
- Shows total redemptions
- Shows conversion rate (redemptions/views)
- Real-time updates
- Date range filter

---

**US-3.2: View Dashboard Overview**
As a business owner, I want to see an overview of all my promotions' performance, so I can quickly assess what's working.

**Acceptance Criteria:**
- Shows total active promotions
- Shows total views, redemptions across all promotions
- Shows top-performing promotions
- Shows trends (up/down from previous period)
- Visual charts/graphs

---

#### Should Have (P1)

**US-3.3: Geographic Analytics**
As a business owner, I want to see where my viewers are coming from, so I can optimize my targeting radius.

**Acceptance Criteria:**
- Heatmap of viewer locations
- Average distance of viewers
- Distance distribution chart
- Per-location breakdown (for multi-location)

---

**US-3.4: Time-Based Analytics**
As a business owner, I want to see when people view my promotions, so I can optimize timing.

**Acceptance Criteria:**
- Views by hour of day
- Views by day of week
- Peak time identification
- Redemption time patterns

---

**US-3.5: Export Analytics**
As a business owner, I want to export my analytics data, so I can share it with partners or analyze further.

**Acceptance Criteria:**
- Export to CSV or PDF
- Include all key metrics
- Customizable date range
- Include charts in PDF

---

### Epic 4: Customer Discovery

#### Must Have (P0)

**US-4.1: Customer Registration**
As a customer, I want to create an account quickly, so I can start discovering promotions.

**Acceptance Criteria:**
- Can register with email or phone
- Optional social login (Google, Apple)
- Minimal required info (name, email, password)
- Email/SMS verification
- Fast (< 30 seconds to complete)

---

**US-4.2: Enable Location Permissions**
As a customer, I want to grant location access, so I can receive relevant nearby promotions.

**Acceptance Criteria:**
- Clear explanation of why location is needed
- Shows example of how it works
- Can grant "always" or "while using app"
- Can revoke anytime in settings
- Works without location (search-based fallback)

---

**US-4.3: See Nearby Promotions**
As a customer, I want to see all active promotions near my current location, so I can take advantage of them.

**Acceptance Criteria:**
- Shows promotions within my notification radius
- Sorted by distance by default
- Shows distance to each promotion
- Shows time remaining
- Shows business logo and image
- Real-time location updates

---

**US-4.4: View Promotion Details**
As a customer, I want to see full details of a promotion, so I can decide if I want it.

**Acceptance Criteria:**
- Shows full description
- Shows terms and conditions
- Shows distance and directions
- Shows time remaining
- Shows how many redemptions left (if limited)
- Shows business contact info

---

**US-4.5: Get Directions**
As a customer, I want to get directions to a business, so I can find it easily.

**Acceptance Criteria:**
- Opens native maps app (Google Maps, Apple Maps)
- Shows exact store location
- Works offline (cached location)

---

### Epic 5: Notifications

#### Must Have (P0)

**US-5.1: Receive Push Notifications**
As a customer, I want to receive push notifications when I'm near a promotion, so I don't miss good deals.

**Acceptance Criteria:**
- Notification shows promotion title and business name
- Tapping opens promotion detail
- Shows business logo as notification icon
- Sound/vibration follows device settings
- Works on iOS and Android (PWA)

---

**US-5.2: Set Notification Preferences**
As a customer, I want to control which notifications I receive, so I'm not overwhelmed.

**Acceptance Criteria:**
- Can enable/disable all notifications
- Can set notification radius (500m - 25km)
- Can select preferred categories
- Can set quiet hours (no notifications during sleep)
- Changes take effect immediately

---

**US-5.3: Mute Specific Businesses**
As a customer, I want to mute businesses I'm not interested in, so I don't get irrelevant notifications.

**Acceptance Criteria:**
- Can mute from promotion detail page
- Can mute from notification itself
- Can unmute from settings
- Muted businesses still show in browse (not in notifications)

---

#### Should Have (P1)

**US-5.4: Set Frequency Limits**
As a customer, I want to limit how many notifications I get per day, so I'm not spammed.

**Acceptance Criteria:**
- Can set max notifications per day (1-20)
- Once limit reached, no more until next day
- Priority system for best deals if limit reached

---

### Epic 6: Redemption

#### Must Have (P0)

**US-6.1: Redeem Promotion**
As a customer, I want to redeem a promotion, so I can get the discount.

**Acceptance Criteria:**
- Generates unique redemption code
- Shows code prominently (QR + text)
- Code remains valid until used
- Can only redeem if within radius (fraud prevention)
- Tracks redemption timestamp

---

**US-6.2: Verify Redemption (Merchant)**
As a business owner, I want to verify redemption codes, so I can confirm they're legitimate.

**Acceptance Criteria:**
- Can enter code manually
- Can scan QR code (mobile)
- Shows promotion details upon verification
- Shows customer name
- Marks code as used
- Cannot reuse code

---

**US-6.3: View Redemption History**
As a customer, I want to see my past redemptions, so I can track what I've saved.

**Acceptance Criteria:**
- Shows all redeemed promotions
- Shows date and location
- Shows estimated savings
- Can sort by date or savings
- Shows total lifetime savings

---

### Epic 7: User Management

#### Must Have (P0)

**US-7.1: Edit Profile**
As a user (customer or merchant), I want to edit my profile information, so I can keep it up-to-date.

**Acceptance Criteria:**
- Can change name, email, phone
- Can upload profile picture
- Email change requires verification
- Shows last updated timestamp

---

**US-7.2: Change Password**
As a user, I want to change my password, so I can keep my account secure.

**Acceptance Criteria:**
- Requires current password
- New password must meet requirements
- Confirmation required
- Logs out other sessions

---

**US-7.3: Reset Password**
As a user, I want to reset my password if I forget it, so I can regain access.

**Acceptance Criteria:**
- Can request reset via email
- Receives reset link (valid 1 hour)
- Can set new password
- Invalidates old sessions

---

#### Should Have (P1)

**US-7.4: Delete Account**
As a user, I want to delete my account, so I can remove my data if I no longer use the service.

**Acceptance Criteria:**
- Requires password confirmation
- Shows warning about data loss
- Grace period (7 days to undo)
- Deletes all personal data
- Anonymizes analytics data

---

### Epic 8: Search & Discovery

#### Should Have (P1)

**US-8.1: Search Promotions**
As a customer, I want to search for promotions by keyword, so I can find specific types of deals.

**Acceptance Criteria:**
- Searches title, description, business name
- Shows results sorted by relevance
- Can filter by distance
- Shows "no results" state
- Search history saved

---

**US-8.2: Filter by Category**
As a customer, I want to filter promotions by category, so I can focus on what I care about.

**Acceptance Criteria:**
- Categories: Food, Retail, Entertainment, Services, Health, etc.
- Multi-select support
- Updates results in real-time
- Shows count per category

---

**US-8.3: Map View**
As a customer, I want to see promotions on a map, so I can visually explore nearby deals.

**Acceptance Criteria:**
- Shows user location
- Shows promotion markers (clustered when close)
- Can tap marker to see promotion
- Can zoom and pan
- Updates as map moves

---

**US-8.4: Save Favorites**
As a customer, I want to save promotions for later, so I can come back to them.

**Acceptance Criteria:**
- Heart icon to favorite
- Favorites section in app
- Works offline
- Shows if promotion expired

---

## 7. Core Features

### Phase 1: MVP Features (Must Have)

#### Merchant Dashboard
1. **Account Management**
   - Registration and authentication
   - Business profile setup
   - Logo upload

2. **Location Management**
   - Add/edit/remove store locations
   - Interactive map for location selection
   - Address validation

3. **Promotion Creation**
   - Basic promotion form (title, description, dates)
   - Discount configuration
   - Geofencing radius selection (100m - 50km)
   - Location targeting (all or specific)
   - Image upload

4. **Promotion Management**
   - View active/scheduled/ended promotions
   - Edit promotions
   - Activate/deactivate
   - Delete promotions

5. **Basic Analytics**
   - Total views and redemptions
   - Conversion rate
   - Per-promotion performance

6. **Redemption Verification**
   - Enter redemption code
   - Verify and mark as used

---

#### Customer App (PWA)
1. **Account Management**
   - Registration and authentication
   - Profile setup
   - Location permissions

2. **Discovery**
   - View nearby promotions list
   - Sorted by distance
   - Promotion detail view
   - Get directions

3. **Notifications**
   - Push notifications for nearby promotions
   - Basic preferences (on/off, radius)
   - Mute businesses

4. **Redemption**
   - Generate redemption code
   - Display QR code
   - Redemption history

5. **Settings**
   - Notification preferences
   - Location radius
   - Category selection
   - Quiet hours
   - Privacy settings

---

### Phase 2: Enhanced Features (Should Have)

#### Merchant Dashboard
1. **Advanced Analytics**
   - Geographic heatmaps
   - Time-based analytics
   - Distance distribution
   - Export to CSV/PDF

2. **Promotion Features**
   - Promotion templates
   - Duplicate promotions
   - Recurring promotions
   - Schedule future promotions

3. **Multi-Location Features**
   - Compare location performance
   - Location groups
   - Bulk promotion creation

4. **Team Management**
   - Add team members
   - Role-based permissions
   - Activity log

---

#### Customer App
1. **Enhanced Discovery**
   - Search functionality
   - Advanced filters (category, price, rating)
   - Map view
   - Favorites/bookmarks

2. **Personalization**
   - Recommended promotions (ML-based)
   - Promotion reminders
   - Trending promotions

3. **Social Features**
   - Share promotions
   - Refer friends
   - User reviews/ratings

---

### Phase 3: Advanced Features (Nice to Have)

1. **Loyalty Integration**
   - Points system
   - Tiered rewards
   - Birthday promotions

2. **Advanced Targeting**
   - Time-based triggers (morning commute)
   - Weather-based promotions
   - Event-based promotions

3. **Payment Integration**
   - In-app payments
   - Apple Pay / Google Pay
   - Gift cards

4. **AR Features**
   - AR navigation to stores
   - AR promotion previews

5. **Enterprise Features**
   - API access
   - Webhook integrations
   - White-label solution

---

## 8. User Experience & Flows

### Flow 1: Merchant Creates First Promotion

```
1. Login to Dashboard
   ↓
2. Welcome Screen (first time)
   - Quick tutorial overlay
   - "Create Your First Promotion" CTA
   ↓
3. Add Store Location (if not done)
   - Enter address
   - Confirm on map
   - Add details (phone, hours)
   ↓
4. Create Promotion Form
   - Enter title: "Free Coffee with Breakfast"
   - Enter description
   - Select discount type: "Free Item"
   - Upload image (optional)
   - Select location(s)
   - Set radius: 500m
   - Set dates: Today 6am - 11am
   - Set limit: 50 redemptions
   ↓
5. Preview
   - See how customers will see it
   - Edit if needed
   ↓
6. Publish
   - Confirmation message
   - "View Analytics" button
   ↓
7. Analytics Dashboard
   - Real-time views counter
   - Redemption counter
   - Map of viewer locations
```

**Success Criteria:**
- New merchant can create first promotion in < 3 minutes
- Clear guidance at each step
- No confusion about what each field does

---

### Flow 2: Customer Discovers & Redeems Promotion

```
1. Open App / PWA
   ↓
2. Grant Location Permission
   - Clear explanation: "To show you nearby deals"
   - One-time prompt
   ↓
3. Home Screen
   - List of nearby promotions
   - Sorted by distance
   - Shows: Logo, Title, Distance, Time left
   ↓
4. User walks near a coffee shop (300m away)
   ↓
5. Push Notification Received
   - "☕ Sarah's Coffee - Free Coffee with Breakfast"
   - "200m away • Ends at 11am"
   ↓
6. Tap Notification
   - Opens promotion detail
   - Shows full description
   - Shows terms
   - "Get Directions" button
   - "Redeem Now" button (prominent)
   ↓
7. Tap "Redeem Now"
   - Location check (must be within 500m)
   - Shows confirmation: "Show this code at checkout"
   - Displays QR code + text code
   - "Used this? Rate your experience"
   ↓
8. Show at Register
   - Staff scans QR or enters code
   - Code marked as used
   - Customer gets receipt
   ↓
9. Post-Redemption
   - Added to "Redemption History"
   - Shows "You saved $5"
   - Optional: Rate experience
```

**Success Criteria:**
- From notification to redemption: < 30 seconds
- QR code instantly scannable
- Works offline (cached codes)
- Clear feedback at each step

---

### Flow 3: Customer Manages Notification Settings

```
1. Tap Profile/Settings Icon
   ↓
2. Settings Screen
   - Notification Preferences
   - Location Settings
   - Privacy
   - Account
   ↓
3. Tap "Notification Preferences"
   ↓
4. Notification Settings Screen
   - Toggle: "Enable Notifications" (ON/OFF)
   - Slider: "Notification Radius" (500m - 25km)
   - Current: 5km
   - Multi-select: "Categories"
     ☑ Food & Drink
     ☑ Retail
     ☐ Entertainment
     ☑ Services
   - Quiet Hours: 10pm - 8am
   - Max per day: 10 notifications
   ↓
5. Adjust Settings
   - Move radius slider to 2km
   - Uncheck "Entertainment"
   - Change quiet hours to 11pm - 7am
   ↓
6. Tap "Save"
   - Settings saved
   - Toast: "Preferences updated"
   - Immediate effect
```

**Success Criteria:**
- All settings in one place
- Changes take effect immediately
- Clear explanations for each setting
- Can preview what notifications look like

---

### Flow 4: Merchant Views Analytics

```
1. Login to Dashboard
   ↓
2. Dashboard Home
   - Overview cards:
     • Active Promotions: 3
     • Total Views (24h): 245
     • Total Redemptions (24h): 18
     • Conversion Rate: 7.3%
   - Charts:
     • Views over time (line chart)
     • Redemptions by promotion (bar chart)
   - Top Promotions table
   ↓
3. Click on Specific Promotion
   ↓
4. Promotion Analytics Page
   - Summary cards:
     • Total Views: 1,234
     • Unique Views: 892
     • Redemptions: 87
     • Conversion: 7.0%
   - Geographic Heatmap
     • Where viewers came from
     • Average distance: 1.2km
   - Time Distribution
     • Views by hour chart
     • Peak time: 8-9am
   - Distance Distribution
     • Most viewers: 500m-1km
   - Redemption Timeline
     • When codes were redeemed
   ↓
5. Export Report
   - Select date range
   - Choose format (PDF/CSV)
   - Download
```

**Success Criteria:**
- Key metrics visible at a glance
- Insights actionable (e.g., "Most views at 8am → schedule promotions then")
- Fast loading (< 2s)
- Mobile-friendly

---

## 9. Functional Requirements

### 9.1 Authentication & Authorization

**FR-1.1: User Registration**
- System shall support email/password registration
- System shall validate email format and password strength
- System shall send verification email within 1 minute
- System shall support OAuth (Google, Apple Sign-In)

**FR-1.2: Authentication**
- System shall use JWT tokens for authentication
- Access tokens shall expire after 15 minutes
- Refresh tokens shall expire after 7 days
- System shall support "Remember Me" functionality

**FR-1.3: Authorization**
- System shall enforce role-based access control (RBAC)
- Roles: Customer, Merchant, Admin
- Merchants can only access their own data
- Customers can only access their own profile and public promotions

**FR-1.4: Password Management**
- System shall require passwords with min 8 characters
- System shall support password reset via email
- Reset links shall expire after 1 hour
- System shall hash passwords using bcrypt (cost factor 12)

---

### 9.2 Location Services

**FR-2.1: Geolocation**
- System shall request location permissions from users
- System shall use device GPS for high accuracy
- System shall fall back to IP-based location if GPS unavailable
- System shall cache last known location for offline access

**FR-2.2: Geofencing**
- System shall calculate distances using PostGIS geography type
- System shall support radius from 100m to 50km
- System shall use Haversine formula for distance calculations
- System shall update user location max every 30 seconds (battery optimization)

**FR-2.3: Proximity Matching**
- System shall find promotions within user's notification radius
- System shall sort results by distance (closest first)
- System shall use spatial indexes for performance (GIST index)
- System shall cache proximity results for 5 minutes

**FR-2.4: Background Location**
- System shall support background location tracking (with user consent)
- System shall use geofence triggers to minimize battery drain
- System shall respect OS-level location permissions
- System shall provide clear privacy controls

---

### 9.3 Promotions

**FR-3.1: Promotion Creation**
- System shall allow merchants to create promotions
- Required fields: title, description, start date, end date, radius
- Optional fields: image, terms, redemption limits, discount details
- System shall validate date ranges (end > start)

**FR-3.2: Promotion Targeting**
- System shall allow targeting all locations or specific locations
- System shall support multiple locations per promotion
- System shall validate radius between 100m and 50km
- System shall support category-based targeting

**FR-3.3: Promotion Lifecycle**
- Statuses: Draft, Scheduled, Active, Ended, Cancelled
- System shall auto-activate promotions at start time
- System shall auto-deactivate promotions at end time
- System shall allow manual activation/deactivation

**FR-3.4: Promotion Limits**
- System shall enforce max redemptions per user
- System shall enforce total redemption limit
- System shall prevent redemptions when limits reached
- System shall display remaining redemptions to merchants

---

### 9.4 Notifications

**FR-4.1: Push Notifications**
- System shall send push notifications via FCM and Web Push API
- System shall support notification delivery to iOS, Android, Web
- System shall include promotion title, business name, distance
- System shall deep-link to promotion detail on tap

**FR-4.2: Notification Triggers**
- System shall trigger notification when user enters geofence
- System shall respect quiet hours (no notifications during sleep)
- System shall respect frequency limits (max per day)
- System shall prioritize notifications if multiple triggered simultaneously

**FR-4.3: Notification Preferences**
- System shall allow users to enable/disable notifications
- System shall allow setting notification radius (500m - 25km)
- System shall allow category filtering
- System shall allow muting specific businesses

**FR-4.4: Notification Delivery**
- System shall queue notifications for async processing
- System shall retry failed notifications up to 3 times
- System shall track delivery status (sent, failed, read)
- System shall provide delivery analytics to merchants

---

### 9.5 Redemption

**FR-5.1: Code Generation**
- System shall generate unique redemption codes
- Codes shall be alphanumeric, 8-12 characters
- System shall generate QR code representation
- Codes shall be single-use only

**FR-5.2: Redemption Process**
- System shall validate user is within promotion radius
- System shall mark code as used after verification
- System shall record redemption timestamp and location
- System shall prevent duplicate redemptions

**FR-5.3: Verification**
- Merchants shall be able to verify codes via QR scan or manual entry
- System shall show promotion details upon verification
- System shall show error for invalid/expired/used codes
- System shall log all verification attempts

---

### 9.6 Analytics

**FR-6.1: Tracking**
- System shall track promotion views (total and unique)
- System shall track promotion redemptions
- System shall track user distance at view time
- System shall track notification delivery and open rates

**FR-6.2: Metrics**
- System shall calculate conversion rate (redemptions / views)
- System shall calculate average viewer distance
- System shall identify peak viewing times
- System shall provide geographic distribution data

**FR-6.3: Reporting**
- System shall provide real-time analytics dashboard
- System shall support date range filtering
- System shall allow export to CSV and PDF
- System shall aggregate data across all promotions

---

### 9.7 Data Management

**FR-7.1: Data Retention**
- System shall retain user location data for max 7 days
- System shall retain analytics data for 2 years
- System shall anonymize user data in analytics
- System shall support GDPR data export and deletion

**FR-7.2: Image Upload**
- System shall support JPG, PNG, WEBP formats
- Max file size: 5MB for logos, 10MB for promotion images
- System shall validate image dimensions
- System shall optimize and resize images automatically

**FR-7.3: Search**
- System shall support full-text search on promotions
- System shall search title, description, business name
- System shall rank results by relevance and distance
- System shall support filters (category, distance, date)

---

## 10. Non-Functional Requirements

### 10.1 Performance

**NFR-1.1: Response Time**
- API endpoints shall respond within 200ms (p95)
- Database queries shall execute within 100ms (p95)
- Promotion search shall return results within 500ms
- Page load time shall be under 2 seconds (initial load)

**NFR-1.2: Throughput**
- System shall handle 1000 concurrent users per server
- System shall process 100 notification jobs per second
- System shall handle 1M+ location updates per day

**NFR-1.3: Scalability**
- System shall scale horizontally (add more servers)
- Database shall support read replicas
- Redis cluster for distributed caching
- Stateless API design for load balancing

---

### 10.2 Availability

**NFR-2.1: Uptime**
- System shall maintain 99.5% uptime (SLA)
- Scheduled maintenance windows: max 4 hours/month
- Database shall have automated backups (daily)
- Zero-downtime deployments

**NFR-2.2: Disaster Recovery**
- Database backups retained for 30 days
- Point-in-time recovery capability
- Backup restoration time: < 1 hour
- Geographic redundancy for critical data

---

### 10.3 Security

**NFR-3.1: Data Protection**
- All data in transit shall use TLS 1.3
- All passwords shall be hashed with bcrypt
- Sensitive data at rest shall be encrypted (AES-256)
- Database connections shall use SSL

**NFR-3.2: Access Control**
- Role-based access control (RBAC)
- API rate limiting: 100 requests/minute per user
- Session timeout after 15 minutes of inactivity
- Multi-factor authentication for merchant accounts (Phase 2)

**NFR-3.3: Privacy**
- Location data shall be encrypted
- Location tracking requires explicit consent
- Users can delete their data anytime
- Compliance with GDPR, CCPA

**NFR-3.4: Vulnerability Management**
- Regular security audits (quarterly)
- Dependency scanning for vulnerabilities
- Penetration testing before launch
- Bug bounty program (post-launch)

---

### 10.4 Usability

**NFR-4.1: User Interface**
- Mobile-first responsive design
- Support iOS Safari 15+, Chrome 100+, Firefox 100+
- Touch-friendly (min 44x44px tap targets)
- WCAG 2.1 AA accessibility compliance

**NFR-4.2: User Experience**
- Onboarding shall complete in < 2 minutes
- First promotion creation: < 3 minutes
- Max 3 taps to reach any feature
- Clear error messages and help text

**NFR-4.3: Offline Support**
- PWA shall work offline for basic features
- Cached promotions accessible offline
- Queue actions for sync when online
- Offline indicator visible to user

---

### 10.5 Reliability

**NFR-5.1: Error Handling**
- Graceful degradation when services unavailable
- Automatic retry for transient failures
- Clear error messages to users
- Comprehensive error logging

**NFR-5.2: Monitoring**
- Real-time error tracking (Sentry)
- Performance monitoring (response times)
- Uptime monitoring (every 1 minute)
- Alert on-call for critical errors

**NFR-5.3: Data Integrity**
- Database transactions for critical operations
- Validation at API and database level
- Prevent duplicate redemptions (unique constraints)
- Audit log for sensitive operations

---

### 10.6 Maintainability

**NFR-6.1: Code Quality**
- TypeScript for type safety
- ESLint and Prettier for code consistency
- Min 70% unit test coverage
- Integration tests for critical paths

**NFR-6.2: Documentation**
- API documentation (OpenAPI/Swagger)
- Code comments for complex logic
- Architecture decision records (ADRs)
- Runbooks for operations

**NFR-6.3: DevOps**
- CI/CD pipeline for automated testing
- Automated deployments to staging and production
- Feature flags for gradual rollouts
- Blue-green deployment strategy

---

### 10.7 Compatibility

**NFR-7.1: Browser Support**
- Chrome 100+ (desktop and mobile)
- Safari 15+ (desktop and mobile)
- Firefox 100+
- Edge 100+

**NFR-7.2: Device Support**
- iOS 15+ (iPhone, iPad)
- Android 10+
- Tablets (responsive design)
- Progressive Web App installable

**NFR-7.3: API Versioning**
- RESTful API with versioning (v1, v2)
- Backward compatibility for 6 months
- Deprecation warnings 3 months in advance

---

## 11. Success Metrics

### 11.1 User Acquisition Metrics

| Metric | Definition | Target (Month 3) | Target (Month 6) | Target (Year 1) |
|--------|-----------|------------------|------------------|-----------------|
| Total Users (Customers) | Registered customer accounts | 5,000 | 15,000 | 50,000 |
| Total Merchants | Registered business accounts | 50 | 150 | 500 |
| App Installs (PWA) | PWA installations | 2,000 | 8,000 | 30,000 |
| Location Permissions | % users who grant location | 70% | 75% | 80% |
| Notification Opt-in | % users with notifications on | 60% | 65% | 70% |

---

### 11.2 Engagement Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Daily Active Users (DAU) | Users who open app daily | 15% of total |
| Weekly Active Users (WAU) | Users who open app weekly | 40% of total |
| Monthly Active Users (MAU) | Users who open app monthly | 60% of total |
| Avg. Session Duration | Time spent in app per session | 3-5 minutes |
| Sessions per User per Week | How often users return | 2-3 sessions |
| Promotion Views per User | Avg promotions viewed | 5-10 per week |
| Notification Open Rate | % of notifications opened | >25% |

---

### 11.3 Conversion Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| View-to-Redemption Rate | % of views that become redemptions | 5-10% |
| Redemption Rate | % of users who redeem at least once | 30% |
| Avg. Redemptions per User | Redemptions per active user | 2-3 per month |
| Time to First Redemption | Days from signup to first redemption | < 7 days |
| Repeat Redemption Rate | % of users who redeem 2+ times | 40% |

---

### 11.4 Merchant Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Active Merchants | Merchants with active promotions | 70% of total |
| Promotions Created | Avg promotions per merchant | 3-5 active |
| Promotion Success Rate | % of promotions with >10 redemptions | >50% |
| Merchant Retention (30 days) | % merchants active after 30 days | >70% |
| Merchant Retention (90 days) | % merchants active after 90 days | >50% |
| NPS (Merchant) | Net Promoter Score | >40 |

---

### 11.5 Business Metrics

| Metric | Definition | Target (Year 1) |
|--------|-----------|-----------------|
| Monthly Recurring Revenue | Subscription revenue | $50K |
| Customer Acquisition Cost | Cost to acquire one customer | <$5 |
| Merchant Acquisition Cost | Cost to acquire one merchant | <$50 |
| Lifetime Value (Customer) | Revenue per customer over time | $50 |
| Lifetime Value (Merchant) | Revenue per merchant over time | $2,000 |
| Churn Rate (Merchant) | Monthly % of merchants who cancel | <10% |

---

### 11.6 Technical Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| API Response Time (p95) | 95th percentile response time | <200ms |
| Database Query Time (p95) | 95th percentile query time | <100ms |
| Uptime | % of time service is available | >99.5% |
| Error Rate | % of requests that fail | <1% |
| Notification Delivery Rate | % of notifications successfully sent | >95% |
| PWA Load Time | Time to interactive (first load) | <2s |
| Lighthouse Score | Google Lighthouse performance | >90 |

---

### 11.7 User Satisfaction Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| NPS (Customer) | Net Promoter Score | >50 |
| App Store Rating | Average rating (if native apps) | >4.5 / 5 |
| Customer Support Tickets | Tickets per 1000 users | <50 |
| Avg. Resolution Time | Time to resolve support ticket | <24 hours |
| Feature Request Volume | Requests per month | Track trend |

---

## 12. Technical Constraints

### 12.1 Platform Constraints

- **Must** work on iOS and Android without native apps (PWA)
- **Must** support offline functionality for core features
- **Must** work on low-end devices (Android 10, iPhone 8+)
- **Must** work on slow networks (3G, throttled connections)

### 12.2 Data Constraints

- User location data **must not** be stored longer than 7 days
- Personal data **must** be encrypted at rest
- **Must** comply with GDPR (EU) and CCPA (California)
- Analytics data **must** be anonymized

### 12.3 Performance Constraints

- API response time **must** be <500ms for 95% of requests
- Location updates **must not** drain battery (adaptive intervals)
- PWA **must** load in <3s on 4G connection
- Notification delivery **must** occur within 30 seconds of trigger

### 12.4 Budget Constraints

- Infrastructure cost **must** be <$500/month for 10K users
- **Must** use open-source tech where possible
- **Should** prefer managed services over self-hosted (reduce ops cost)

### 12.5 Timeline Constraints

- MVP **must** be ready for beta testing in 12 weeks
- Phase 1 **must** be production-ready in 16 weeks
- **Must** have basic analytics from day 1

### 12.6 Integration Constraints

- **Must** integrate with major map providers (Mapbox or Google Maps)
- **Must** support FCM for push notifications
- **Should** integrate with payment providers (Stripe)
- **Should** support OAuth (Google, Apple)

### 12.7 Legal/Regulatory Constraints

- **Must** comply with GDPR (right to deletion, data portability)
- **Must** comply with CCPA (California privacy law)
- **Must** have clear Terms of Service and Privacy Policy
- **Must** obtain explicit consent for location tracking
- **Must** allow users to opt-out of notifications

---

## 13. Release Strategy

### 13.1 Development Timeline

```
Week 1-2:   Project Setup & Infrastructure
Week 3-4:   Backend Core (Auth, Database, API)
Week 5-6:   Frontend Core (Auth, UI Framework)
Week 7-8:   Location Services & Geofencing
Week 9-10:  Promotion Management & Discovery
Week 11-12: Notifications & Redemption
Week 13:    Integration Testing
Week 14:    Bug Fixes & Polish
Week 15:    Beta Testing (Internal)
Week 16:    Beta Testing (External - 50 users)
Week 17-18: Feedback & Iteration
Week 19:    Production Launch Preparation
Week 20:    Soft Launch (1 city)
```

---

### 13.2 Launch Phases

#### Phase 0: Alpha (Internal Testing)
**Duration**: 1 week
**Users**: Internal team (5-10 users)

**Goals:**
- Identify critical bugs
- Test core user flows
- Validate technical architecture

**Success Criteria:**
- All P0 features functional
- No critical bugs
- <1% error rate

---

#### Phase 1: Closed Beta
**Duration**: 2 weeks
**Users**: 50 invited users (25 merchants, 25 customers)

**Goals:**
- Test with real users
- Gather qualitative feedback
- Identify UX issues
- Validate value proposition

**Success Criteria:**
- 80% of users complete onboarding
- 50% redemption rate among customers
- <5 critical bugs reported
- NPS >30

---

#### Phase 2: Open Beta
**Duration**: 4 weeks
**Users**: 500 users (public signups, waitlist)

**Goals:**
- Test at scale
- Gather quantitative data
- Refine features based on usage patterns
- Build initial user base

**Success Criteria:**
- 70% user retention (7 days)
- 5% view-to-redemption rate
- Uptime >99%
- Positive user feedback (>4.0 rating)

---

#### Phase 3: Soft Launch
**Duration**: 8 weeks
**Users**: 5,000 users (1 city - e.g., Austin, TX)

**Goals:**
- Validate business model
- Test local market fit
- Build case studies
- Optimize operations

**Success Criteria:**
- 100+ active merchants
- 3,000+ active users
- 10% view-to-redemption rate
- 60% merchant retention (30 days)

---

#### Phase 4: Regional Launch
**Duration**: 12 weeks
**Users**: 25,000 users (5 cities)

**Goals:**
- Scale operations
- Expand merchant base
- Build brand recognition
- Optimize unit economics

**Success Criteria:**
- 500+ active merchants
- 15,000+ active users
- Profitability per city
- <$3 CAC (customer)

---

#### Phase 5: National Launch
**Duration**: 24 weeks
**Users**: 100,000+ users (nationwide)

**Goals:**
- Become the go-to platform
- Achieve network effects
- Expand feature set (Phase 2 features)
- Explore B2B partnerships

**Success Criteria:**
- 2,500+ active merchants
- 60,000+ active users
- $100K+ MRR
- Series A funding secured

---

### 13.3 Feature Rollout Strategy

**Gradual Rollout:**
- Use feature flags for controlled rollouts
- Roll out to 10% → 25% → 50% → 100% of users
- Monitor metrics at each stage
- Roll back if issues detected

**A/B Testing:**
- Test new features with 50/50 split
- Measure impact on key metrics
- Keep winning variant

**Geographic Rollout:**
- Launch city-by-city for focused marketing
- Build density in each market before expanding
- Leverage local press and partnerships

---

### 13.4 Go-to-Market Strategy

#### Customer Acquisition (Customers)

1. **Organic**
   - App Store / PWA Store listings (optimized)
   - Social media (Instagram, TikTok focus)
   - Content marketing (blog, SEO)
   - Referral program (invite friends)

2. **Paid**
   - Facebook/Instagram ads (geo-targeted)
   - Google Ads (local intent keywords)
   - Influencer partnerships (local micro-influencers)
   - Out-of-home ads (bus stops, billboards in launch city)

3. **Partnerships**
   - Shopping malls and complexes
   - Local event sponsorships
   - University partnerships
   - Chamber of Commerce

---

#### Merchant Acquisition

1. **Direct Outreach**
   - In-person visits to local businesses
   - Cold email campaigns
   - Phone calls to decision-makers

2. **Digital Marketing**
   - Google Ads (targeting "foot traffic", "local marketing")
   - LinkedIn ads (B2B targeting)
   - Webinars ("How to drive foot traffic")

3. **Partnerships**
   - POS system integrations (Square, Clover)
   - Business associations
   - Franchise networks

4. **Incentives**
   - First month free
   - Free onboarding assistance
   - Case studies and testimonials

---

## 14. Risks & Mitigation

### 14.1 Product Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low user adoption** | High | Medium | - Beta test to validate PMF<br>- Strong onboarding UX<br>- Incentivize early users |
| **Notification fatigue** | High | High | - Smart throttling<br>- Granular user controls<br>- ML-based relevance |
| **Poor merchant retention** | High | Medium | - Clear ROI dashboard<br>- Success stories<br>- Dedicated support |
| **Battery drain complaints** | Medium | Medium | - Adaptive location updates<br>- Efficient algorithms<br>- Clear battery usage disclosure |
| **Low redemption rates** | High | Medium | - Friction-free redemption<br>- Clear value prop<br>- Optimize promotion quality |

---

### 14.2 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Location accuracy issues** | High | Medium | - Use GPS + network triangulation<br>- Fallback to IP geolocation<br>- Test across devices |
| **Push notification failures** | High | Low | - Retry logic<br>- Multiple providers (FCM + Web Push)<br>- Monitoring and alerts |
| **Database performance** | Medium | Low | - PostGIS indexes<br>- Redis caching<br>- Read replicas |
| **Service downtime** | High | Low | - Uptime monitoring<br>- Auto-scaling<br>- Disaster recovery plan |
| **Security breach** | Critical | Low | - Security audits<br>- Penetration testing<br>- Bug bounty program |

---

### 14.3 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Competitor enters market** | High | Medium | - Build quickly, launch fast<br>- Focus on UX differentiation<br>- Strong merchant relationships |
| **High CAC, low LTV** | Critical | Medium | - Optimize acquisition channels<br>- Improve retention<br>- Referral programs |
| **Regulatory changes** | Medium | Low | - Legal counsel review<br>- Privacy-first design<br>- Compliance monitoring |
| **Slow merchant adoption** | High | High | - Incentivize early adopters<br>- In-person sales team<br>- Partnerships with POS providers |
| **Insufficient funding** | Critical | Low | - Bootstrap with revenue<br>- Lean operations<br>- VC pitch deck ready |

---

### 14.4 Market Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Market not ready** | Critical | Low | - Validate with beta testing<br>- Target early adopters first<br>- Educate market |
| **Privacy backlash** | High | Medium | - Transparent policies<br>- User control<br>- No data selling |
| **COVID-like event** | High | Low | - Diversify to online offers<br>- Flexible business model<br>- Financial reserves |

---

## 15. Open Questions

### Product Questions

1. **Pricing Model**
   - Should we charge merchants per promotion, per redemption, or monthly subscription?
   - What is merchants' willingness to pay?
   - Should customers ever pay for premium features?

2. **Promotion Quality Control**
   - Do we review/approve promotions before they go live?
   - How do we prevent spam or scam promotions?
   - Should there be minimum standards (e.g., min 10% discount)?

3. **Geographic Expansion**
   - Which city should we launch in first? (Austin, Portland, Nashville?)
   - What criteria define a good launch market?
   - How many merchants needed for critical mass?

4. **Social Features**
   - Should users be able to review/rate businesses or promotions?
   - Should there be a social feed or sharing capabilities?
   - Could this lead to negative experiences?

5. **Exclusivity**
   - Should promotions be LoCo-exclusive (not available elsewhere)?
   - How do we incentivize this?

---

### Technical Questions

1. **Native Apps**
   - Will PWA be sufficient long-term?
   - When should we build native iOS/Android apps?
   - What features require native?

2. **Background Location**
   - How aggressive should background location tracking be?
   - Different strategies for iOS vs Android?
   - Impact on battery and user trust?

3. **Offline Support**
   - How much functionality should work offline?
   - How do we sync when back online?
   - Edge cases and conflict resolution?

4. **Scalability**
   - At what user count do we need to revisit architecture?
   - When to introduce microservices?
   - Database sharding strategy?

---

### Business Questions

1. **Go-to-Market**
   - Should we focus on merchants or customers first (chicken-egg problem)?
   - B2B sales team or self-serve onboarding?
   - How much should we spend on customer acquisition?

2. **Partnerships**
   - Should we partner with existing loyalty programs?
   - Integration with POS systems - priority?
   - Revenue share models with partners?

3. **Competitive Positioning**
   - How do we differentiate from Groupon, Yelp, etc.?
   - Are we a "daily deals" app or something different?
   - What's our unique value proposition?

4. **Monetization**
   - When should we introduce paid plans?
   - What features are worth paying for?
   - Can we be profitable without ads?

---

### User Experience Questions

1. **Onboarding**
   - How many steps is too many?
   - Should we require location permission immediately or later?
   - Demo mode to show value before signup?

2. **Notifications**
   - What's the right default notification radius?
   - How many notifications per day is too many?
   - Should we have "smart" vs "all" notification modes?

3. **Discovery**
   - List view vs map view - which is primary?
   - How do we balance personalization with serendipity?
   - Should we show promotions that are slightly out of range?

---

## Appendices

### Appendix A: Glossary

- **CAC**: Customer Acquisition Cost
- **DAU**: Daily Active Users
- **FCM**: Firebase Cloud Messaging
- **Geofence**: Virtual perimeter around a real-world location
- **LTV**: Lifetime Value (revenue from a customer over their lifetime)
- **MAU**: Monthly Active Users
- **MVP**: Minimum Viable Product
- **NPS**: Net Promoter Score (measure of customer satisfaction)
- **PMF**: Product-Market Fit
- **PWA**: Progressive Web App
- **WAU**: Weekly Active Users

### Appendix B: References

- **Competitor Analysis**: Groupon, Yelp, Foursquare, Google Maps, Facebook Local
- **Market Research**: Statista, Pew Research (mobile usage), Local Commerce Studies
- **Technical Standards**: W3C Geolocation API, Web Push Protocol, PWA Best Practices

### Appendix C: Related Documents

- [ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md) - Technical architecture
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Code organization
- [QUICK_START.md](./QUICK_START.md) - Developer setup guide
- [README.md](./README.md) - Project overview

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | Product Team | Initial PRD |

---

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Prioritize features for MVP
3. Answer open questions
4. Create detailed wireframes/mockups
5. Begin technical implementation (see ARCHITECTURE_PLAN.md)

---

**Approval Signatures:**

Product Owner: _________________ Date: _______

Engineering Lead: _________________ Date: _______

Design Lead: _________________ Date: _______
