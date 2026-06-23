import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-semibold text-slate-800">
          Learn anything, anytime, anywhere
        </h2>

        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim
          id veniam aliqua proident excepteur commodo do ea.
        </p>

        <div className="flex items-center justify-center gap-8 mt-10">
          <button className="bg-blue-600 text-white px-10 py-3 rounded-md font-medium hover:bg-blue-700 transition">
            Get started
          </button>

          <button className="flex items-center gap-2 text-slate-700 font-medium">
            Learn more
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
