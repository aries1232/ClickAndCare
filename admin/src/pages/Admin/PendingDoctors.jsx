import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const PendingDoctors = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { backendUrl, aToken, deleteDoctor } = useContext(AdminContext);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/pending-doctors', {
        headers: { aToken }
      });

      if (data.success) {
        setPendingDoctors(data.pendingDoctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (doctorId, approved) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/approve-doctor', {
        doctorId,
        approved
      }, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message);
        fetchPendingDoctors(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteDoctor = (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${doctor.name || 'this doctor'}?\n\nThis will permanently delete:\n• Doctor profile\n• All appointments with this doctor\n• All related data\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      deleteDoctor(doctor._id);
      fetchPendingDoctors(); // Refresh the list after deletion
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPendingDoctors();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter doctors based on search
  const filteredDoctors = pendingDoctors.filter(doctor => {
    return doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getSpecialityIcon = (speciality) => {
    const specialityIcons = {
      'Cardiologist': '🫀',
      'Dermatologist': '🩺',
      'Neurologist': '🧠',
      'Pediatrician': '👶',
      'Orthopedic': '🦴',
      'Psychiatrist': '🧠',
      'Gynecologist': '👩‍⚕️',
      'Ophthalmologist': '👁️',
      'Dentist': '🦷',
      'General Physician': '👨‍⚕️'
    };
    return specialityIcons[speciality] || '👨‍⚕️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading pending doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Pending Doctor Approvals</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="Refresh pending doctors list"
          >
            {isRefreshing || loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
        <p className="text-gray-400">Review and approve new doctor registrations</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search pending doctors by name, speciality, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingDoctors.length}</p>
            </div>
            <div className="bg-yellow-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">With Profile Pic</p>
              <p className="text-2xl font-bold text-green-400">{pendingDoctors.filter(d => d.image).length}</p>
            </div>
            <div className="bg-green-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ready to Approve</p>
              <p className="text-2xl font-bold text-blue-400">{pendingDoctors.filter(d => d.image && d.name && d.email && d.speciality).length}</p>
            </div>
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No pending doctors found</h3>
          <p className="text-gray-400">No pending doctor registrations match your search criteria</p>
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
            >
              {/* Doctor Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  className="w-full h-full object-cover"
                      src={doctor.image || assets.upload_area} 
                      alt={doctor.name} 
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded-full">Pending</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {getSpecialityIcon(doctor.speciality)} {doctor.speciality || 'Speciality'}
                  </div>
                </div>
                    {!doctor.image && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white text-sm font-medium">No Profile Picture</p>
                    </div>
                      </div>
                    )}
                  </div>

              {/* Doctor Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {doctor.name || 'Name not available'}
                    </h3>
                    <p className="text-sm text-gray-400">{doctor.email || 'Email not available'}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-400">₹{doctor.fees || 'Not set'}</p>
                    <p className="text-xs text-gray-500">Consultation</p>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-300">{doctor.experience || 'Experience'} years exp.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="text-sm text-gray-300">{doctor.degree || 'Degree not available'}</span>
                  </div>
                </div>

                {/* About Section */}
                {doctor.about && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 line-clamp-2">{doctor.about}</p>
                  </div>
                )}

                {/* Address */}
                {doctor.address && (
                  <div className="mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-400">
                        {typeof doctor.address === 'string' 
                          ? doctor.address 
                          : doctor.address.address || 'Address not available'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleApproval(doctor._id, true)}
                      disabled={!doctor.image}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                        doctor.image 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      title={!doctor.image ? "Cannot approve without profile picture" : "Approve doctor"}
                    >
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(doctor._id, false)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                      Reject
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor)}
                      className="px-3 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition"
                      title="Delete doctor permanently"
                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    </button>
                </div>

                {/* Missing Info Warning */}
                {!doctor.image && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-red-400 text-xs font-medium">
                      ⚠️ Profile picture required for approval
                    </p>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default PendingDoctors; 