import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const PatientManagement = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // Get unique patients from appointments
  const getUniquePatients = () => {
    if (!appointments) return [];
    
    const patientMap = new Map();
    appointments.forEach(appointment => {
      if (appointment.userData) {
        const patientId = appointment.userData._id;
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            ...appointment.userData,
            appointments: [],
            totalAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0
          });
        }
        
        const patient = patientMap.get(patientId);
        patient.appointments.push(appointment);
        patient.totalAppointments++;
        
        if (appointment.isCompleted) {
          patient.completedAppointments++;
        } else if (appointment.cancelled) {
          patient.cancelledAppointments++;
        }
      }
    });
    
    return Array.from(patientMap.values());
  };

  const patients = getUniquePatients();

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    switch (filterStatus) {
      case "active":
        matchesStatus = patient.completedAppointments > 0;
        break;
      case "new":
        matchesStatus = patient.totalAppointments === 1;
        break;
      case "frequent":
        matchesStatus = patient.totalAppointments > 3;
        break;
      default:
        matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getPatientAppointments = (patientId) => {
    return appointments?.filter(apt => apt.userData?._id === patientId) || [];
  };

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">Cancelled</span>;
    } else if (appointment.isCompleted) {
      return <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">Completed</span>;
    } else {
      return <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">Scheduled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Patient Management</h1>
        <p className="text-gray-400">View and manage your patient information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Patients ({filteredPatients.length})</h2>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-700">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="all">All Patients</option>
                  <option value="active">Active Patients</option>
                  <option value="new">New Patients</option>
                  <option value="frequent">Frequent Patients</option>
                </select>
              </div>
            </div>

            {/* Patient List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200 ${
                      selectedPatient?._id === patient._id
                        ? 'bg-gray-700 border-gray-600'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                        src={patient.image || assets.upload_area}
                        alt={patient.name}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{patient.name}</h3>
                        <p className="text-sm text-gray-400 truncate">{patient.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                            {patient.totalAppointments} visits
                          </span>
                          {patient.totalAppointments > 3 && (
                            <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded-full">
                              Frequent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                      src={selectedPatient.image || assets.upload_area}
                      alt={selectedPatient.name}
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedPatient.name}</h2>
                      <p className="text-gray-400">{selectedPatient.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Patient ID</p>
                    <p className="font-mono text-sm text-gray-300">{selectedPatient._id?.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {/* Patient Stats */}
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedPatient.totalAppointments}</p>
                  <p className="text-sm text-gray-400">Total Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{selectedPatient.completedAppointments}</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{selectedPatient.cancelledAppointments}</p>
                  <p className="text-sm text-gray-400">Cancelled</p>
                </div>
              </div>

              {/* Appointment History */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Appointment History</h3>
                <div className="space-y-3">
                  {getPatientAppointments(selectedPatient._id).map((appointment, index) => (
                    <div
                      key={appointment._id || index}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-sm font-medium text-white">
                            {slotDateFormat(appointment.slotDate)}
                          </p>
                          <p className="text-xs text-gray-400">{appointment.slotTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Appointment #{index + 1}</p>
                          <p className="text-sm text-gray-400">
                            {appointment.userData?.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment)}
                        {appointment.amount && (
                          <span className="text-sm font-medium text-gray-300">
                            ₹{appointment.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Select a Patient</h3>
              <p className="text-gray-400">Choose a patient from the list to view their details and appointment history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement; 