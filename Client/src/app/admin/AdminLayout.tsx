import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      navigate('/login');
      return;
    }

    // Verify token is valid (optional - can add token validation here)
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">Authentication Required</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">Please log in to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
