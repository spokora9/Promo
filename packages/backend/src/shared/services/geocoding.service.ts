import axios from 'axios';
import { BadRequestError } from '../utils/errors';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export class GeocodingService {
  // Geocode address to coordinates using Google Maps API
  static async geocodeAddress(address: string): Promise<GeocodeResult> {
    if (!GOOGLE_MAPS_API_KEY) {
      // Fallback: return mock coordinates if API key not configured
      console.warn('Google Maps API key not configured, using mock geocoding');
      return {
        latitude: 30.2672,
        longitude: -97.7431,
        formattedAddress: address,
      };
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new BadRequestError('Unable to geocode address');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      // Extract address components
      const addressComponents = result.address_components;
      const city = addressComponents.find((c: any) =>
        c.types.includes('locality')
      )?.long_name;
      const state = addressComponents.find((c: any) =>
        c.types.includes('administrative_area_level_1')
      )?.short_name;
      const country = addressComponents.find((c: any) =>
        c.types.includes('country')
      )?.short_name;
      const postalCode = addressComponents.find((c: any) =>
        c.types.includes('postal_code')
      )?.long_name;

      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
        city,
        state,
        country,
        postalCode,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadRequestError('Geocoding service error');
      }
      throw error;
    }
  }

  // Reverse geocode coordinates to address
  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<GeocodeResult> {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured, using mock reverse geocoding');
      return {
        latitude,
        longitude,
        formattedAddress: `${latitude}, ${longitude}`,
      };
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new BadRequestError('Unable to reverse geocode coordinates');
      }

      const result = response.data.results[0];

      // Extract address components
      const addressComponents = result.address_components;
      const city = addressComponents.find((c: any) =>
        c.types.includes('locality')
      )?.long_name;
      const state = addressComponents.find((c: any) =>
        c.types.includes('administrative_area_level_1')
      )?.short_name;
      const country = addressComponents.find((c: any) =>
        c.types.includes('country')
      )?.short_name;
      const postalCode = addressComponents.find((c: any) =>
        c.types.includes('postal_code')
      )?.long_name;

      return {
        latitude,
        longitude,
        formattedAddress: result.formatted_address,
        city,
        state,
        country,
        postalCode,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadRequestError('Reverse geocoding service error');
      }
      throw error;
    }
  }

  // Calculate distance between two points (in meters) using Haversine formula
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
