import React from 'react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import StatsCards from '../../components/admin/dashboard/StatsCards.jsx';
import MigrationBanner from '../../components/admin/dashboard/MigrationBanner.jsx';
import ActivityLogsBanner from '../../components/admin/dashboard/ActivityLogsBanner.jsx';
import RecentAppointments from '../../components/admin/dashboard/RecentAppointments.jsx';

const Dashboard = () => {
  const { dashData, isApproving, approveExistingDoctors } = useAdminDashboard();
  if (!dashData) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">System overview and statistics</p>
      </div>

      <StatsCards dashData={dashData} />
      <MigrationBanner isApproving={isApproving} onApprove={approveExistingDoctors} />
      <ActivityLogsBanner />
      <RecentAppointments appointments={dashData.latestAppointments} />
    </div>
  );
};

export default Dashboard;
