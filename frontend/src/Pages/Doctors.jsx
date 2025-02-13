import React, { useContext, useEffect, useState } from "react";
import { assets, doctors } from "./../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || "");

  const applyfilter = () => {
    if (selectedSpeciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === selectedSpeciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    if (doctors) {
      applyfilter();
      console.log(doctors);
    }
  }, [doctors, selectedSpeciality]);

  const handleSpecialityClick = (speciality) => {
    if (speciality === selectedSpeciality) {
      setSelectedSpeciality("");
      navigate("/doctors");
    } else {
      setSelectedSpeciality(speciality);
      navigate(`/doctors/${speciality}`);
    }
  };

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {["General Physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((speciality) => (
            <p
              key={speciality}
              onClick={() => handleSpecialityClick(speciality)}
              className={`w-94vw sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                selectedSpeciality === speciality ? "bg-primary text-white" : ""
              }`}
            >
              {speciality}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((doctor, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${doctor._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={doctor.image} alt="" />
              <div className="p-4">
                <div className="flex items-center   text-sm text-center ">
                  <p className=""></p>
                  <p>{doctor.available ? <span className="text-green-500">Available</span> : <span className="text-red-500">Not Available</span> }</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
                <p className="text-gray-600 text-sm">{doctor.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
