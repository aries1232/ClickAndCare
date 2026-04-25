import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 py-10 text-sm">
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
              <a href="mailto:admin@clickandcare.com" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                <HiOutlineMail className="w-4 h-4" />
                admin@clickandcare.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 py-5 text-center text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} Click&Care — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
