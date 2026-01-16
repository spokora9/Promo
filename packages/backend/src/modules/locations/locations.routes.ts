import { FastifyInstance } from 'fastify';
import { LocationsController } from './locations.controller';
import { authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

export async function locationsRoutes(fastify: FastifyInstance) {
  // Shop location management routes (protected - shop only)
  fastify.get('/shops/locations', {
    preHandler: [authenticateShop],
    handler: LocationsController.getShopLocations,
  });

  fastify.get('/shops/locations/:id', {
    preHandler: [authenticateShop],
    handler: LocationsController.getLocationById,
  });

  fastify.post('/shops/locations', {
    preHandler: [authenticateShop],
    handler: LocationsController.createLocation,
  });

  fastify.put('/shops/locations/:id', {
    preHandler: [authenticateShop],
    handler: LocationsController.updateLocation,
  });

  fastify.delete('/shops/locations/:id', {
    preHandler: [authenticateShop],
    handler: LocationsController.deleteLocation,
  });

  // Geocoding utility (protected - shop only)
  fastify.post('/geocode', {
    preHandler: [authenticateShop],
    handler: LocationsController.geocodeAddress,
  });

  // Public/customer routes
  fastify.get('/locations/nearby', LocationsController.getNearbyLocations);
}
