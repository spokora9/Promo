import { prisma } from '../../shared/config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../shared/utils/errors';
import { GeocodingService } from '../../shared/services/geocoding.service';
import { CreateLocationInput, UpdateLocationInput } from './locations.schema';

export class LocationsService {
  // Get all locations for a shop
  static async getShopLocations(shopId: string) {
    const locations = await prisma.shopLocation.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });

    return locations;
  }

  // Get a single location by ID
  static async getLocationById(locationId: string, shopId: string) {
    const location = await prisma.shopLocation.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    // Verify ownership
    if (location.shopId !== shopId) {
      throw new ForbiddenError('You do not have permission to access this location');
    }

    return location;
  }

  // Create a new location
  static async createLocation(shopId: string, data: CreateLocationInput) {
    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    // Create location
    const location = await prisma.shopLocation.create({
      data: {
        shopId,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        isActive: data.isActive ?? true,
      },
    });

    return location;
  }

  // Update a location
  static async updateLocation(
    locationId: string,
    shopId: string,
    data: UpdateLocationInput
  ) {
    // Verify location exists and belongs to shop
    await this.getLocationById(locationId, shopId);

    // Update location
    const location = await prisma.shopLocation.update({
      where: { id: locationId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.city && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.country && { country: data.country }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return location;
  }

  // Delete a location
  static async deleteLocation(locationId: string, shopId: string) {
    // Verify location exists and belongs to shop
    await this.getLocationById(locationId, shopId);

    // Check if location has active promotions
    const activePromotions = await prisma.promotion.count({
      where: {
        shopId,
        status: 'active',
        OR: [
          { targetAllLocations: true },
          {
            targetLocationIds: {
              has: locationId,
            },
          },
        ],
      },
    });

    if (activePromotions > 0) {
      throw new BadRequestError(
        'Cannot delete location with active promotions. Please deactivate promotions first.'
      );
    }

    // Delete location
    await prisma.shopLocation.delete({
      where: { id: locationId },
    });

    return { message: 'Location deleted successfully' };
  }

  // Geocode an address
  static async geocodeAddress(address: string) {
    const result = await GeocodingService.geocodeAddress(address);
    return result;
  }

  // Get nearby locations (for customers)
  static async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000
  ) {
    // Using Prisma with raw SQL for PostGIS distance calculation
    const locations = await prisma.$queryRaw<any[]>`
      SELECT
        sl.*,
        s.name as "shopName",
        s."logoUrl" as "shopLogoUrl",
        ST_Distance(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography
        ) as distance
      FROM "ShopLocation" sl
      JOIN "Shop" s ON s.id = sl."shopId"
      WHERE
        sl."isActive" = true
        AND s.status = 'active'
        AND ST_DWithin(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography,
          ${radiusMeters}
        )
      ORDER BY distance ASC
      LIMIT 50
    `;

    return locations;
  }
}
