import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const hasToken = () => {
  try {
    return Boolean(
      localStorage.getItem('authToken') || localStorage.getItem('portfolioToken') || localStorage.getItem('adminToken')
    );
  } catch {
    return false;
  }
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Checked synchronously so there is no spinner flash between login and the dashboard.
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
