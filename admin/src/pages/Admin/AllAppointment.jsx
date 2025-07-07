import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import DefaultAvatar from '../../components/DefaultAvatar';

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment, cancelAppointmentSilent } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const currency = "₹";

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const cancelAllActiveAppointments = async () => {
    const activeAppointments = appointments.filter(item => !item.cancelled && !item.isCompleted);
    
    if (activeAppointments.length === 0) {
      toast.warning("No active appointments to cancel");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel all ${activeAppointments.length} active appointments? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsCancellingAll(true);
    try {
      // Cancel all appointments simultaneously without individual toasts
      const cancelPromises = activeAppointments.map(appointment => 
        cancelAppointmentSilent(appointment._id)
      );
      
      const results = await Promise.all(cancelPromises);
      const successCount = results.filter(result => result === true).length;
      
      // Refresh appointments data
      await getAllAppointments();
      
      if (successCount === activeAppointments.length) {
        toast.success(`Successfully cancelled all ${activeAppointments.length} appointments`);
      } else {
        toast.warning(`Cancelled ${successCount} out of ${activeAppointments.length} appointments`);
      }
    } catch (error) {
      toast.error("Error cancelling appointments: " + error.message);
    } finally {
      setIsCancellingAll(false);
    }
  };

  const filteredAppointments = appointments
    .filter((item) => {
      const matchesSearch = 
        item.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.docData.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === "all" || 
        (filterStatus === "cancelled" && item.cancelled) ||
        (filterStatus === "completed" && item.isCompleted) ||
        (filterStatus === "active" && !item.cancelled && !item.isCompleted);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by creation date (most recent first) - using _id or createdAt
      try {
        // If there's a createdAt field, use it
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        // If there's an _id field, use it (MongoDB ObjectIds contain timestamp)
        if (a._id && b._id) {
          // Extract timestamp from ObjectId (first 4 bytes)
          const timestampA = parseInt(a._id.substring(0, 8), 16) * 1000;
          const timestampB = parseInt(b._id.substring(0, 8), 16) * 1000;
          return timestampB - timestampA;
        }
        
        // Fallback: sort by appointment date (most recent appointment date first)
        const parseDateTime = (slotDate, slotTime) => {
          let dateStr = slotDate;
          if (typeof slotDate === 'string') {
            if (slotDate.includes('/')) {
              const parts = slotDate.split('/');
              if (parts.length === 3) {
                dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }
          const dateTimeStr = `${dateStr} ${slotTime}`;
          return new Date(dateTimeStr);
        };

        const dateA = parseDateTime(a.slotDate, a.slotTime);
        const dateB = parseDateTime(b.slotDate, b.slotTime);
        
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0;
        }
        
        return dateB - dateA;
      } catch (error) {
        console.error('Error sorting appointments:', error);
        return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Appointments</h1>
        <p className="text-gray-400">Manage and monitor all patient appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Appointments</p>
              <p className="text-2xl font-semibold text-white">{appointments.length}</p>
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
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-white">{appointments.filter(item => !item.cancelled && !item.isCompleted).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Cancelled</p>
              <p className="text-2xl font-semibold text-white">{appointments.filter(item => item.cancelled).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-white">{appointments.filter(item => item.isCompleted).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold text-white">
                ₹{appointments.reduce((sum, item) => sum + (item.docData.fees || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Appointments</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {appointments.filter(item => !item.cancelled && !item.isCompleted).length} active appointments
          </div>
          <button
            onClick={cancelAllActiveAppointments}
            disabled={isCancellingAll || appointments.filter(item => !item.cancelled && !item.isCompleted).length === 0}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isCancellingAll ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelling...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel All Active
              </>
            )}
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Appointments List</h2>
            <span className="text-sm text-gray-400">({filteredAppointments.length} appointments)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAppointments.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.userData.image && item.userData.image !== '' ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                          src={item.userData.image}
                        alt={item.userData.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <DefaultAvatar 
                          name={item.userData.name} 
                          size="w-10 h-10" 
                          className="border-2 border-gray-600"
                      />
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{item.userData.name}</div>
                        <div className="text-sm text-gray-400">{item.userData.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {isNaN(new Date(item.userData.dob)) ? "N/A" : calculateAge(item.userData.dob)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{slotDateFormat(item.slotDate)}</div>
                    <div className="text-sm text-gray-400">{item.slotTime}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.docData.image && item.docData.image !== '' ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                          src={item.docData.image}
                        alt={item.docData.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <DefaultAvatar 
                          name={item.docData.name} 
                          size="w-10 h-10" 
                          className="border-2 border-gray-600"
                      />
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{item.docData.name}</div>
                        <div className="text-sm text-gray-400">{item.docData.speciality}</div>
                      </div>
            </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    ₹{item.docData.fees}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Active
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {item.cancelled ? (
                      <span className="text-gray-500">No actions</span>
                    ) : item.isCompleted ? (
                      <span className="text-gray-500">No actions</span>
            ) : (
                      <button
                  onClick={() => cancelAppointment(item._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-400 rounded-md text-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-300">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
