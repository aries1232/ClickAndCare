import React, { useContext, useEffect, useState } from "react";
import { assets, doctors } from "./../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || "All");

  const applyfilter = () => {
    if (selectedSpeciality && selectedSpeciality !== "All") {
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
      setSelectedSpeciality("All");
      navigate("/doctors");
    } else {
      setSelectedSpeciality(speciality);
      if (speciality === "All") {
        navigate("/doctors");
      } else {
        navigate(`/doctors/${speciality}`);
      }
    }
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-300">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">
          {["All", "General Physician", "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Gynecologist", "Gastroenterologist", "Orthopedic", "Psychiatrist", "Dentist", "Ophthalmologist", "ENT Specialist", "Pulmonologist", "Endocrinologist", "Oncologist"].map((speciality) => (
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
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6">
          {filterDoc.map((doctor, index) => (
            <div
              key={index}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(`/appointment/${doctor._id}`);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg"
            >
              <div className="relative h-48 bg-blue-50 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={doctor.image} 
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMzQ1NEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxNDMuNDMxIDEzMCAxNjBDMTMwIDE3Ni41NjkgMTE2LjU2OSAxOTAgMTAwIDE5MEM4My40MzEgMTkwIDcwIDE3Ni41NjkgNzAgMTYwQzcwIDE0My40MzEgODMuNDMxIDEzMCAxMDAgMTMwWiIgZmlsbD0iI0QzNDU0RjYiLz4KPC9zdmc+';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-white text-xs px-2 py-1 rounded-full font-medium ${
                    doctor.available ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-900 dark:text-white text-lg font-semibold mb-1">{doctor.name}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{doctor.speciality}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">₹{doctor.fees}</span>
                  <span className="text-xs text-gray-500">Consultation</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
