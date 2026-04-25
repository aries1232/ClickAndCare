import React from "react";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { assets } from "../assets/assets";

const CONTACT_CARDS = [
  {
    icon: HiOutlineLocationMarker,
    label: "Visit",
    title: "Our Office",
    body: ["MNNIT Allahabad", "Teliyarganj, Prayagraj, India — 211004"],
    href: "https://www.google.com/maps/search/MNNIT+Allahabad",
    cta: "Get directions",
  },
  {
    icon: HiOutlinePhone,
    label: "Call",
    title: "Talk to us",
    body: ["+91 XXXXX XXXXX", "Mon–Sat, 9:00 AM – 7:00 PM IST"],
    href: "#",
    cta: "Call now",
  },
  {
    icon: HiOutlineMail,
    label: "Email",
    title: "Drop a line",
    body: ["admin@clickandcare.com", "We reply within one business day"],
    href: "mailto:admin@clickandcare.com",
    cta: "Send email",
  },
];

const Contact = () => {
  return (
    <div className="pb-24">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="pt-12 pb-10 text-center">
        <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Contact Us
        </p>
        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          We'd love to hear from <span className="text-primary">you</span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Questions, feedback, partnership ideas — pick a channel, we'll get back to you fast.
        </p>
      </section>

      {/* ─── Contact cards ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {CONTACT_CARDS.map(({ icon: Icon, label, title, body, href, cta }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <Icon className="w-6 h-6" />
            </div>
            <p className="mt-5 text-xs font-semibold tracking-wider text-primary uppercase">{label}</p>
            <h3 className="mt-1 font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
              {body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all duration-200">
              {cta}
              <HiOutlineArrowRight className="w-4 h-4" />
            </p>
          </a>
        ))}
      </section>

      {/* ─── Support hours + Careers ─────────────────────────── */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-xl shadow-primary/20">
          <HiOutlineClock className="w-8 h-8" />
          <h3 className="mt-4 font-semibold text-xl">Support hours</h3>
          <p className="mt-1 text-sm text-white/80">When our team is available to help.</p>
          <ul className="mt-5 text-sm text-white/95 space-y-2">
            <li className="flex justify-between border-b border-white/15 pb-2">
              <span>Monday – Friday</span>
              <span className="font-medium">9:00 – 19:00</span>
            </li>
            <li className="flex justify-between border-b border-white/15 pb-2">
              <span>Saturday</span>
              <span className="font-medium">10:00 – 16:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span className="font-medium">Closed</span>
            </li>
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <img src={assets.contact_image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/40 to-gray-900/10" />
          <div className="relative p-7 flex flex-col justify-end h-full min-h-[260px] text-white">
            <HiOutlineBriefcase className="w-8 h-8" />
            <h3 className="mt-3 font-semibold text-xl">Careers at Click&Care</h3>
            <p className="mt-1 text-sm text-white/85 max-w-md">
              Join our mission to simplify healthcare. We're hiring across engineering, design, and operations.
            </p>
            <button className="mt-5 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white !text-gray-900 font-semibold text-sm shadow-md hover:bg-gray-100 active:scale-[0.98] transition-all duration-200">
              Explore Open Roles
              <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
