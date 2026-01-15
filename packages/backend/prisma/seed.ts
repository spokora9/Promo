import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.discoveryExposure.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.promotionRedemption.deleteMany();
  await prisma.promotionView.deleteMany();
  await prisma.userShopPreference.deleteMany();
  await prisma.userLocation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.promotionLocation.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.shopLocation.deleteMany();
  await prisma.shop.deleteMany();

  // Hash password for test accounts
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create test shops
  console.log('🏪 Creating test shops...');

  const sarahsCoffee = await prisma.shop.create({
    data: {
      name: "Sarah's Coffee Shop",
      email: 'sarah@coffeeshop.com',
      passwordHash,
      description: 'Artisan coffee and fresh pastries in the heart of downtown',
      category: 'Food & Beverage',
      logoUrl: 'https://via.placeholder.com/150',
      locations: {
        create: [
          {
            name: 'Downtown Location',
            address: '123 Main Street',
            city: 'Austin',
            state: 'TX',
            country: 'USA',
            postalCode: '78701',
            latitude: 30.2672,
            longitude: -97.7431,
            phone: '(555) 123-4567',
          },
          {
            name: 'North Campus Location',
            address: '456 University Ave',
            city: 'Austin',
            state: 'TX',
            country: 'USA',
            postalCode: '78705',
            latitude: 30.2849,
            longitude: -97.7341,
            phone: '(555) 123-4568',
          },
        ],
      },
    },
    include: {
      locations: true,
    },
  });

  const mariosPizza = await prisma.shop.create({
    data: {
      name: "Mario's Pizza",
      email: 'mario@mariospizza.com',
      passwordHash,
      description: 'Authentic Italian pizza made with love',
      category: 'Food & Beverage',
      logoUrl: 'https://via.placeholder.com/150',
      locations: {
        create: {
          name: 'Main Location',
          address: '789 Oak Street',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          postalCode: '78702',
          latitude: 30.2620,
          longitude: -97.7257,
          phone: '(555) 234-5678',
        },
      },
    },
    include: {
      locations: true,
    },
  });

  const fitGym = await prisma.shop.create({
    data: {
      name: 'Fit Gym',
      email: 'hello@fitgym.com',
      passwordHash,
      description: '24/7 fitness center with modern equipment',
      category: 'Health & Fitness',
      logoUrl: 'https://via.placeholder.com/150',
      locations: {
        create: {
          name: 'Central Gym',
          address: '321 Fitness Blvd',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          postalCode: '78703',
          latitude: 30.2770,
          longitude: -97.7480,
          phone: '(555) 345-6789',
        },
      },
    },
    include: {
      locations: true,
    },
  });

  console.log('✅ Created 3 shops with locations');

  // Create test promotions
  console.log('🎯 Creating test promotions...');

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.promotion.create({
    data: {
      shopId: sarahsCoffee.id,
      title: 'Free Coffee with Breakfast',
      description:
        'Buy any breakfast item and get a free coffee of any size. Valid at all locations.',
      termsConditions: 'Valid Mon-Fri, 7am-11am. One per customer per day.',
      discountType: 'free_item',
      discountValue: 0,
      imageUrl: 'https://via.placeholder.com/400x300',
      targetType: 'all_locations',
      radiusMeters: 500,
      startDate: now,
      endDate: nextWeek,
      isActive: true,
      maxRedemptionsPerUser: 1,
      maxTotalRedemptions: 100,
      locations: {
        create: sarahsCoffee.locations.map((loc) => ({
          locationId: loc.id,
        })),
      },
    },
  });

  await prisma.promotion.create({
    data: {
      shopId: sarahsCoffee.id,
      title: '30% Off All Pastries',
      description: 'Sweet deal! Get 30% off all pastries, cakes, and desserts.',
      termsConditions: 'Valid all day. Cannot be combined with other offers.',
      discountType: 'percentage',
      discountValue: 30,
      imageUrl: 'https://via.placeholder.com/400x300',
      targetType: 'specific_locations',
      radiusMeters: 1000,
      startDate: now,
      endDate: tomorrow,
      isActive: true,
      maxRedemptionsPerUser: 1,
      locations: {
        create: {
          locationId: sarahsCoffee.locations[0].id, // Only downtown
        },
      },
    },
  });

  await prisma.promotion.create({
    data: {
      shopId: mariosPizza.id,
      title: '25% Off All Orders',
      description: 'Get 25% off your entire order. Dine-in, takeout, or delivery!',
      termsConditions: 'Minimum order $15. Valid for 7 days.',
      discountType: 'percentage',
      discountValue: 25,
      imageUrl: 'https://via.placeholder.com/400x300',
      targetType: 'all_locations',
      radiusMeters: 2000,
      startDate: now,
      endDate: nextWeek,
      isActive: true,
      maxRedemptionsPerUser: 2,
      maxTotalRedemptions: 200,
      locations: {
        create: mariosPizza.locations.map((loc) => ({
          locationId: loc.id,
        })),
      },
    },
  });

  // Discovery offer
  await prisma.promotion.create({
    data: {
      shopId: fitGym.id,
      title: '7 Days Free Trial - Discovery Offer',
      description: 'Try us free for 7 days! Full access to all equipment and classes.',
      termsConditions: 'New members only. Discovery mode exclusive.',
      discountType: 'free_item',
      discountValue: 0,
      imageUrl: 'https://via.placeholder.com/400x300',
      targetType: 'all_locations',
      radiusMeters: 5000,
      startDate: now,
      endDate: nextWeek,
      isActive: true,
      isDiscoveryOffer: true,
      discoveryBoost: 100,
      maxDiscoveryExposures: 10,
      autoConvertAfterExposures: true,
      locations: {
        create: fitGym.locations.map((loc) => ({
          locationId: loc.id,
        })),
      },
    },
  });

  console.log('✅ Created 4 promotions');

  // Create test users
  console.log('👥 Creating test users...');

  const testUser1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash,
      pushNotificationsEnabled: true,
      discoveryModeEnabled: true,
      discoveryModeType: 'active',
      location: {
        create: {
          latitude: 30.2672,
          longitude: -97.7431,
          accuracyMeters: 10,
        },
      },
    },
  });

  const testUser2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      passwordHash,
      pushNotificationsEnabled: true,
      discoveryModeEnabled: true,
      discoveryModeType: 'silent',
      location: {
        create: {
          latitude: 30.2620,
          longitude: -97.7257,
          accuracyMeters: 15,
        },
      },
    },
  });

  console.log('✅ Created 2 test users');

  // Create some test data for analytics
  console.log('📊 Creating test analytics data...');

  const promotions = await prisma.promotion.findMany({
    take: 2,
  });

  // Create some views
  for (let i = 0; i < 10; i++) {
    await prisma.promotionView.create({
      data: {
        promotionId: promotions[0].id,
        userId: i % 2 === 0 ? testUser1.id : testUser2.id,
        userDistanceMeters: Math.floor(Math.random() * 1000) + 100,
      },
    });
  }

  console.log('✅ Created test analytics data');

  console.log('\n✨ Seed completed successfully!\n');
  console.log('📝 Test Accounts:');
  console.log('   Shops:');
  console.log('     - sarah@coffeeshop.com / password123');
  console.log('     - mario@mariospizza.com / password123');
  console.log('     - hello@fitgym.com / password123');
  console.log('   Users:');
  console.log('     - john@example.com / password123');
  console.log('     - jane@example.com / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
