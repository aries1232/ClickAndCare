import { Children, createContext , useState} from "react";
import axios from 'axios'
import { toast } from "react-toastify";


export const AdminContext = createContext();



const AdminContextProvider = (props) => {

    const [aToken , setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors,setDoctors] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const [dashData,setDashData] = useState(false);


    //api to get the dashboard data 
    const getdashboardData = async() => {
        try {
          const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}});
          //const data = response.data;
          if(data.success){
            //console.log(data.dashData);
            setDashData(data.dashData);
          }else {
            toast.error(data.message);
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message);
          
        }
    }



    //api to get all doctors
    const getAllDoctors = async(req,res) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors' ,{},{headers:{aToken}});
            if(data.success) {
                setDoctors(data.doctors);
                //console.log(data.doctors);

            }else {
                toast.error(data.message);

            }
            
        } catch (error) {
            res.json({success:false,message:error.message}); 
            
        }
    }

    const changeAvailability = async (docId) => {

        try {
            const {data} = await  axios.post(backendUrl + '/api/admin/change-availablity',{docId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message);
                getAllDoctors();

            }else {
                toast.error(data.message);
                 
            }
            
        } catch (error) {
            toast.error(error.message);
             
            
        }
    }

    const getAllAppointments = async(req,res) => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}});
            if(data.success){
                setAppointments(data.appointments);
                //console.log(data.appointments);
            }else {
                toast.error(data.message);
            }
        } catch (error) {

            console.log(error.message);
            toast.error(data.message);
        }
    }

    // api call to cancel the appointment
    const cancelAppointment = async(appointmentId) => {
        try {
          const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId}, {headers:{aToken}})
          if(data.success){
            toast.success(data.message);
            getAllAppointments();
             
          }else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
    
      }

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
        dashData,getdashboardData,
        cancelAppointment
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;