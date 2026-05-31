import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('portfolioToken') || localStorage.getItem('adminToken');
    console.log('ProtectedRoute check - Token exists:', !!token);
    setIsAuthenticated(!!token);
    setMounted(true);
  }, []);

  if (!mounted) {
    // Still loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Authenticated, rendering children');
  return <>{children}</>;
}
