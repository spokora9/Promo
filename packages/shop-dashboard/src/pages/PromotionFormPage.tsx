import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promotionsApi, CreatePromotionInput, Promotion } from '../lib/promotions-api';
import { locationsApi, Location } from '../lib/locations-api';
import { getErrorMessage } from '../lib/api';

export function PromotionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<CreatePromotionInput>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    targetAllLocations: true,
    targetLocationIds: [],
    radiusMeters: 5000,
    maxRedemptionsPerUser: undefined,
    maxTotalRedemptions: undefined,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isDiscoveryOffer: false,
    terms: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
    if (isEdit && id) {
      loadPromotion(id);
    }
  }, [id, isEdit]);

  const loadLocations = async () => {
    try {
      const response = await locationsApi.getAll();
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    }
  };

  const loadPromotion = async (promotionId: string) => {
    try {
      setLoadingData(true);
      const response = await promotionsApi.getById(promotionId);
      const promotion: Promotion = response.data;

      setFormData({
        title: promotion.title,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        targetAllLocations: promotion.targetAllLocations,
        targetLocationIds: promotion.targetLocationIds,
        radiusMeters: promotion.radiusMeters,
        maxRedemptionsPerUser: promotion.maxRedemptionsPerUser || undefined,
        maxTotalRedemptions: promotion.maxTotalRedemptions || undefined,
        startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
        endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
        isDiscoveryOffer: promotion.isDiscoveryOffer,
        terms: promotion.terms || '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (isEdit && id) {
        await promotionsApi.update(id, submitData);
      } else {
        await promotionsApi.create(submitData);
      }

      navigate('/promotions');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreatePromotionInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLocation = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetLocationIds: prev.targetLocationIds?.includes(locationId)
        ? prev.targetLocationIds.filter((id) => id !== locationId)
        : [...(prev.targetLocationIds || []), locationId],
    }));
  };

  if (loadingData) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/promotions')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Promotion' : 'Create New Promotion'}
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 20% Off All Items"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your promotion..."
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => updateField('discountType', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="bogo">Buy One Get One</option>
                  <option value="freebie">Free Item</option>
                </select>
              </div>

              {formData.discountType !== 'bogo' && formData.discountType !== 'freebie' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => updateField('discountValue', parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={formData.discountType === 'percentage' ? '20' : '5.00'}
                  />
                </div>
              )}
            </div>

            {/* Location Targeting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Locations *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.targetAllLocations}
                    onChange={() => updateField('targetAllLocations', true)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">All Locations</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!formData.targetAllLocations}
                    onChange={() => updateField('targetAllLocations', false)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Specific Locations</span>
                </label>

                {!formData.targetAllLocations && (
                  <div className="ml-6 mt-2 space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {locations.map((location) => (
                      <label key={location.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.targetLocationIds?.includes(location.id)}
                          onChange={() => toggleLocation(location.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {location.name} - {location.city}
                        </span>
                      </label>
                    ))}
                    {locations.length === 0 && (
                      <p className="text-sm text-gray-500">No locations available. Please create locations first.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geofencing Radius (meters) *
              </label>
              <select
                value={formData.radiusMeters}
                onChange={(e) => updateField('radiusMeters', parseInt(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="300">300m (~984 ft)</option>
                <option value="500">500m (~0.3 mi)</option>
                <option value="1000">1km (~0.6 mi)</option>
                <option value="5000">5km (~3.1 mi)</option>
                <option value="10000">10km (~6.2 mi)</option>
                <option value="25000">25km (~15.5 mi)</option>
                <option value="50000">50km (~31 mi)</option>
              </select>
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Redemption Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Redemptions Per User (optional)
                </label>
                <input
                  type="number"
                  value={formData.maxRedemptionsPerUser || ''}
                  onChange={(e) => updateField('maxRedemptionsPerUser', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Total Redemptions (optional)
                </label>
                <input
                  type="number"
                  value={formData.maxTotalRedemptions || ''}
                  onChange={(e) => updateField('maxTotalRedemptions', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            {/* Discovery Offer */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDiscoveryOffer"
                checked={formData.isDiscoveryOffer}
                onChange={(e) => updateField('isDiscoveryOffer', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isDiscoveryOffer" className="ml-2 text-sm text-gray-700">
                This is a Discovery Offer (shown to users in discovery mode)
              </label>
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions (optional)
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => updateField('terms', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Additional terms and conditions..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/promotions')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Promotion' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
