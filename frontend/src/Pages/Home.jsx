import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import Header from '../Components/Header.jsx';
import SpecialityMenu from '../Components/SpecialityMenu.jsx';
import TopDoctor from '../Components/TopDoctor.jsx';

const STEPS = [
  {
    icon: HiOutlineSearch,
    step: '01',
    title: 'Find the right doctor',
    body: 'Search by speciality, ratings or availability — every doctor is verified.',
  },
  {
    icon: HiOutlineCalendar,
    step: '02',
    title: 'Book in seconds',
    body: 'Pick a slot, pay securely, and get instant confirmation in your inbox.',
  },
  {
    icon: HiOutlineChatAlt2,
    step: '03',
    title: 'Consult & follow up',
    body: 'Chat with your doctor, download receipts, and manage everything in one place.',
  },
];

const HowItWorks = () => (
  <section className="py-16">
    <div className="text-center max-w-2xl mx-auto">
      <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
        How It Works
      </p>
      <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        Three steps to better care
      </h2>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {STEPS.map(({ icon: Icon, step, title, body }, i) => (
        <div
          key={step}
          className="relative p-7 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
        >
          <span className="absolute top-5 right-5 text-5xl font-extrabold text-primary/10 select-none">
            {step}
          </span>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="mt-5 font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>

          {i < STEPS.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  </section>
);

const FinalCta = () => (
  <section className="my-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white px-6 py-10 sm:px-12 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-xl shadow-primary/20">
    <div>
      <h3 className="text-2xl sm:text-3xl font-bold">Ready to feel better?</h3>
      <p className="mt-2 text-white/85">
        Book your first appointment in under a minute.
      </p>
    </div>
    <Link
      to="/doctors"
      onClick={() => window.scrollTo(0, 0)}
      className="inline-flex items-center gap-2 px-7 py-3.5 bg-white !text-gray-900 dark:!text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
    >
      Browse Doctors
      <HiOutlineArrowRight className="w-5 h-5" />
    </Link>
  </section>
);

const Home = () => (
  <div>
    <Header />
    <SpecialityMenu />
    <HowItWorks />
    <TopDoctor />
    <FinalCta />
  </div>
);

export default Home;
