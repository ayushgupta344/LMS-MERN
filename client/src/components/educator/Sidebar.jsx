import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { Appcontext } from "../../context/Appcontext";

const navItems = [
  { label: "Dashboard", path: "/educator", icon: assets.home_icon },
  { label: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
  {
    label: "My Courses",
    path: "/educator/my-courses",
    icon: assets.my_course_icon,
  },
  {
    label: "Student Enrolled",
    path: "/educator/student-enrolled",
    icon: assets.person_tick_icon,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-[200px] min-h-[calc(100vh-64px)] border-r border-gray-200 bg-white shrink-0 sticky top-16">
      <nav className="pt-4">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/educator"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors relative
               ${
                 isActive
                   ? "text-blue-600 bg-blue-50 border-r-[3px] border-blue-600"
                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
               }`
            }
          >
            <img src={icon} alt="" className="w-5 h-5 opacity-70" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
