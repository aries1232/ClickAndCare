import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, doctors } from "./../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState();
  // const { Doctors } = useContext(AppContext);

  const applyfilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyfilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex-col gap-4 text-sm text-gray-600">
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            General physician
          </p>
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            Gynecologist
          </p>
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            Dermatologist
          </p>
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            Pediatricians
          </p>
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            Neurologist
          </p>
          <p className="w-94vw sm:w-auto pl-3 py-1.5 pr-16 border mt-2 border-gray-300 rounded transition-all cursor-pointer">
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {
            // filterDoc.map((item,index)=>(
            //   <div>
            //     <img src={item.image} alt="" />
            //     <div>
            //       <div>
            //         <p>Available</p>
            //       </div>
            //       <p>{item.name}</p>
            //       <p>{item.speciality}</p>
            //     </div>
            //   </div>
            // ))
          }
          ajdaljlda
        </div>
      </div>
    </div>
  );
};

export default Doctors;
