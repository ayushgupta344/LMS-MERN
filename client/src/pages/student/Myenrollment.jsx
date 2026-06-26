import React, { useContext, useState, useEffect } from "react";
import { Appcontext } from "../../context/Appcontext";
import Footer from "../../components/student/Footer";

// ── Per-course progress is stored in localStorage so it persists ──────
const STORAGE_KEY = "lms_enrollment_progress";

const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
const saveProgress = (data) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// ── Helpers ────────────────────────────────────────────────────────────
const getTotalLectures = (content) =>
  content?.reduce((s, ch) => s + ch.chapterContent.length, 0) || 0;

const getTotalDuration = (content) => {
  const mins = content?.reduce(
    (s, ch) => s + ch.chapterContent.reduce((ss, l) => ss + l.lectureDuration, 0), 0
  ) || 0;
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h > 0 && m > 0) return `${h} hour${h > 1 ? "s" : ""}, ${m} minute${m > 1 ? "s" : ""}`;
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${m} minute${m > 1 ? "s" : ""}`;
};

// ── Summary stats card ─────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div className={`flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ── Progress bar ───────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div
      className={`h-2 rounded-full transition-all duration-700 ${
        pct >= 100 ? "bg-green-500" : pct > 0 ? "bg-blue-500" : "bg-gray-300"
      }`}
      style={{ width: `${Math.min(pct, 100)}%` }}
    />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────
const Myenrollment = () => {
  const { allcourses, navigate } = useContext(Appcontext);

  // Use all courses as "enrolled" (since no auth/backend yet)
  const enrolledCourses = allcourses || [];

  // progress: { [courseId]: Set of completed lectureIds } — stored as arrays
  const [progress, setProgress] = useState(loadProgress);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => { saveProgress(progress); }, [progress]);

  // Toggle a lecture as complete/incomplete
  const toggleLecture = (courseId, lectureId) => {
    setProgress((prev) => {
      const current = new Set(prev[courseId] || []);
      current.has(lectureId) ? current.delete(lectureId) : current.add(lectureId);
      return { ...prev, [courseId]: [...current] };
    });
  };

  // Mark all lectures in a course complete
  const markAllComplete = (course) => {
    const all = course.courseContent.flatMap((ch) =>
      ch.chapterContent.map((l) => l.lectureId)
    );
    setProgress((prev) => ({ ...prev, [course._id]: all }));
  };

  // Reset progress for a course
  const resetProgress = (courseId) => {
    setProgress((prev) => ({ ...prev, [courseId]: [] }));
  };

  // ── Derived summary stats ────────────────────────────────────────────
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter((c) => {
    const total = getTotalLectures(c.courseContent);
    const done = (progress[c._id] || []).length;
    return total > 0 && done >= total;
  }).length;
  const inProgressCourses = enrolledCourses.filter((c) => {
    const done = (progress[c._id] || []).length;
    const total = getTotalLectures(c.courseContent);
    return done > 0 && done < total;
  }).length;
  const notStarted = enrolledCourses.filter((c) => !(progress[c._id] || []).length).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <div className="bg-cyan-100/70 border-b border-gray-200 px-4 sm:px-10 md:px-14 lg:px-36 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">My Enrollments</h1>
        <p className="text-gray-500 text-sm">
          Track your learning progress across all enrolled courses
        </p>
      </div>

      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">

        {/* ── SUMMARY STATS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Enrolled"    value={totalCourses}      icon="📚" color="bg-blue-50 text-blue-600" />
          <StatCard label="Completed"         value={completedCourses}  icon="✅" color="bg-green-50 text-green-600" />
          <StatCard label="In Progress"       value={inProgressCourses} icon="⏳" color="bg-amber-50 text-amber-600" />
          <StatCard label="Not Started"       value={notStarted}        icon="🔖" color="bg-gray-100 text-gray-500" />
        </div>

        {/* ── COURSES TABLE ─────────────────────────────────────────── */}
        {enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-6xl mb-4">📭</span>
            <p className="text-xl font-semibold text-gray-600 mb-2">No enrollments yet</p>
            <p className="text-sm mb-6">Start learning by enrolling in a course</p>
            <button
              onClick={() => navigate("/course-list")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_160px] gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-600">Course</span>
              <span className="text-sm font-semibold text-gray-600">Duration</span>
              <span className="text-sm font-semibold text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-gray-600">Status</span>
            </div>

            {/* Rows */}
            {enrolledCourses.map((course, idx) => {
              const totalLec   = getTotalLectures(course.courseContent);
              const doneLec    = (progress[course._id] || []).length;
              const pct        = totalLec > 0 ? Math.round((doneLec / totalLec) * 100) : 0;
              const isComplete = doneLec >= totalLec && totalLec > 0;
              const isOpen     = expandedCourse === course._id;
              const duration   = getTotalDuration(course.courseContent);

              return (
                <div
                  key={course._id}
                  className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                    isOpen ? "bg-blue-50/30" : "hover:bg-gray-50/60"
                  }`}
                >
                  {/* Main row */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_160px] gap-4 px-6 py-5 items-center">

                    {/* Course info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-20 h-14 object-cover rounded-lg shrink-0 border border-gray-100"
                        onError={(e) => { e.target.src = "https://placehold.co/160x100/dbeafe/1d4ed8?text=Course"; }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
                          {course.courseTitle}
                        </p>
                        {/* Progress bar */}
                        <div className="mt-2 w-full max-w-[220px]">
                          <ProgressBar pct={pct} />
                          <p className="text-xs text-gray-400 mt-1">{pct}% complete</p>
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="text-gray-400">⏱</span>
                      <span>{duration}</span>
                    </div>

                    {/* Completed lectures */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {doneLec} / {totalLec}
                      </span>
                      <span className="text-xs text-gray-400">Lectures</span>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status badge */}
                      <span
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold text-white whitespace-nowrap ${
                          isComplete ? "bg-green-500" : "bg-blue-600"
                        }`}
                      >
                        {isComplete ? "Completed" : "On Going"}
                      </span>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedCourse(isOpen ? null : course._id)}
                        className="text-gray-400 hover:text-blue-600 transition text-lg leading-none"
                        title={isOpen ? "Collapse" : "Expand lectures"}
                      >
                        {isOpen ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>

                  {/* ── Expanded lecture checklist ─────────────────── */}
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                        {/* Checklist header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-700">
                            Lecture Progress
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => markAllComplete(course)}
                              className="text-xs text-green-600 hover:text-green-700 font-medium border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition"
                            >
                              ✓ Mark all done
                            </button>
                            <button
                              onClick={() => resetProgress(course._id)}
                              className="text-xs text-gray-500 hover:text-red-500 font-medium border border-gray-200 hover:border-red-200 bg-gray-50 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                            >
                              ↺ Reset
                            </button>
                            <button
                              onClick={() => navigate(`/player/${course._id}`)}
                              className="text-xs text-white font-medium bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
                            >
                              ▶ Continue
                            </button>
                          </div>
                        </div>

                        {/* Chapters + lectures */}
                        {course.courseContent?.map((chapter, ci) => (
                          <div key={chapter.chapterId}
                            className={ci < course.courseContent.length - 1 ? "border-b border-gray-100" : ""}
                          >
                            {/* Chapter label */}
                            <div className="px-4 py-2.5 bg-gray-50/70 flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                {chapter.chapterTitle}
                              </span>
                              <span className="text-xs text-gray-400">
                                {chapter.chapterContent.filter(l =>
                                  (progress[course._id] || []).includes(l.lectureId)
                                ).length} / {chapter.chapterContent.length} done
                              </span>
                            </div>

                            {/* Lectures */}
                            {chapter.chapterContent.map((lecture, li) => {
                              const isDone = (progress[course._id] || []).includes(lecture.lectureId);
                              return (
                                <label
                                  key={lecture.lectureId}
                                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                                    ${li < chapter.chapterContent.length - 1 ? "border-b border-gray-50" : ""}
                                    ${isDone ? "bg-green-50/40 hover:bg-green-50" : "hover:bg-blue-50/30"}`}
                                >
                                  {/* Custom checkbox */}
                                  <div
                                    onClick={() => toggleLecture(course._id, lecture.lectureId)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer
                                      ${isDone
                                        ? "bg-green-500 border-green-500"
                                        : "border-gray-300 hover:border-blue-400"}`}
                                  >
                                    {isDone && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>

                                  {/* Lecture info */}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                                      {lecture.lectureTitle}
                                    </p>
                                  </div>

                                  {/* Duration */}
                                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {lecture.lectureDuration >= 60
                                      ? `${Math.floor(lecture.lectureDuration/60)}h ${lecture.lectureDuration%60}m`
                                      : `${lecture.lectureDuration} min`}
                                  </span>

                                  {/* Preview indicator */}
                                  {lecture.isPreviewFree && (
                                    <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 shrink-0">
                                      Free
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        ))}

                        {/* Mini progress summary */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
                          <div className="flex-1">
                            <ProgressBar pct={pct} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                            {doneLec}/{totalLec} lectures · {pct}%
                          </span>
                          {isComplete && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                              🎉 Completed!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Myenrollment;
