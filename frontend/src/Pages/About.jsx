import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineLightningBolt,
  HiOutlineLocationMarker,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { assets } from "./../assets/assets";

const STATS = [
  { value: "100+", label: "Verified Doctors" },
  { value: "50K+", label: "Happy Patients" },
  { value: "4.9", label: "Avg. Rating", suffix: "★" },
  { value: "24/7", label: "Support" },
];

const FEATURES = [
  {
    icon: HiOutlineLightningBolt,
    title: "Efficiency",
    body: "Streamlined appointment scheduling that fits into your busy lifestyle.",
  },
  {
    icon: HiOutlineLocationMarker,
    title: "Convenience",
    body: "Access to a network of trusted healthcare professionals in your area.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Personalization",
    body: "Tailored recommendations and reminders to help you stay on top of your health.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Privacy First",
    body: "Your health records are encrypted and only ever shared with your consent.",
  },
  {
    icon: HiOutlineHeart,
    title: "Patient Care",
    body: "Care plans, follow-ups and chat — designed to make you feel heard.",
  },
  {
    icon: HiOutlineClock,
    title: "Always-On",
    body: "Book, reschedule or chat with your doctor any time, day or night.",
  },
];

const About = () => {
  return (
    <div className="pb-24">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="pt-12 pb-10 text-center">
        <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          About Us
        </p>
        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          Healthcare that meets you{" "}
          <span className="text-primary">where you are</span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Click&Care is your trusted partner for booking appointments, chatting
          with doctors, and managing your health — without the wait.
        </p>
      </section>

      {/* ─── Story ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mt-6">
        <div className="relative w-full max-w-md mx-auto md:mx-0">
          <div className="absolute -inset-3 bg-primary/10 rounded-3xl -rotate-2" aria-hidden="true" />
          <img
            src={assets.about_image}
            alt="About Click&Care"
            className="relative w-full aspect-[4/3] object-cover rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg"
          />
        </div>

        <div className="flex flex-col gap-5 text-gray-600 dark:text-gray-300 leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Our Story
          </h2>
          <p>
            We started Click&Care because booking a doctor's appointment
            shouldn't feel harder than the appointment itself. Long hold times,
            confusing forms, paperwork lost in transit — we wanted a calmer way
            to take care of yourself.
          </p>
          <p>
            Today we connect patients with verified doctors across specialties,
            handle scheduling and payments end-to-end, and keep your records
            tidy in one place — so the only thing you focus on is feeling
            better.
          </p>

          <div className="mt-2 p-5 rounded-xl border-l-4 border-primary bg-primary/5 dark:bg-primary/10">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">Our Vision</p>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              A seamless healthcare experience for every patient — where the
              right doctor is always one tap away.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ────────────────────────────────────────── */}
      <section className="mt-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white px-6 py-10 sm:px-10 sm:py-12 shadow-xl shadow-primary/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {s.value}
                {s.suffix && <span className="ml-1 text-yellow-300">{s.suffix}</span>}
              </p>
              <p className="mt-1 text-sm sm:text-base text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why choose us ─────────────────────────────────────── */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Why Choose Us
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Built for the way you actually live
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="mt-20 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-6 py-10 sm:px-12 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Ready to find your doctor?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Browse 100+ verified specialists. Book in seconds.
          </p>
        </div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-full shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200"
        >
          Browse Doctors
          <HiOutlineArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
};

export default About;
