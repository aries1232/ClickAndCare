import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCard.jsx";

const TopDoctor = () => {
  const { doctors } = useContext(AppContext);

  return (
    <section className="py-8 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-10">
        <div>
          <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Top Rated
          </p>
          <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Our top doctors
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xl">
            Verified specialists with great reviews and quick availability.
          </p>
        </div>

        <Link
          to="/doctors"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-200 self-start sm:self-end"
        >
          View all doctors
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile: horizontal scroll row (Netflix/Spotify style). Each card
          is 144px wide and the row bleeds to the screen edge so users can
          swipe through without page scrolling. Desktop keeps the grid. */}
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {doctors.slice(0, 10).map((doctor) => (
            <div key={doctor._id} className="w-36 flex-shrink-0">
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid w-full grid-cols-auto gap-4 gap-y-6">
        {doctors.slice(0, 10).map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};

export default TopDoctor;
