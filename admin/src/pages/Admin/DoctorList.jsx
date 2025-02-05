import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken , changeAvailability} = useContext(AdminContext);

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <p className="text-lg font-semibold">Doctor List</p>
      <div className="flex flex-row flex-wrap gap-4 pt-6 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="group border border-indigo-200 rounded-lg overflow-hidden max-w-56 cursor-pointer "
            key={index}
          >
            <img
              className="w-full h-36 object-cover bg-green-50 group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt={item.name}
            />
            <div className="py-2 px-3">
              <p className="text-lg font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
            <div className="flex items-center text-sm p-2 gap-2">
              <input onChange={()=> changeAvailability(item._id)} type="checkbox" checked={item.available} className="accent-indigo-500" />
              <p>Available</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
