import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promotionsApi, Promotion } from '../lib/promotions-api';
import { getErrorMessage } from '../lib/api';

export function PromotionsPage() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionsApi.getAll();
      setPromotions(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await promotionsApi.delete(id);
      await loadPromotions();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'active') {
        await promotionsApi.pause(id);
      } else {
        await promotionsApi.activate(id);
      }
      await loadPromotions();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiscountDisplay = (promotion: Promotion) => {
    switch (promotion.discountType) {
      case 'percentage':
        return `${promotion.discountValue}% off`;
      case 'fixed':
        return `$${promotion.discountValue} off`;
      case 'bogo':
        return 'Buy One Get One';
      case 'freebie':
        return 'Free Item';
      default:
        return promotion.discountValue;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Promotions</h1>
            </div>

            <button
              onClick={() => navigate('/promotions/new')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              + Create Promotion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first promotion
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/promotions/new')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                + Create Promotion
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {promotion.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            promotion.status
                          )}`}
                        >
                          {promotion.status}
                        </span>
                        {promotion.isDiscoveryOffer && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Discovery
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">
                      {getDiscountDisplay(promotion)}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {promotion.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span>
                        {promotion.targetAllLocations
                          ? 'All locations'
                          : `${promotion.targetLocationIds.length} location(s)`}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {promotion._count && (
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{promotion._count.redemptions} redemptions</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {promotion.status === 'active' || promotion.status === 'paused' ? (
                      <button
                        onClick={() => handleToggleStatus(promotion.id, promotion.status)}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        {promotion.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                    ) : null}
                    <button
                      onClick={() => navigate(`/promotions/${promotion.id}/edit`)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id, promotion.title)}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
