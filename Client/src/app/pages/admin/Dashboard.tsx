import { useState } from 'react';
import AdminDashboard from '../../admin/AdminDashboard';

export default function Dashboard() {
  const [dashboardKey, setDashboardKey] = useState(0);

  const handleUpdate = () => {
    // Refresh dashboard data
    setDashboardKey((prev) => prev + 1);
  };

  return <AdminDashboard key={dashboardKey} onUpdate={handleUpdate} />;
}
