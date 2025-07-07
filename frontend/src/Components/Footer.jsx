import React from "react";
import { assets } from "./../assets/assets";
import Home from "../Pages/Home";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="w-40" src={assets.logo} alt="" />
          <p className="pl-2.5 w-full md:w-2/3 text-gray-600 dark:text-white leading-6">Click&Care is a seamless doctor appointment booking platform designed to make healthcare access easy and hassle-free. With just a few clicks, patients can browse verified doctors, check availability, and schedule appointments at their convenience. Our goal is to bridge the gap between patients and healthcare professionals, ensuring a smooth and reliable experience for everyone.
          </p>
        </div>

        <div>
          <p className="pt-6 pb-1 text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-white">
            
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="pt-6 pb-1 text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-white">
            <li>9120532550</li>
            <li>admin@clickandcare.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright © 2025 Click&Care - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
