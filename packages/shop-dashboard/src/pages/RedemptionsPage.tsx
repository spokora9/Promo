import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getShopRedemptions, ShopRedemption } from '../lib/redemptions-api';

function formatDate(str: string) {
  return new Date(str).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDiscount(type?: string, value?: number) {
  if (!type) return 'Special';
  if (type === 'percentage') return `${value}% OFF`;
  if (type === 'fixed') return `$${value} OFF`;
  if (type === 'bogo') return 'BOGO';
  if (type === 'freebie') return 'Free';
  return 'Special';
}

export function RedemptionsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['shop-redemptions'],
    queryFn: () => getShopRedemptions(),
  });

  const redemptions: ShopRedemption[] = (data as any)?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">← Back</button>
              <h1 className="text-xl font-bold text-gray-900">Redemptions</h1>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              + Verify Code
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading redemptions...</div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🎟️</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No redemptions yet</h3>
            <p className="text-gray-500">When customers redeem your promotions they'll appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Promotion</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {redemptions.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-900">{r.redemptionCode}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 max-w-[180px] truncate">{r.promotion.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.user.firstName} {r.user.lastName ? r.user.lastName.charAt(0) + '.' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(r.redeemedAt)}</td>
                    <td className="px-6 py-4">
                      {r.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-indigo-600">
                        {formatDiscount(r.promotion.discountType, r.promotion.discountValue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
