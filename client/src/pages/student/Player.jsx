import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

// ── localStorage keys ─────────────────────────────────────────────────
const PROGRESS_KEY = "lms_enrollment_progress";
const RATING_KEY   = "lms_course_ratings";

const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
};
const saveProgress = (d) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(d));

const loadRatings = () => {
  try { return JSON.parse(localStorage.getItem(RATING_KEY)) || {}; }
  catch { return {}; }
};
const saveRatings = (d) => localStorage.setItem(RATING_KEY, JSON.stringify(d));

// ── YouTube ID extractor ──────────────────────────────────────────────
const getYoutubeId = (url) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

// ── Duration formatter ────────────────────────────────────────────────
const fmtMins = (mins) => {
  if (!mins) return "0 min";
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m} minute${m !== 1 ? "s" : ""}`;
};

// ── Flat list of all lectures from course ─────────────────────────────
const getAllLectures = (course) =>
  course?.courseContent?.flatMap((ch, ci) =>
    ch.chapterContent.map((l, li) => ({
      ...l,
      chapterTitle: ch.chapterTitle,
      chapterId:    ch.chapterId,
      globalIndex:  `${ci + 1}.${li + 1}`,
    }))
  ) || [];

// ── Star rating widget ────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110 active:scale-95"
      >
        <img
          src={s <= value ? assets.star : assets.star_blank}
          alt={`${s} star`}
          className="w-7 h-7"
        />
      </button>
    ))}
  </div>
);

// ── Main Player ───────────────────────────────────────────────────────
const Player = () => {
  const { courseid } = useParams();
  const { allcourses, navigate, calculaterating } = useContext(Appcontext);

  const [course,       setCourse]       = useState(null);
  const [activeLec,    setActiveLec]    = useState(null);   // current lecture obj
  const [openChapters, setOpenChapters] = useState({});
  const [progress,     setProgress]     = useState(loadProgress);
  const [ratings,      setRatings]      = useState(loadRatings);
  const [hoverRating,  setHoverRating]  = useState(0);
  const [ratingDone,   setRatingDone]   = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);   // mobile sidebar toggle

  // ── Load course ───────────────────────────────────────────────────
  useEffect(() => {
    if (allcourses?.length) {
      const found = allcourses.find((c) => c._id === courseid);
      if (found) {
        setCourse(found);
        // open all chapters by default
        const open = {};
        found.courseContent?.forEach((ch) => { open[ch.chapterId] = true; });
        setOpenChapters(open);
        // auto-play first lecture
        const all = getAllLectures(found);
        if (all.length) setActiveLec(all[0]);
        // restore saved rating
        const savedRatings = loadRatings();
        if (savedRatings[found._id]) setRatingDone(true);
      }
    }
  }, [courseid, allcourses]);

  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => { saveRatings(ratings);   }, [ratings]);

  // ── Mark lecture complete ─────────────────────────────────────────
  const toggleComplete = useCallback((courseId, lectureId) => {
    setProgress((prev) => {
      const cur = new Set(prev[courseId] || []);
      cur.has(lectureId) ? cur.delete(lectureId) : cur.add(lectureId);
      return { ...prev, [courseId]: [...cur] };
    });
  }, []);

  const isCompleted = (lectureId) =>
    (progress[courseid] || []).includes(lectureId);

  // ── Navigate lectures ─────────────────────────────────────────────
  const allLectures = getAllLectures(course);
  const activeIdx   = allLectures.findIndex((l) => l.lectureId === activeLec?.lectureId);

  const goNext = () => {
    if (activeIdx < allLectures.length - 1) {
      // auto-mark current as complete then advance
      if (activeLec && !isCompleted(activeLec.lectureId))
        toggleComplete(courseid, activeLec.lectureId);
      setActiveLec(allLectures[activeIdx + 1]);
    }
  };
  const goPrev = () => {
    if (activeIdx > 0) setActiveLec(allLectures[activeIdx - 1]);
  };

  // ── Submit rating ─────────────────────────────────────────────────
  const submitRating = (star) => {
    if (!course) return;
    setRatings((prev) => ({ ...prev, [course._id]: star }));
    setRatingDone(true);
  };

  // ── Progress stats ────────────────────────────────────────────────
  const totalLec   = allLectures.length;
  const doneLec    = (progress[courseid] || []).length;
  const pct        = totalLec > 0 ? Math.round((doneLec / totalLec) * 100) : 0;
  const courseRating = course ? calculaterating(course) : 0;
  const myRating     = ratings[courseid] || 0;

  // ── Loading ───────────────────────────────────────────────────────
  if (!course) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  const activeYtId = activeLec ? getYoutubeId(activeLec.lectureUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── TOP BREADCRUMB BAR ────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 md:px-14 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-blue-600 transition shrink-0"
            title="Home"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500 truncate">{course.courseTitle}</span>
          {activeLec && (
            <>
              <span className="text-gray-300 shrink-0">/</span>
              <span className="text-sm font-medium text-gray-800 truncate">{activeLec.lectureTitle}</span>
            </>
          )}
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${pct >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-600">{pct}%</span>
          </div>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="lg:hidden p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            title="Toggle course content"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">

        {/* ══ LEFT: Video + info ═══════════════════════════════════════ */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-8 md:px-10 py-6">

            {/* ── VIDEO PLAYER ──────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black mb-3">
              {activeYtId ? (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    key={activeYtId}
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeLec?.lectureTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-900 text-gray-400 gap-3">
                  <svg className="w-16 h-16 opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-sm">Select a lecture to start watching</p>
                </div>
              )}
            </div>

            {/* ── LECTURE TITLE + CONTROLS ───────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="min-w-0">
                <p className="text-xs text-blue-600 font-semibold mb-0.5 uppercase tracking-wide">
                  {activeLec?.globalIndex && `${activeLec.globalIndex} · `}{activeLec?.chapterTitle}
                </p>
                <h2 className="text-lg font-bold text-gray-800 leading-snug">
                  {activeLec?.lectureTitle || "Select a lecture"}
                </h2>
                {activeLec && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {fmtMins(activeLec.lectureDuration)}
                  </p>
                )}
              </div>

              {/* Nav + Mark complete */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={goPrev}
                  disabled={activeIdx <= 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  ← Prev
                </button>
                {activeLec && (
                  <button
                    onClick={() => toggleComplete(courseid, activeLec.lectureId)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                      ${isCompleted(activeLec.lectureId)
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"}`}
                  >
                    {isCompleted(activeLec.lectureId) ? "✓ Completed" : "Mark Complete"}
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={activeIdx >= allLectures.length - 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* ── COURSE STRUCTURE (left column version, matches screenshot) */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Course Structure</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {course.courseContent?.map((chapter, ci) => {
                  const chDoneLec = chapter.chapterContent.filter((l) =>
                    isCompleted(l.lectureId)
                  ).length;
                  const chTotalMins = chapter.chapterContent.reduce(
                    (s, l) => s + l.lectureDuration, 0
                  );
                  return (
                    <div key={chapter.chapterId}
                      className={ci < course.courseContent.length - 1 ? "border-b border-gray-200" : ""}
                    >
                      {/* Chapter header */}
                      <button
                        onClick={() => setOpenChapters((p) => ({ ...p, [chapter.chapterId]: !p[chapter.chapterId] }))}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={assets.down_arrow_icon}
                            alt=""
                            className={`w-4 h-4 transition-transform duration-200 ${openChapters[chapter.chapterId] ? "rotate-0" : "-rotate-90"}`}
                          />
                          <span className="font-semibold text-sm text-gray-800">
                            {chapter.chapterTitle}
                          </span>
                          {chDoneLec === chapter.chapterContent.length && (
                            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                              Done
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                          {chapter.chapterContent.length} lectures – {fmtMins(chTotalMins)}
                        </span>
                      </button>

                      {/* Lectures */}
                      {openChapters[chapter.chapterId] && (
                        <div className="bg-gray-50/60">
                          {chapter.chapterContent.map((lecture, li) => {
                            const isActive = activeLec?.lectureId === lecture.lectureId;
                            const done     = isCompleted(lecture.lectureId);
                            return (
                              <div
                                key={lecture.lectureId}
                                className={`flex items-center justify-between px-5 py-3 pl-[52px] cursor-pointer transition-colors
                                  ${li < chapter.chapterContent.length - 1 ? "border-b border-gray-100" : ""}
                                  ${isActive ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-100/60"}`}
                                onClick={() => setActiveLec({ ...lecture, chapterTitle: chapter.chapterTitle, globalIndex: `${ci+1}.${li+1}` })}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* Completion circle */}
                                  <div
                                    onClick={(e) => { e.stopPropagation(); toggleComplete(courseid, lecture.lectureId); }}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                      ${done ? "bg-green-500 border-green-500" : isActive ? "border-blue-400" : "border-gray-300 hover:border-blue-400"}`}
                                  >
                                    {done && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                      </svg>
                                    )}
                                    {!done && isActive && (
                                      <div className="w-2 h-2 rounded-full bg-blue-500"/>
                                    )}
                                  </div>

                                  <span className={`text-sm truncate ${isActive ? "text-blue-700 font-semibold" : done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                    {lecture.lectureTitle}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 ml-3">
                                  {/* Watch link — matches screenshot style */}
                                  <span
                                    onClick={(e) => { e.stopPropagation(); setActiveLec({ ...lecture, chapterTitle: chapter.chapterTitle, globalIndex: `${ci+1}.${li+1}` }); }}
                                    className={`text-sm font-medium underline cursor-pointer transition ${isActive ? "text-blue-800" : "text-blue-600 hover:text-blue-800"}`}
                                  >
                                    Watch
                                  </span>
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {fmtMins(lecture.lectureDuration)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RATE THIS COURSE ──────────────────────────────────── */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Rate this Course:</h2>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                {ratingDone ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <img key={s} src={s <= myRating ? assets.star : assets.star_blank}
                          alt="" className="w-7 h-7" />
                      ))}
                    </div>
                    <div>
                      <p className="text-green-600 font-semibold text-sm">
                        ✓ Thanks for your rating!
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        You rated this course {myRating} out of 5 stars.
                      </p>
                    </div>
                    <button
                      onClick={() => setRatingDone(false)}
                      className="text-xs text-gray-400 hover:text-blue-600 underline ml-auto transition"
                    >
                      Edit rating
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div
                        className="flex gap-1"
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {[1,2,3,4,5].map((s) => (
                          <button
                            key={s}
                            onMouseEnter={() => setHoverRating(s)}
                            onClick={() => submitRating(s)}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <img
                              src={(hoverRating || myRating) >= s ? assets.star : assets.star_blank}
                              alt={`${s} star`}
                              className="w-7 h-7"
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {hoverRating > 0
                          ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoverRating]
                          : myRating > 0
                            ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][myRating]
                            : "Click to rate"}
                      </span>
                    </div>

                    {/* Course avg */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <img key={s} src={s <= Math.round(courseRating) ? assets.star : assets.star_blank}
                            alt="" className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {courseRating > 0 ? courseRating.toFixed(1) : "No ratings yet"}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({course.courseRatings.length} rating{course.courseRatings.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT SIDEBAR: Course Content ════════════════════════════ */}
        <div className={`
          w-[340px] shrink-0 border-l border-gray-200 bg-white overflow-y-auto
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:flex flex-col" : "hidden"}
          hidden lg:flex flex-col
          sticky top-[57px] h-[calc(100vh-57px)]
        `}>
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-sm">Course Content</h3>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {doneLec}/{totalLec}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${pct >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{pct}% complete</p>
          </div>

          {/* Sidebar chapters */}
          <div className="flex-1 overflow-y-auto">
            {course.courseContent?.map((chapter, ci) => {
              const chDone = chapter.chapterContent.filter((l) => isCompleted(l.lectureId)).length;
              return (
                <div key={chapter.chapterId} className="border-b border-gray-100">
                  {/* Chapter header */}
                  <button
                    onClick={() => setOpenChapters((p) => ({ ...p, [chapter.chapterId]: !p[chapter.chapterId] }))}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={assets.down_arrow_icon}
                        alt=""
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${openChapters[chapter.chapterId] ? "rotate-0" : "-rotate-90"}`}
                      />
                      <span className="text-sm font-semibold text-gray-700 truncate">
                        {chapter.chapterTitle}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                      {chDone}/{chapter.chapterContent.length}
                    </span>
                  </button>

                  {/* Sidebar lecture list */}
                  {openChapters[chapter.chapterId] && chapter.chapterContent.map((lecture, li) => {
                    const isActive = activeLec?.lectureId === lecture.lectureId;
                    const done     = isCompleted(lecture.lectureId);
                    return (
                      <div
                        key={lecture.lectureId}
                        onClick={() => setActiveLec({ ...lecture, chapterTitle: chapter.chapterTitle, globalIndex: `${ci+1}.${li+1}` })}
                        className={`flex items-center gap-3 px-4 py-2.5 pl-9 cursor-pointer transition-colors
                          ${isActive ? "bg-blue-50 border-l-[3px] border-blue-500" : "hover:bg-gray-50"}
                          ${li < chapter.chapterContent.length - 1 ? "border-b border-gray-50" : ""}`}
                      >
                        {/* Checkbox */}
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleComplete(courseid, lecture.lectureId); }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                            ${done ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`}
                        >
                          {done && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </div>

                        {/* Title */}
                        <span className={`text-[13px] flex-1 leading-snug truncate
                          ${isActive ? "text-blue-700 font-semibold" : done ? "text-gray-400 line-through" : "text-gray-700"}`}
                        >
                          {lecture.lectureTitle}
                        </span>

                        {/* Duration */}
                        <span className="text-[11px] text-gray-400 shrink-0">
                          {fmtMins(lecture.lectureDuration)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Sidebar footer: back to course detail */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
            <button
              onClick={() => navigate(`/course/${courseid}`)}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-center transition py-1"
            >
              ← Back to Course Details
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Player;
