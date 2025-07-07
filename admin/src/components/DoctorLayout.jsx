import React, { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import DoctorNavbar from './DoctorNavbar';
import DoctorSidebar from './DoctorSidebar';

const DoctorLayout = ({ children }) => {
  const { dToken } = useContext(DoctorContext);

  // If doctor is not authenticated, don't show layout
  if (!dToken) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DoctorNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout; 