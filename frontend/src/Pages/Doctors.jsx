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
    }
  }, [doctors, selectedSpeciality]);

  const handleSpecialityClick = (specialty) => {
    if (specialty === selectedSpeciality) {
      setSelectedSpeciality("");
      navigate("/doctors");
    } else {
      setSelectedSpeciality(specialty);
      navigate(`/doctors/${specialty}`);
    }
  };

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((specialty) => (
            <p
              key={specialty}
              onClick={() => handleSpecialityClick(specialty)}
              className={`w-94vw sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                selectedSpeciality === specialty ? "bg-primary text-white" : ""
              }`}
            >
              {specialty}
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
                <div className="flex items-center gap-2 text-sm text-center text-green-500 ">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
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
