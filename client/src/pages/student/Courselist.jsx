import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../../context/Appcontext";
import { Link,useNavigate, useParams } from "react-router-dom";
import Coursecard from "../../components/student/Coursecard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CourseList = () => {
  const { allcourses } = useContext(Appcontext);

  const { input } = useParams();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allcourses && allcourses.length > 0) {
      const tempCourses = allcourses.slice();

      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase()),
            ),
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allcourses, input]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/course-list/${searchInput}`);
    } else {
      navigate("/course-list");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold">Course List</h1>

            <div className="flex items-center gap-1 text-sm mt-2">
              <Link to="/" className="text-blue-500">
                Home
              </Link>

              <span className="text-gray-400">/</span>

              <span className="text-gray-500">Course List</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex border rounded-md overflow-hidden w-full lg:w-[420px]">
            <div className="flex items-center px-3">
              <img
                src={assets.search_icon}
                alt=""
                className="w-4 h-4 opacity-60"
              />
            </div>

            <input
              type="text"
              placeholder="Search for courses"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 px-2 py-3 outline-none text-sm"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Result Text */}
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8-mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredCourse.map((course) => (
            <Coursecard key={course._id} course={course} />
          ))}
        </div>

        {/* No Results */}
        {filteredCourse.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">
              No courses found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching with a different keyword.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredCourse.length > 0 && (
          <div className="flex justify-center mt-10">
            <button className="border px-8 py-3 rounded-md text-gray-500 hover:bg-gray-50">
              Load More
            </button>
          </div>
        )}
      </div>
        <Footer />
    </>
  );
};

export default CourseList;
