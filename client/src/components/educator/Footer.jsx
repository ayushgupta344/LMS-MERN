import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate =useNavigate()
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-12 lg:px-16 py-5">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className="w-24" />

          <div className="hidden md:block h-6 w-px bg-gray-300"></div>

          <p className="text-gray-500 text-sm">
            Copyright 2025 © GreatStack. All Right Reserved.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all"
          >
            <img
              src={assets.facebook_icon}
              alt="Facebook"
              className="w-5 h-5"
            />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 transition-all"
          >
            <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5" />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 transition-all"
          >
            <img
              src={assets.instagram_icon}
              alt="Instagram"
              className="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
