import React, { useContext } from "react";
import { assets, dummyDashboardData } from "../../assets/assets";
import { Appcontext } from "../../context/Appcontext";

const StatCard = ({ icon, value, label, color }) => (
  <div
    className={`flex items-center gap-4 bg-white border rounded-xl px-6 py-5 shadow-sm ${color}`}
  >
    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
      <img src={icon} alt={label} className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { currency } = useContext(Appcontext);
  const { totalEarnings, enrolledStudentsData, totalCourses } =
    dummyDashboardData;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex-1 p-8 overflow-x-auto">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={assets.patients_icon}
          value={enrolledStudentsData.length}
          label="Total Enrolments"
          color="border-blue-100"
        />
        <StatCard
          icon={assets.appointments_icon}
          value={totalCourses}
          label="Total Courses"
          color="border-blue-100"
        />
        <StatCard
          icon={assets.earning_icon}
          value={`${currency}${totalEarnings.toFixed(2)}`}
          label="Total Earnings"
          color="border-blue-100"
        />
      </div>

      {/* Latest Enrolments table */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Latest Enrolments
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_2fr_130px] px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500">#</span>
            <span className="text-xs font-semibold text-gray-500">
              Student name
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Course Title
            </span>
            <span className="text-xs font-semibold text-gray-500">Date</span>
          </div>

          {/* Rows */}
          {enrolledStudentsData.map((entry, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[40px_1fr_2fr_130px] items-center px-5 py-4 transition-colors hover:bg-gray-50
                ${idx < enrolledStudentsData.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <span className="text-sm text-gray-500">{idx + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={entry.student.imageUrl}
                  alt={entry.student.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                  onError={(e) => {
                    e.target.src = assets.profile_img_1;
                  }}
                />
                <span className="text-sm text-gray-700 truncate">
                  {entry.student.name}
                </span>
              </div>
              <span className="text-sm text-gray-700 truncate pr-4">
                {entry.courseTitle}
              </span>
              <span className="text-sm text-gray-500">
                {/* Use a static date since dummy data has no purchaseDate */}
                22 Aug, 2024
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
