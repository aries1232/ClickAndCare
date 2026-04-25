import React from 'react';
import { Link } from 'react-router-dom';
import { specialityData } from '../assets/assets.js';

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="py-8 sm:py-16 text-gray-800 dark:text-white">
      <div className="flex flex-col items-center gap-2 sm:gap-4 text-center">
        <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Specialities
        </p>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">Find By Speciality</h2>
        <p className="hidden sm:block md:w-2/3 text-sm text-gray-600 dark:text-gray-300">
          Browse our extensive list of trusted doctors and book hassle-free.
        </p>
      </div>

      <div className="flex sm:justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full overflow-x-auto scrollbar-hide">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            onClick={() => window.scrollTo(0, 0)}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center text-[11px] sm:text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-transform duration-300"
          >
            <img className="w-12 sm:w-24 mb-1.5 sm:mb-2" src={item.image} alt="" />
            <p className="whitespace-nowrap">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
