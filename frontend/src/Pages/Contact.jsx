import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 dark:text-white">
        <p>
          CONTACT <span className="text-gray-700 dark:text-white font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600 dark:text-white">Our OFFICE</p>
          <p className="text-gray-500 dark:text-white">MNNIT Allahabad <br />Teliyarganj, Prayagraj, India-211004</p>
          <p className="text-gray-500 dark:text-white">Tel: +91 9120532550 <br />Email: admin@clickandcare.com</p>
          <p className="font-semibold text-lg text-gray-600 dark:text-white">Careers at CLICK&CARE</p>
          <p className="text-gray-500 dark:text-white">Learn more about our teams and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
