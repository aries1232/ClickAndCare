import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../Components/DoctorCard.jsx";
import { SPECIALITIES } from "../utils/constants";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || "All");

  useEffect(() => {
    if (!doctors) return;
    if (selectedSpeciality && selectedSpeciality !== "All") {
      setFilterDoc(doctors.filter((doc) => doc.speciality === selectedSpeciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, selectedSpeciality]);

  const handleSpecialityClick = (s) => {
    if (s === selectedSpeciality) {
      setSelectedSpeciality("All");
      navigate("/doctors");
      return;
    }
    setSelectedSpeciality(s);
    navigate(s === "All" ? "/doctors" : `/doctors/${s}`);
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-300">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">
          {SPECIALITIES.map((s) => (
            <p
              key={s}
              onClick={() => handleSpecialityClick(s)}
              className={`w-94vw sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                selectedSpeciality === s ? "bg-primary text-white" : ""
              }`}
            >
              {s}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6">
          {filterDoc.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
