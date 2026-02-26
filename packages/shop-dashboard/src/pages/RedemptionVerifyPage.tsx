import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyRedemptionCode, VerifyResult } from '../lib/redemptions-api';

export function RedemptionVerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyRedemptionCode(code.trim().toUpperCase());
      setResult(response.data);
      setCode('');
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Verify Redemption</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {result ? (
          /* Success state */
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Code Verified!</h2>
            <p className="text-gray-500 mb-6">The redemption has been recorded</p>

            <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Promotion</p>
                <p className="text-base font-semibold text-gray-900">{result.promotion.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Discount Applied</p>
                <p className="text-base font-bold text-indigo-600">{result.promotion.discountLabel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</p>
                <p className="text-base font-medium text-gray-900">
                  {result.customer.firstName} {result.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Verified at</p>
                <p className="text-base text-gray-700">
                  {new Date(result.verifiedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Verify Another Code
            </button>
          </div>
        ) : (
          /* Code entry form */
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎟️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Enter Redemption Code</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Ask the customer for their LOCO-XXXXXX code or scan their QR code
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redemption Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="LOCO-XXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                  autoFocus
                  autoCapitalize="characters"
                  maxLength={11}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-red-700">Verification Failed</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-base"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-gray-400">
                Codes expire 10 minutes after generation · Single use only
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
