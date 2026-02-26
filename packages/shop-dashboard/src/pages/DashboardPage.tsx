import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getAnalyticsOverview } from '../lib/analytics-api';

export function DashboardPage() {
  const { shop, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const analytics = (analyticsData as any)?.data;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const StatCard = ({
    label,
    value,
    icon,
    sub,
    onClick,
  }: {
    label: string;
    value: string | number;
    icon: string;
    sub?: string;
    onClick?: () => void;
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${onClick ? 'hover:shadow-md cursor-pointer transition' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {analyticsLoading ? <span className="text-gray-300">—</span> : value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">LoCo</h1>
              <span className="ml-4 text-sm text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{shop?.name}</p>
                <p className="text-xs text-gray-500">{shop?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-1">Welcome back, {shop?.name}!</h2>
          <p className="text-indigo-100">Here's how your promotions are performing.</p>
        </div>

        {/* Live stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Promotions"
            value={analytics?.activePromotions ?? '—'}
            icon="🎯"
            sub="Right now"
            onClick={() => navigate('/promotions')}
          />
          <StatCard
            label="Views (7 days)"
            value={analytics?.totalViews?.['7d'] ?? '—'}
            icon="👁️"
            sub={`${analytics?.totalViews?.['24h'] ?? 0} in last 24h`}
          />
          <StatCard
            label="Redemptions (7 days)"
            value={analytics?.totalRedemptions?.['7d'] ?? '—'}
            icon="🎟️"
            sub={`${analytics?.totalRedemptions?.['24h'] ?? 0} in last 24h`}
            onClick={() => navigate('/redemptions')}
          />
          <StatCard
            label="Conversion Rate"
            value={analytics?.conversionRate7d ?? '—'}
            icon="📈"
            sub="Views → Redemptions (7d)"
          />
        </div>

        {/* Quick actions */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Locations', icon: '📍', path: '/locations' },
            { label: 'Promotions', icon: '🎯', path: '/promotions' },
            { label: 'Verify Code', icon: '✅', path: '/verify' },
            { label: 'Redemptions', icon: '🎟️', path: '/redemptions' },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition text-left"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <p className="text-sm font-semibold text-gray-900">{action.label} →</p>
            </button>
          ))}
        </div>

        {/* Top promotion */}
        {analytics?.topPromotion && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Promotion (7 days)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{analytics.topPromotion.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics.topPromotion.views} views · {analytics.topPromotion.redemptions} redemptions
                </p>
              </div>
              <button
                onClick={() => navigate('/promotions')}
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                View all →
              </button>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Shop Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{shop?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{shop?.email}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
