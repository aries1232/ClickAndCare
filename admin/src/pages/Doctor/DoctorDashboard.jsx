import React, { useEffect } from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData,completeAppointment,cancelAppointment } =
    useContext(DoctorContext);

  const { slotDateFormat } = useContext(AppContext);

  const currency = "₹";

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl  text-gray-600  font-bold">
                {dashData.earnings}
              </p>
              <p className="text-sm text-gray-600">Earning</p>
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
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3  gap-3 border-b border-gray-200   hover:bg-gray-200 "
                key={index}
              >
                <img
                  className=" object-center w-14 h-14 rounded-full  "
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 ">
                  <p className="font-semibold text-gray-700">
                    {item.userData.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 texxt-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
