import React, { useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext.jsx";
import { useContext } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { dashData, getdashboardData, aToken, cancelAppointment, backendUrl } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (aToken) {
      getdashboardData();
    }
  }, [aToken]);

  const approveExistingDoctors = async () => {
    setIsApproving(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/approve-existing-doctors',
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getdashboardData(); // Refresh dashboard data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    dashData && (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System overview and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-white">{dashData.users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Doctors</p>
                <p className="text-2xl font-semibold text-white">{dashData.doctors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Appointments</p>
                <p className="text-2xl font-semibold text-white">{dashData.appointments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Doctors</p>
                <p className="text-2xl font-semibold text-white">{dashData.pendingDoctors || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Migration Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Database Migration Tool
          </h3>
              <p className="text-amber-700 mb-4">
                If you have existing doctors who can't login due to pending approval, use this tool to approve all existing doctors at once.
          </p>
          <button
            onClick={approveExistingDoctors}
            disabled={isApproving}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                {isApproving ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Approving...
                  </div>
                ) : (
                  'Approve Existing Doctors'
                )}
          </button>
            </div>
          </div>
        </div>

        {/* Activity Logs Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Activity Logs
              </h3>
              <p className="text-blue-700 mb-4">
                Monitor all administrative actions, system activities, and track important events in your healthcare platform.
              </p>
              <Link
                to="/admin/logs"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Activity Logs
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Recent Appointments</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  className="flex items-center px-6 py-4 hover:bg-gray-700 transition-colors duration-200"
                  key={index}
                >
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    src={item.userData?.image || assets.upload_area}
                    alt={item.userData?.name}
                  />
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {item.userData?.name || 'Patient Name'}
                      </h3>
                      <span className="text-sm text-gray-400">with</span>
                      <span className="font-medium text-blue-400">
                        {item.doctorData?.name || 'Doctor Name'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {slotDateFormat(item.slotDate)} at {item.slotTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.cancelled ? (
                      <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">Completed</span>
                    ) : (
                      <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">Scheduled</span>
                    )}
                    {item.amount && (
                      <span className="text-sm font-medium text-gray-300">
                        ₹{item.amount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-500 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No appointments found</p>
                <p className="text-gray-500 text-sm">No recent appointments to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
