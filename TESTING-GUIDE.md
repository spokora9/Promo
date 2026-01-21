# LoCo Testing Guide - Sprints 1-3

This guide will walk you through testing all features implemented in Sprints 1-3.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Terminal access

## Step 1: Start Infrastructure Services

Start PostgreSQL (with PostGIS) and Redis:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

You should see both `loco-postgres` and `loco-redis` running.

## Step 2: Setup Database

Run Prisma migrations to create all database tables:

```bash
cd packages/backend
npx prisma migrate dev
```

This will create all tables needed for:
- Authentication (Shop, Customer, RefreshToken)
- Locations (ShopLocation with PostGIS geometry)
- Promotions (with geofencing support)

## Step 3: Start Backend Server

From the `packages/backend` directory:

```bash
npm run dev
```

**Expected output:**
- Server should start on `http://localhost:3000`
- You should see: "Server listening on http://0.0.0.0:3000"

**Keep this terminal open** - the backend needs to keep running.

## Step 4: Start Shop Dashboard

Open a **new terminal** and run:

```bash
cd packages/shop-dashboard
npm run dev
```

**Expected output:**
- Dashboard should start on `http://localhost:4000`
- You should see: "Local: http://localhost:4000/"

**Keep this terminal open** too.

## Step 5: Testing Sprint 1 - Authentication System

### 5.1 Shop Registration

1. Open browser to `http://localhost:4000`
2. You should see the login page
3. Click "Create new account"
4. Fill out registration form:
   - **Business Name:** Test Coffee Shop
   - **Email:** test@coffeeshop.com
   - **Password:** Password123!
   - **Phone:** (555) 123-4567
   - **Category:** Select "Food & Beverage"
5. Click "Create Account"

**✅ Success:** You should be redirected to the dashboard

### 5.2 Logout & Login

1. Find the logout button (usually in header/profile menu)
2. Click logout - you should return to login page
3. Login with your credentials:
   - Email: test@coffeeshop.com
   - Password: Password123!
4. Click "Sign In"

**✅ Success:** You should be redirected back to dashboard

### 5.3 Profile Management

1. Navigate to Profile page (usually in sidebar or header menu)
2. Update shop information:
   - Change business name
   - Update description
   - Change phone number
3. Click "Save Changes"

**✅ Success:** You should see a success message and changes should persist after refresh

## Step 6: Testing Sprint 2 - Location Management

### 6.1 Add First Location

1. Navigate to "Locations" page
2. Click "Add Location" or "Create Location"
3. Fill out the form:
   - **Name:** Downtown Location
   - **Address:** 123 Main St, San Francisco, CA 94102
   - **Phone:** (555) 123-4567
   - **Latitude:** 37.7749 (San Francisco)
   - **Longitude:** -122.4194
4. Click "Save" or "Create Location"

**✅ Success:** Location should appear in the locations list

### 6.2 Add Second Location

1. Click "Add Location" again
2. Fill out:
   - **Name:** Sunset District
   - **Address:** 456 Ocean Ave, San Francisco, CA 94112
   - **Phone:** (555) 987-6543
   - **Latitude:** 37.7599
   - **Longitude:** -122.4908
3. Save the location

**✅ Success:** Both locations should be visible

### 6.3 Edit Location

1. Click "Edit" on any location
2. Change the name or phone number
3. Click "Save"

**✅ Success:** Changes should be reflected in the list

### 6.4 Toggle Location Active Status

1. Find the "Active" toggle or status button
2. Click to deactivate a location
3. Toggle it back to active

**✅ Success:** Status should change visually (usually with color change)

## Step 7: Testing Sprint 3 - Promotion Management

### 7.1 Create Percentage Discount Promotion

1. Navigate to "Promotions" page (from dashboard or sidebar)
2. Click "Create Promotion" or "New Promotion"
3. Fill out the form:
   - **Title:** "Happy Hour Special"
   - **Description:** "Get 20% off all drinks from 3-6 PM"
   - **Discount Type:** Percentage
   - **Discount Value:** 20
   - **Target Locations:** Select "All Locations"
   - **Geofencing Radius:** 1 km
   - **Start Date:** Today's date at 3:00 PM
   - **End Date:** Tomorrow at 6:00 PM
   - **Max Redemptions Per User:** 3
   - **Max Total Redemptions:** 100
   - **Is Discovery Offer:** Unchecked
   - **Terms:** "Valid only for beverages. Cannot be combined with other offers."
4. Click "Save" or "Create Promotion"

**✅ Success:** Promotion should appear in the list with "draft" or "active" status

### 7.2 Create Fixed Amount Discount

1. Create another promotion:
   - **Title:** "$5 Off Lunch Combo"
   - **Description:** "Save $5 on any lunch combo meal"
   - **Discount Type:** Fixed Amount
   - **Discount Value:** 5
   - **Target Locations:** Select specific location (Downtown Location)
   - **Geofencing Radius:** 500m
   - **Start Date:** Today
   - **End Date:** 7 days from now
   - **Is Discovery Offer:** Checked ✓
2. Save promotion

**✅ Success:** Promotion should show discovery badge

### 7.3 Create BOGO Promotion

1. Create a third promotion:
   - **Title:** "Buy One Get One Free"
   - **Description:** "Buy any sandwich, get a second one free"
   - **Discount Type:** Buy One Get One (BOGO)
   - **Discount Value:** (field should be hidden or disabled)
   - **Target Locations:** All Locations
   - **Geofencing Radius:** 2 km
   - **Start Date:** Today
   - **End Date:** 14 days from now
3. Save promotion

**✅ Success:** Promotion created without requiring discount value

### 7.4 Create Freebie Promotion

1. Create a fourth promotion:
   - **Title:** "Free Cookie with Purchase"
   - **Description:** "Get a free chocolate chip cookie with any purchase"
   - **Discount Type:** Freebie
   - **Discount Value:** (should be hidden)
   - **Target Locations:** Specific location (Sunset District)
   - **Geofencing Radius:** 800m
   - **Start Date:** Today
   - **End Date:** 30 days from now
4. Save promotion

**✅ Success:** You should now have 4 promotions total

### 7.5 View Promotions List

Review your promotions list page:

**✅ Check for:**
- All 4 promotions displayed
- Status badges (color-coded)
- Discovery offer badge on the $5 Off promotion
- Correct discount display ("20% off", "$5 off", "BOGO", "Free")
- Redemption counts (should be 0/100, 0/unlimited, etc.)

### 7.6 Edit Promotion

1. Click "Edit" on the Happy Hour promotion
2. Change the discount value from 20% to 25%
3. Change the end date to 3 days later
4. Save changes

**✅ Success:** Changes should be reflected in the list

### 7.7 Pause/Activate Promotion

1. Find an active promotion
2. Click "Pause" button
3. Status should change to "Paused" (usually yellow badge)
4. Click "Activate" to reactivate it
5. Status should return to "Active" (usually green badge)

**✅ Success:** Status changes properly with button toggles

### 7.8 View Promotion Stats

1. Click on a promotion or find "View Stats" button
2. You should see statistics like:
   - Total redemptions: 0
   - Unique users: 0
   - Revenue impact: $0

**✅ Success:** Stats page displays (values will be zero since no redemptions yet)

### 7.9 Delete Protection Test

For this test, you'll need to check that the delete button works for promotions without redemptions.

1. Try to delete one of your promotions (that has 0 redemptions)
2. Confirm the deletion

**✅ Success:** Promotion should be deleted from the list

*Note: Once Sprint 5 is implemented and promotions have redemptions, the delete should be blocked with a message suggesting to pause instead.*

## Step 8: Testing PostGIS Geofencing (Backend API)

This tests the geolocation features using curl or Postman.

### 8.1 Get Nearby Promotions API

Open a terminal and run:

```bash
# Test getting nearby promotions for Downtown SF
curl "http://localhost:3000/api/v1/promotions/nearby?latitude=37.7749&longitude=-122.4194&radiusMeters=5000"
```

**✅ Success:** You should get a JSON response with:
- Active promotions that are within range
- Distance calculation for each promotion
- Shop and location details

### 8.2 Test Different Locations

```bash
# Test from Sunset District location
curl "http://localhost:3000/api/v1/promotions/nearby?latitude=37.7599&longitude=-122.4908&radiusMeters=5000"
```

**✅ Success:** You should see different promotions or same promotions with different distances

### 8.3 Test with Smaller Radius

```bash
# Small radius - should return fewer results
curl "http://localhost:3000/api/v1/promotions/nearby?latitude=37.7749&longitude=-122.4194&radiusMeters=500"
```

**✅ Success:** Should only return promotions within 500m

## Common Issues & Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** Make sure Docker containers are running: `docker-compose ps`

### Issue: "Port 3000 already in use"
**Solution:** Kill any existing process on port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "Prisma schema not found"
**Solution:** Make sure you're in the `packages/backend` directory when running Prisma commands

### Issue: "Login returns 401 Unauthorized"
**Solution:**
- Check that email/password are correct
- Verify backend is running and connected to database
- Check browser console for errors

### Issue: "Locations not saving"
**Solution:**
- Verify PostGIS extension is enabled (it should be with postgis/postgis image)
- Check backend logs for validation errors
- Ensure latitude/longitude are valid numbers

### Issue: "Promotions page shows error"
**Solution:**
- Check backend logs for errors
- Verify you're logged in as a shop
- Ensure backend API is reachable at localhost:3000

## What to Look For (Quality Checklist)

### Authentication ✅
- [ ] Can register new shop account
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Can update profile
- [ ] Token persists across page refreshes
- [ ] Protected routes redirect to login when not authenticated

### Locations ✅
- [ ] Can create locations with lat/long
- [ ] Can edit location details
- [ ] Can toggle active/inactive status
- [ ] Locations list displays all locations
- [ ] Location data persists

### Promotions ✅
- [ ] Can create all 4 discount types (percentage, fixed, BOGO, freebie)
- [ ] Can target all locations or specific locations
- [ ] Can set geofencing radius (300m to 50km)
- [ ] Can set start and end dates
- [ ] Can set redemption limits (optional)
- [ ] Discovery offer checkbox works
- [ ] Can edit promotions
- [ ] Can pause/activate promotions
- [ ] Can delete promotions (without redemptions)
- [ ] Status badges display correctly
- [ ] API returns nearby promotions based on geolocation

## Next Steps After Testing

Once you've verified everything works:

1. **Fix any bugs** you discover
2. **Test edge cases** (invalid input, long text, etc.)
3. **Review UI/UX** - does it feel good to use?
4. **Check mobile responsiveness** (resize browser)
5. **Ready for Sprint 4** - Discovery & Geolocation features

## Need Help?

If you encounter issues during testing:
1. Check backend terminal for error logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database migrations ran successfully

Happy testing! 🚀
