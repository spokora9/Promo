import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          LoCo
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          Location Commerce
        </p>
        <p className="text-gray-600 mb-8">
          Discover amazing deals from businesses near you
        </p>
        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full max-w-xs mx-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </a>
          <p className="text-sm text-gray-500">
            Coming soon in Sprint 1
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome Back
        </h2>
        <p className="text-gray-600">
          Login and onboarding flow will be implemented in Sprint 1
        </p>
      </div>
    </div>
  );
}

export default App;
