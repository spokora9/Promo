import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { locationsApi, CreateLocationInput, Location } from '../lib/locations-api';
import { getErrorMessage } from '../lib/api';

export function LocationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateLocationInput>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(isEdit);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadLocation(id);
    }
  }, [id, isEdit]);

  const loadLocation = async (locationId: string) => {
    try {
      setLoadingLocation(true);
      const response = await locationsApi.getById(locationId);
      const location: Location = response.data;

      setFormData({
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state || '',
        country: location.country,
        postalCode: location.postalCode || '',
        latitude: location.latitude,
        longitude: location.longitude,
        phone: location.phone || '',
        isActive: location.isActive,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleGeocode = async () => {
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`;

    if (!fullAddress.trim()) {
      alert('Please enter an address first');
      return;
    }

    try {
      setGeocoding(true);
      setError(null);
      const response = await locationsApi.geocode(fullAddress);
      const result = response.data;

      setFormData({
        ...formData,
        latitude: result.latitude,
        longitude: result.longitude,
        ...(result.city && { city: result.city }),
        ...(result.state && { state: result.state }),
        ...(result.country && { country: result.country }),
        ...(result.postalCode && { postalCode: result.postalCode }),
      });

      alert('Address geocoded successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.latitude === 0 && formData.longitude === 0) {
      alert('Please geocode the address first or enter latitude/longitude manually');
      return;
    }

    try {
      setLoading(true);

      if (isEdit && id) {
        await locationsApi.update(id, formData);
      } else {
        await locationsApi.create(formData);
      }

      navigate('/locations');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreateLocationInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loadingLocation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/locations')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Location' : 'Add New Location'}
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Downtown Branch"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123 Main St"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Austin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="TX"
                />
              </div>
            </div>

            {/* Country & Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="USA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="78701"
                />
              </div>
            </div>

            {/* Geocode Button */}
            <div>
              <button
                type="button"
                onClick={handleGeocode}
                disabled={geocoding}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                {geocoding ? 'Geocoding...' : '📍 Geocode Address'}
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Click to automatically get latitude/longitude from address
              </p>
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => updateField('latitude', parseFloat(e.target.value))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="30.2672"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => updateField('longitude', parseFloat(e.target.value))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="-97.7431"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Location is active
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/locations')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Location' : 'Add Location'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
