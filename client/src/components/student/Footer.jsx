import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-[#07111f] text-white w-full mt-20">
      <div className="px-6 md:px-16 lg:px-28 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Left */}
          <div>
            <img src={assets.logo_dark} alt="" className="h-8 mb-8" />

            <p className="text-gray-400 leading-8 max-w-md">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>

          {/* Middle */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">Company</h3>

            <ul className="space-y-4 text-gray-400">
              <li className="cursor-pointer hover:text-white">Home</li>
              <li className="cursor-pointer hover:text-white">About us</li>
              <li className="cursor-pointer hover:text-white">Contact us</li>
              <li className="cursor-pointer hover:text-white">
                Privacy policy
              </li>
            </ul>
          </div>

          {/* Right */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">
              Subscribe to our newsletter
            </h3>

            <p className="text-gray-400 leading-8 mb-6">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#18253a] border border-[#2c3c56] px-4 py-3 rounded-l-md w-full outline-none"
              />

              <button className="bg-blue-600 hover:bg-blue-700 px-6 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-12" />

        <p className="text-center text-gray-400">
          Copyright 2026 © Edemy. All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
