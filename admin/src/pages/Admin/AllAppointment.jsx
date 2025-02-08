import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments , backendUrl} = useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const currency = "₹";

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


  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_2fr_1fr_1fr] py-3 px-6 border-b font-medium bg-gray-100">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_3fr_1fr_3fr_2fr_1fr_1fr] items-center py-3 px-6 text-gray-700 border-b hover:bg-gray-50"
          >
            <p>{index + 1}</p>

            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover" src={item.userData.image} alt="User" />
              <p>{item.userData.name}</p>
            </div>

            <p className="max-sm:hidden">
  {isNaN(new Date(item.userData.dob)) ? "N/A" : calculateAge(item.userData.dob)}
</p>

            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover bg-green-50" src={item.docData.image} alt="Doctor" />
              <p>{item.docData.name}</p>
            </div>

            <p>{currency}{item.docData.fees}</p>

            <div className="flex gap-2">
              {item.cancelled ? <p className="text-xs bg-gray-100 px-2 py-1 rounded">Cancelled</p> : <button onClick={() => cancelAppointment(item._id)} className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600">
                Cancel
              </button>}
            </div> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointment;
