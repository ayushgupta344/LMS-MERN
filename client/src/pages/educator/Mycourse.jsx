import React, { useContext, useState } from "react";
import { Appcontext } from "../../context/Appcontext";

const Mycourse = () => {
  const { allcourses, currency } = useContext(Appcontext);

  const [courseStatus, setCourseStatus] = useState(
    allcourses.reduce((acc, course) => {
      acc[course._id] = true;
      return acc;
    }, {}),
  );

  const toggleStatus = (id) => {
    setCourseStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Courses</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[3fr_1fr_1fr_1.2fr] bg-gray-50 border-b px-6 py-4 font-semibold text-gray-700 text-sm">
          <p>All Courses</p>
          <p>Earnings</p>
          <p>Students</p>
          <p>Course Status</p>
        </div>

        {/* Body */}
        {allcourses.map((course, index) => (
          <div
            key={course._id}
            className={`grid grid-cols-[3fr_1fr_1fr_1.2fr] items-center px-6 py-4 transition hover:bg-gray-50 ${
              index !== allcourses.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            {/* Course */}
            <div className="flex items-center gap-4">
              <img
                src={course.courseThumbnail}
                alt=""
                className="w-14 h-10 object-cover rounded"
              />

              <p className="text-sm text-gray-700">{course.courseTitle}</p>
            </div>

            {/* Earnings */}
            <p className="text-sm text-gray-600">
              {currency}
              {Math.floor(
                course.enrolledStudents.length *
                  (course.coursePrice -
                    (course.discount * course.coursePrice) / 100),
              )}
            </p>

            {/* Students */}
            <p className="text-sm text-gray-600">
              {course.enrolledStudents.length}
            </p>

            {/* Status */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(course._id)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  courseStatus[course._id] ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                    courseStatus[course._id] ? "left-6" : "left-0.5"
                  }`}
                ></span>
              </button>

              <span
                className={`text-sm ${
                  courseStatus[course._id] ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {courseStatus[course._id] ? "Live" : "Private"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mycourse;
