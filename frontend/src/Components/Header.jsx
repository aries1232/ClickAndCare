import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSearch, HiOutlineLockClosed } from 'react-icons/hi';
import { assets } from '../assets/assets.js';

const Header = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 -right-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative flex flex-col md:flex-row items-stretch px-6 sm:px-10 lg:px-16 pt-10 md:pt-14">
        {/* ── Left: copy ── */}
        <div className="md:w-1/2 flex flex-col justify-center text-white pb-10 md:pb-16 z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Book Appointment <br />
            from the{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              Best In Industry
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm sm:text-base text-white/90 leading-relaxed">
            Browse 100+ verified doctors across specialities, check live availability, and book your consultation in under a minute.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href="#speciality"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
            >
              Book Appointment
              <HiOutlineArrowRight className="w-5 h-5" />
            </a>
            <button
              onClick={() => { window.scrollTo(0, 0); navigate('/doctors'); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/10 backdrop-blur-sm !text-white font-semibold ring-2 ring-white/50 hover:bg-white/20 active:scale-[0.98] transition-all duration-200"
            >
              <HiOutlineSearch className="w-5 h-5" />
              Browse Doctors
            </button>
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <img src={assets.group_profiles} alt="" className="h-9 w-auto" />
              <p className="text-xs sm:text-sm text-white/85">
                <span className="font-semibold text-white">50,000+ patients</span> booked with us
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/25" aria-hidden="true" />
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/85">
              <HiOutlineLockClosed className="w-4 h-4 text-white/85" />
              <span>Secure payments by</span>
              <img
                src={assets.stripe_logo}
                alt="Stripe"
                className="h-5 w-auto bg-white/95 rounded px-1.5 py-0.5 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Right: doctor image, anchored to bottom ── */}
        <div className="md:w-1/2 relative flex justify-center md:justify-end items-end">
          <img
            src={assets.header_img}
            alt=""
            className="w-full max-w-sm md:max-w-md h-auto md:absolute md:bottom-0 md:right-0"
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
