import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const Testimonials = () => {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-900">Testimonials</h2>

          <p className="mt-4 text-gray-500 max-w-3xl mx-auto text-lg">
            Hear from our learners as they share their journeys of
            transformation, success, and how our platform has made a difference
            in their lives.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {dummyTestimonial.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Top */}
              <div className="bg-gray-50 p-6 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-[#6B5B95] font-medium">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Bottom */}
              <div className="p-6">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(item.rating)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt=""
                      className="w-5 h-5"
                    />
                  ))}
                </div>

                <p className="text-gray-500 leading-8 text-lg">
                  {item.feedback}
                </p>

                <button className="text-blue-600 mt-8 underline hover:text-blue-800">
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
