import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
} from 'react-icons/hi';
import Header from '../Components/Header.jsx';
import SpecialityMenu from '../Components/SpecialityMenu.jsx';
import TopDoctor from '../Components/TopDoctor.jsx';
import { assets } from '../assets/assets.js';

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
  <section className="py-10 sm:py-16">
    <div className="text-center max-w-2xl mx-auto">
      <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
        How It Works
      </p>
      <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        Three steps to better care
      </h2>
    </div>

    <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {STEPS.map(({ icon: Icon, step, title, body }, i) => (
        <div
          key={step}
          className="relative p-4 sm:p-7 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
        >
          <span className="absolute top-3 right-4 sm:top-5 sm:right-5 text-3xl sm:text-5xl font-extrabold text-primary/10 select-none">
            {step}
          </span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="mt-3 sm:mt-5 font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>

          {i < STEPS.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  </section>
);

const PaymentTrust = () => (
  <section className="py-8 sm:py-16">
    <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div className="p-4 sm:p-10 lg:p-12">
          <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Payments
          </p>
          <h2 className="mt-3 sm:mt-4 text-lg sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            <span className="block">Pay securely with</span>
            <span className="inline-flex items-center bg-[#635bff] rounded-md px-2 py-1 mt-1.5 sm:mt-2">
              <img src={assets.stripe_logo} alt="Stripe" className="h-5 sm:h-7 w-auto brightness-0 invert" />
            </span>
          </h2>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            <span className="hidden sm:inline">All consultation fees are processed through{' '}
              <span className="font-semibold text-gray-900 dark:text-white">Stripe</span> — the same
              payments platform trusted by Amazon, Shopify and Google. Your card details never touch
              our servers; everything is encrypted and PCI-compliant end-to-end.</span>
            <span className="sm:hidden">Card details never touch our servers — encrypted, PCI-compliant.</span>
          </p>

          <ul className="mt-3 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
            <li className="flex items-center gap-2 sm:items-start sm:gap-3">
              <span className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HiOutlineLockClosed className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">256-bit encryption</p>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Bank-grade TLS in transit</p>
              </div>
            </li>
            <li className="flex items-center gap-2 sm:items-start sm:gap-3">
              <span className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HiOutlineShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">PCI-DSS Level 1</p>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Highest payment standard</p>
              </div>
            </li>
            <li className="flex items-center gap-2 sm:items-start sm:gap-3">
              <span className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HiOutlineCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">Cards & UPI</p>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Visa · Mastercard · UPI · GPay</p>
              </div>
            </li>
            <li className="flex items-center gap-2 sm:items-start sm:gap-3">
              <span className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">Instant receipts</p>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Downloadable PDFs by email</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Stripe brand panel — desktop only (mobile already shows
            the Stripe pill in the heading, no need for a second logo). */}
        <div className="hidden md:flex relative bg-gradient-to-br from-[#635bff] to-[#7a73ff] items-center justify-center p-8 sm:p-10 min-h-[260px] overflow-hidden">
          <div className="absolute -top-24 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="relative text-center text-white">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/85">Powered by</p>
            <img src={assets.stripe_logo} alt="Stripe" className="mt-3 h-9 sm:h-12 w-auto brightness-0 invert mx-auto" />
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/90 max-w-xs mx-auto">
              Trusted by millions of businesses to handle billions in payments — securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FinalCta = () => (
  <section className="my-10 sm:my-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white px-6 py-8 sm:px-12 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left shadow-xl shadow-primary/20">
    <div>
      <h3 className="text-xl sm:text-3xl font-bold">Ready to feel better?</h3>
      <p className="mt-2 text-sm sm:text-base text-white/85">
        Book your first appointment in under a minute.
      </p>
    </div>
    <Link
      to="/doctors"
      onClick={() => window.scrollTo(0, 0)}
      className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-7 py-3 bg-white !text-gray-900 dark:!text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
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
    <PaymentTrust />
    <FinalCta />
  </div>
);

export default Home;
