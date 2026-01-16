import { FastifyRequest, FastifyReply } from 'fastify';
import { LocationsService } from './locations.service';
import {
  createLocationSchema,
  updateLocationSchema,
  geocodeAddressSchema,
} from './locations.schema';

export class LocationsController {
  // Get all locations for the authenticated shop
  static async getShopLocations(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const locations = await LocationsService.getShopLocations(shopId);

    return reply.send({
      success: true,
      data: locations,
    });
  }

  // Get a single location by ID
  static async getLocationById(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const location = await LocationsService.getLocationById(id, shopId);

    return reply.send({
      success: true,
      data: location,
    });
  }

  // Create a new location
  static async createLocation(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const validatedData = createLocationSchema.parse(request.body);

    const location = await LocationsService.createLocation(shopId, validatedData);

    return reply.code(201).send({
      success: true,
      data: location,
    });
  }

  // Update a location
  static async updateLocation(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };
    const validatedData = updateLocationSchema.parse(request.body);

    const location = await LocationsService.updateLocation(id, shopId, validatedData);

    return reply.send({
      success: true,
      data: location,
    });
  }

  // Delete a location
  static async deleteLocation(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const result = await LocationsService.deleteLocation(id, shopId);

    return reply.send({
      success: true,
      ...result,
    });
  }

  // Geocode an address
  static async geocodeAddress(request: FastifyRequest, reply: FastifyReply) {
    const { address } = geocodeAddressSchema.parse(request.body);
    const result = await LocationsService.geocodeAddress(address);

    return reply.send({
      success: true,
      data: result,
    });
  }

  // Get nearby locations (for customers)
  static async getNearbyLocations(request: FastifyRequest, reply: FastifyReply) {
    const { latitude, longitude, radius } = request.query as {
      latitude: string;
      longitude: string;
      radius?: string;
    };

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radiusMeters = radius ? parseInt(radius) : 5000;

    if (isNaN(lat) || isNaN(lon)) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid latitude or longitude',
      });
    }

    const locations = await LocationsService.getNearbyLocations(
      lat,
      lon,
      radiusMeters
    );

    return reply.send({
      success: true,
      data: locations,
    });
  }
}
