import React from "react";
import axios from "axios";
import AdminContextProvider, {
  AdminContext,
} from "../../context/AdminContext.jsx";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";

const Dashboard = () => {
  const { dashData, getdashboardData, aToken, cancelAppointment } = useContext(AdminContext);
  const {slotDateFormat} = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getdashboardData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl  text-gray-600  font-bold">
                {dashData.doctors}
              </p>
              <p className="text-sm text-gray-600">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl text-gray-600 font-bold">
                {dashData.patients}
              </p>
              <p className="text-sm text-gray-600">Patients</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl  text-gray-600  font-bold">
                {dashData.appointments}
              </p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-centre gap-3 p-4 mt-10 rounded-sm  border border-gray-200">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold text-gray-800">Lastest Appointments</p>
          </div>

          <div className="pt-0.5 border  border-t-0 border-gray-200 rounded-sm">
            {dashData.latestAppointments?.map((item,index) => (
                <div className="flex items-center px-6 py-3  gap-3 border-b border-gray-200   hover:bg-gray-200 " key={index}>
                  <img className=" object-center w-14 h-14 rounded-full  " src={item.docData.image} alt="" />
                  <div className="flex-1 ">
                    <p className="font-semibold text-gray-700">{item.docData.name}</p>
                    <p className="text-sm text-gray-600"> {slotDateFormat(item.slotDate)}</p>
                  </div>
                  {item.cancelled ? <p className="text-xs bg-gray-100 px-2 py-1 rounded">Cancelled</p> : <button onClick={() => cancelAppointment(item._id)} className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600">
                Cancel
              </button>}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
