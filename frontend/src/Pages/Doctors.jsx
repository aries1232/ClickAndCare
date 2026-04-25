import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../Components/DoctorCard.jsx";
import { SPECIALITIES } from "../utils/constants";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || "All");

  useEffect(() => {
    setSelectedSpeciality(speciality || "All");
  }, [speciality]);

  useEffect(() => {
    if (!doctors) return;
    if (selectedSpeciality && selectedSpeciality !== "All") {
      setFilterDoc(doctors.filter((doc) => doc.speciality === selectedSpeciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, selectedSpeciality]);

  // Filter is purely client-side — clicking a speciality flips local state
  // without touching the URL, so React Router doesn't remount the page and
  // the sidebar stays put. The URL `/doctors/:speciality` is still read on
  // initial mount via `useParams` so deep links from Home / SpecialityMenu
  // continue to work.
  const handleSpecialityClick = (s) => {
    setSelectedSpeciality((prev) => (prev === s ? "All" : s));
  };

  return (
    <div className="pb-12">
      <div className="mb-4 sm:mb-5">
        <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Browse
        </p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Find your doctor
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Browse through our trusted specialists.
        </p>
      </div>

      {/* ─── Mobile: horizontal scrolling chip bar ──────── */}
      <div className="sm:hidden -mx-4 px-4 mb-5">
        <div
          className="flex gap-2 overflow-x-auto pt-2 pb-2 scrollbar-hide"
          role="tablist"
        >
          {SPECIALITIES.map((s) => {
            const active = selectedSpeciality === s;
            return (
              <button
                key={s}
                role="tab"
                aria-selected={active}
                onClick={() => handleSpecialityClick(s)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-primary !text-white shadow-md shadow-primary/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/40"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Layout: sidebar (sm+) + grid ──────────────── */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Sticky sidebar — desktop only */}
        <aside className="hidden sm:block flex-shrink-0 w-56">
          <div className="sticky top-24 rounded-2xl bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700 p-3">
            <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase px-2 mb-2">
              Specialities
            </p>
            <ul className="flex flex-col gap-0.5">
              {SPECIALITIES.map((s) => {
                const active = selectedSpeciality === s;
                return (
                  <li key={s}>
                    <button
                      onClick={() => handleSpecialityClick(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 w-full min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            <span className="font-semibold text-gray-900 dark:text-white">{filterDoc.length}</span>{" "}
            {filterDoc.length === 1 ? "doctor" : "doctors"}
            {selectedSpeciality !== "All" && (
              <> in <span className="font-semibold text-gray-900 dark:text-white">{selectedSpeciality}</span></>
            )}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-auto gap-2 sm:gap-4 gap-y-3 sm:gap-y-6">
            {filterDoc.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
