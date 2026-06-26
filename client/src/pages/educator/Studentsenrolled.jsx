import React, { useEffect, useState } from "react";
import { dummyDashboardData,dummyStudentEnrolled, assets } from "../../assets/assets";
const Studentsenrolled = () => {
  const { enrolledStudentsData } = dummyDashboardData;
 const [enrolled,setEnrolled]=useState([])
 const fetchenroll=  ()=>{
  setEnrolled(dummyStudentEnrolled)
 }
 useEffect(()=>{
  fetchenroll()
 },[])
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Student Enrolled
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[60px_2fr_3fr_1.3fr] px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
          <p>#</p>
          <p>Student name</p>
          <p>Course Title</p>
          <p>Date</p>
        </div>

        {/* Body */}
        {enrolled.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[60px_2fr_3fr_1.3fr] items-center px-6 py-4 hover:bg-gray-50 transition
            ${
              index !== enrolled.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            {/* Serial */}
            <p className="text-gray-500">{index + 1}</p>

            {/* Student */}
            <div className="flex items-center gap-3">
              <img
                src={item.student.imageUrl}
                alt={item.student.name}
                className="w-10 h-10 rounded-full object-cover border"
                onError={(e) => (e.target.src = assets.profile_img)}
              />

              <p className="text-gray-700 font-medium">{item.student.name}</p>
            </div>

            {/* Course */}
            <p className="text-gray-600 truncate">{item.courseTitle}</p>

            {/* Date */}
            <p className="text-gray-500">
              {item.purchaseDate
                ? formatDate(item.purchaseDate)
                : "22 Aug, 2024"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studentsenrolled;
