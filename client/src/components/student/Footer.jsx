import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-[#07111f] text-white mt-24">
        <div className="px-6 md:px-12 lg:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {/* Left */}
            <div>
              <img src={assets.logo_dark} alt="" className="h-10 mb-6" />

              <p className="text-gray-400 leading-8 max-w-md">
                Learn from industry experts and build the skills needed to
                advance your career. Join thousands of students learning
                worldwide.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Company</h3>

              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">
                  Home
                </li>

                <li className="hover:text-white cursor-pointer transition">
                  About Us
                </li>

                <li className="hover:text-white cursor-pointer transition">
                  Courses
                </li>

                <li className="hover:text-white cursor-pointer transition">
                  Contact
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Subscribe to our newsletter
              </h3>

              <p className="text-gray-400 mb-6 leading-7">
                Get updates about new courses, offers, and learning resources.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#162235] border border-gray-700 outline-none"
                />

                <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-14 pt-8">
            <p className="text-center text-gray-400">
              © 2026 Edemy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
