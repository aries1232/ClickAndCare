import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { AppContext } from '../context/AppContext';
import DoctorCard from './DoctorCard.jsx';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      setRelDoc(doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId));
    }
  }, [doctors, speciality, docId]);

  if (relDoc.length === 0) return null;

  return (
    <section className="mt-16 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
        <div>
          <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Related Doctors
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Other {speciality}s you can book
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Same speciality, different schedules — find the one that fits.
          </p>
        </div>
        <Link
          to={`/doctors/${speciality}`}
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-200 self-start sm:self-end"
        >
          View all
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-auto gap-4 gap-y-6">
        {relDoc.slice(0, 6).map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};

export default RelatedDoctors;
