import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-800">
      {/* Mobile: tight 2-column layout (logo+blurb left, links right). */}
      <div className="sm:hidden py-6 grid grid-cols-[1.4fr_1fr] gap-6 text-xs">
        <div>
          <img className="w-24" src={assets.logo} alt="Click&Care" />
          <p className="mt-2 text-gray-600 dark:text-gray-400 leading-5">
            Book verified doctors in seconds.
          </p>
          <div className="mt-3 flex flex-col gap-1.5 text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlinePhone className="w-3.5 h-3.5" />
              +91 XXXXX XXXXX
            </span>
            <a
              href="mailto:admin@clickandcare.com"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors break-all"
            >
              <HiOutlineMail className="w-3.5 h-3.5" />
              admin@clickandcare.com
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold tracking-wider text-gray-900 dark:text-white uppercase mb-2">
            Company
          </p>
          <ul className="flex flex-col gap-1.5 text-gray-600 dark:text-gray-400">
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">About us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact us</Link>
            </li>
            <li>
              <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop: original 3-column layout. */}
      <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-10 text-sm">
        <div>
          <img className="w-32" src={assets.logo} alt="Click&Care" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 leading-6 max-w-md">
            Click&Care is a seamless doctor appointment booking platform — browse verified doctors,
            check availability, and book in seconds.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase mb-4">
            Company
          </p>
          <ul className="flex flex-col gap-2.5 text-gray-600 dark:text-gray-400">
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">About us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact us</Link>
            </li>
            <li>
              <span className="hover:text-primary transition-colors cursor-pointer">Privacy policy</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase mb-4">
            Get in touch
          </p>
          <ul className="flex flex-col gap-2.5 text-gray-600 dark:text-gray-400">
            <li>
              <span className="inline-flex items-center gap-2">
                <HiOutlinePhone className="w-4 h-4" />
                +91 XXXXX XXXXX
              </span>
            </li>
            <li>
              <a
                href="mailto:admin@clickandcare.com"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                <HiOutlineMail className="w-4 h-4" />
                admin@clickandcare.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 py-3 sm:py-5 text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} Click&Care — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
