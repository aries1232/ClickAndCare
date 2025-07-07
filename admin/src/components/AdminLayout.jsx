import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const { aToken } = useContext(AdminContext);

  // If admin is not authenticated, don't show layout
  if (!aToken) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 