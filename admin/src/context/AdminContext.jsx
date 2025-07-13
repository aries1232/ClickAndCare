import { Children, createContext , useState, useEffect, useRef} from "react";
import axios from 'axios'
import { toast } from "react-toastify";


export const AdminContext = createContext();



const AdminContextProvider = (props) => {

    const [aToken , setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [doctors,setDoctors] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const [dashData,setDashData] = useState(false);
    const [isLoading, setIsLoading] = useState({
        dashboard: false,
        doctors: false,
        appointments: false
    });
    const [lastUpdated, setLastUpdated] = useState({
        dashboard: null,
        doctors: null,
        appointments: null
    });
    
    // Real-time update intervals
    const dashboardIntervalRef = useRef(null);
    const doctorsIntervalRef = useRef(null);
    const appointmentsIntervalRef = useRef(null);
    
    // Auto-refresh intervals (in milliseconds)
    const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds
    const DOCTORS_REFRESH_INTERVAL = 45000;   // 45 seconds
    const APPOINTMENTS_REFRESH_INTERVAL = 20000; // 20 seconds


    //api to get the dashboard data 
    const getdashboardData = async() => {
        setIsLoading(prev => ({ ...prev, dashboard: true }));
        try {
          const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}});
          if(data.success){
            setDashData(data.dashData);
            setLastUpdated(prev => ({ ...prev, dashboard: new Date() }));
          }else {
            toast.error(data.message);
          }
          
        } catch (error) {
          toast.error(error.message);
          
        } finally {
          setIsLoading(prev => ({ ...prev, dashboard: false }));
        }
    }



    //api to get all doctors
    const getAllDoctors = async(req,res) => {
        setIsLoading(prev => ({ ...prev, doctors: true }));
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors' ,{},{headers:{aToken}});
            if(data.success) {
                setDoctors(data.doctors);
                setLastUpdated(prev => ({ ...prev, doctors: new Date() }));
            }else {
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(prev => ({ ...prev, doctors: false }));
        }
    }

    const changeAvailability = async (docId) => {
        // Optimistic update - immediately update UI
        setDoctors(prevDoctors => 
            prevDoctors.map(doctor => 
                doctor._id === docId 
                    ? { ...doctor, available: !doctor.available }
                    : doctor
            )
        );

        try {
            const {data} = await  axios.post(backendUrl + '/api/admin/change-availablity',{docId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message);
                // Refresh to ensure consistency
                getAllDoctors();
                getdashboardData(); // Update dashboard stats
            }else {
                toast.error(data.message);
                // Revert optimistic update on error
                getAllDoctors();
            }
            
        } catch (error) {
            toast.error(error.message);
            // Revert optimistic update on error
            getAllDoctors();
        }
    }

    const getAllAppointments = async(req,res) => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}});
            if(data.success){
                setAppointments(data.appointments);
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch appointments");
        }
    }

    // api call to cancel the appointment
    const cancelAppointment = async(appointmentId) => {
        // Optimistic update - immediately update UI
        setAppointments(prevAppointments => 
            prevAppointments.map(appointment => 
                appointment._id === appointmentId 
                    ? { ...appointment, cancelled: true }
                    : appointment
            )
        );

        try {
          const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId}, {headers:{aToken}})
          if(data.success){
            toast.success(data.message);
            // Refresh to ensure consistency
            getAllAppointments();
            getdashboardData(); // Update dashboard stats
          }else {
            toast.error(data.message);
            // Revert optimistic update on error
            getAllAppointments();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to cancel appointment");
          // Revert optimistic update on error
          getAllAppointments();
        }
    }

    // api call to cancel appointment without showing toast (for bulk operations)
    const cancelAppointmentSilent = async(appointmentId) => {
        try {
          const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId}, {headers:{aToken}})
          if(data.success){
            return true;
          }else {
            return false;
          }
        } catch (error) {
          return false;
        }
    }

    // api call to delete doctor and all related data
    const deleteDoctor = async(doctorId) => {
        try {
          const {data} = await axios.delete(backendUrl + '/api/admin/delete-doctor/' + doctorId, {headers:{aToken}})
          if(data.success){
            toast.success(data.message);
            getAllDoctors();
            getAllAppointments();
            getdashboardData(); // Refresh dashboard data
          }else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete doctor");
        }
    }

    // api call to update doctor information
    const updateDoctorInfo = async(doctorId, updateData) => {
        try {
            const {data} = await axios.put(backendUrl + '/api/admin/update-doctor-info', 
                { doctorId, ...updateData }, 
                {headers:{aToken}}
            );
            if(data.success){
                toast.success(data.message);
                getAllDoctors(); // Refresh doctor list
                getdashboardData(); // Update dashboard stats
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update doctor info");
        }
    }

    // api call to update doctor profile picture
    const updateDoctorProfilePicture = async(doctorId, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('doctorId', doctorId);
            formData.append('image', imageFile);

            const {data} = await axios.put(backendUrl + '/api/admin/update-doctor-picture', 
                formData, 
                {
                    headers:{
                        aToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if(data.success){
                toast.success(data.message);
                getAllDoctors(); // Refresh doctor list
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update doctor picture");
        }
    }

    // api call to toggle doctor visibility on user website
    const toggleDoctorVisibility = async(doctorId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/toggle-doctor-visibility', 
                { doctorId }, 
                {headers:{aToken}}
            );
            if(data.success){
                toast.success(data.message);
                getAllDoctors(); // Refresh doctor list
                getdashboardData(); // Update dashboard stats
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to toggle doctor visibility");
        }
    }

    // Start auto-refresh intervals
    const startAutoRefresh = () => {
        // Clear existing intervals
        stopAutoRefresh();
        
        // Start dashboard auto-refresh
        dashboardIntervalRef.current = setInterval(() => {
            if (aToken) {
                getdashboardData();
            }
        }, DASHBOARD_REFRESH_INTERVAL);
        
        // Start doctors auto-refresh
        doctorsIntervalRef.current = setInterval(() => {
            if (aToken) {
                getAllDoctors();
            }
        }, DOCTORS_REFRESH_INTERVAL);
        
        // Start appointments auto-refresh
        appointmentsIntervalRef.current = setInterval(() => {
            if (aToken) {
                getAllAppointments();
            }
        }, APPOINTMENTS_REFRESH_INTERVAL);
    };

    // Stop auto-refresh intervals
    const stopAutoRefresh = () => {
        if (dashboardIntervalRef.current) {
            clearInterval(dashboardIntervalRef.current);
            dashboardIntervalRef.current = null;
        }
        if (doctorsIntervalRef.current) {
            clearInterval(doctorsIntervalRef.current);
            doctorsIntervalRef.current = null;
        }
        if (appointmentsIntervalRef.current) {
            clearInterval(appointmentsIntervalRef.current);
            appointmentsIntervalRef.current = null;
        }
    };

    // Initialize data and start auto-refresh when token changes
    useEffect(() => {
        if (aToken) {
            // Initial data load
            getdashboardData();
            getAllDoctors();
            getAllAppointments();
            
            // Start auto-refresh
            startAutoRefresh();
        } else {
            // Stop auto-refresh when logged out
            stopAutoRefresh();
        }
        
        // Cleanup on unmount
        return () => {
            stopAutoRefresh();
        };
    }, [aToken]);

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        dashData,
        getdashboardData,
        cancelAppointment,
        cancelAppointmentSilent,
        deleteDoctor,
        updateDoctorInfo,
        updateDoctorProfilePicture,
        toggleDoctorVisibility,
        startAutoRefresh,
        stopAutoRefresh,
        isLoading,
        lastUpdated
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;