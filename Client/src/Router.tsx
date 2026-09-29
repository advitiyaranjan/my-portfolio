import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from './app/theme';
import ProtectedRoute from './app/components/ProtectedRoute';

// Each route is its own chunk: the login page no longer has to download the whole portfolio first.
const MainApp = lazy(() => import('./app/pages/MainApp'));
const Login = lazy(() => import('./app/pages/Login'));
const Dashboard = lazy(() => import('./app/pages/admin/Dashboard'));

function RouteFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="h-10 w-10 rounded-full border-2 border-border border-t-neon-violet animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function Router() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<MainApp />} />

              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
