import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability, deleteDoctor, isLoading } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);

  // Filter doctors based on search and status
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    switch (filterStatus) {
      case "approved":
        matchesStatus = doctor.approved;
        break;
      case "pending":
        matchesStatus = !doctor.approved;
        break;
      case "available":
        matchesStatus = doctor.available;
        break;
      case "unavailable":
        matchesStatus = !doctor.available;
        break;
      default:
        matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (doctor) => {
    if (!doctor.approved) {
      return <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded-full">Pending</span>;
    } else if (doctor.available) {
      return <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">Available</span>;
    } else {
      return <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">Unavailable</span>;
    }
  };

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

  const handleDeleteDoctor = (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${doctor.name}?\n\nThis will permanently delete:\n• Doctor profile\n• All appointments with this doctor\n• All related data\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      deleteDoctor(doctor._id);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getAllDoctors();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Doctor Management</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading?.doctors}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="Refresh doctor list"
          >
            {isRefreshing || isLoading?.doctors ? (
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
        <p className="text-gray-400">Manage and monitor all registered doctors</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search doctors by name, speciality, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
        >
          <option value="all">All Doctors</option>
          <option value="approved">Approved Only</option>
          <option value="pending">Pending Only</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Doctors</p>
              <p className="text-2xl font-bold text-white">{doctors.length}</p>
            </div>
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-400">{doctors.filter(d => d.approved).length}</p>
            </div>
            <div className="bg-green-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{doctors.filter(d => !d.approved).length}</p>
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
              <p className="text-sm text-gray-400">Available</p>
              <p className="text-2xl font-bold text-blue-400">{doctors.filter(d => d.available).length}</p>
            </div>
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <div
            key={doctor._id || index}
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
                {getStatusBadge(doctor)}
              </div>
              <div className="absolute bottom-3 left-3">
                <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {getSpecialityIcon(doctor.speciality)} {doctor.speciality}
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{doctor.name}</h3>
                  <p className="text-sm text-gray-400">{doctor.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">₹{doctor.fees}</p>
                  <p className="text-xs text-gray-500">Consultation</p>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-300">{doctor.experience} years exp.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm text-gray-300">{doctor.degree}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    onChange={() => changeAvailability(doctor._id)}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="text-sm text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    ID: {doctor._id?.slice(-6)}
                  </div>
                  <button
                    onClick={() => handleDeleteDoctor(doctor)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
                    title="Delete Doctor"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No doctors found</h3>
          <p className="text-gray-400">No doctors match your current search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
