import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

// ── Extract YouTube video ID from any YT URL format ──────────────────
export const getYoutubeId = (url) => {
  if (!url) return null;
  // handles: youtu.be/ID  |  youtube.com/watch?v=ID  |  youtube.com/embed/ID
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

const Coursedetail = () => {
  const { id } = useParams();
  const { allcourses, currency, calculaterating, navigate } =
    useContext(Appcontext);

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  // activePreview = { title, youtubeId } | null
  const [activePreview, setActivePreview] = useState(null);

  // ── Find course ─────────────────────────────────────────────────────
  useEffect(() => {
    if (allcourses?.length > 0) {
      const found = allcourses.find((c) => c._id === id);
      if (found) {
        setCourseData(found);
        setActivePreview(null); // reset preview on course change
      }
    }
  }, [id, allcourses]);

  // ── Accordion toggle ────────────────────────────────────────────────
  const toggleSection = (chapterId) =>
    setOpenSections((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));

  // ── Preview click ───────────────────────────────────────────────────
  const handlePreview = (lecture) => {
    const youtubeId = getYoutubeId(lecture.lectureUrl);
    if (!youtubeId) return;
    setActivePreview({ title: lecture.lectureTitle, youtubeId });
    // scroll card into view on mobile
    document
      .getElementById("course-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closePreview = () => setActivePreview(null);

  // ── Helpers ─────────────────────────────────────────────────────────
  const getDiscountedPrice = (c) =>
    (c.coursePrice - (c.discount * c.coursePrice) / 100).toFixed(2);

  const getTotalLectures = (content) =>
    content?.reduce((s, ch) => s + ch.chapterContent.length, 0) || 0;

  const getTotalDuration = (content) => {
    const mins =
      content?.reduce(
        (s, ch) =>
          s + ch.chapterContent.reduce((ss, l) => ss + l.lectureDuration, 0),
        0,
      ) || 0;
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getChapterDuration = (chapterContent) => {
    const mins = chapterContent.reduce((s, l) => s + l.lectureDuration, 0);
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const fmtDuration = (mins) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60),
        m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins} mins`;
  };

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((i) => (
      <img
        key={i}
        src={i <= Math.floor(rating) ? assets.star : assets.star_blank}
        alt=""
        className="w-3.5 h-3.5"
      />
    ));

  // ── Loading ─────────────────────────────────────────────────────────
  if (!courseData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  const rating = calculaterating(courseData);
  const discountedPrice = getDiscountedPrice(courseData);
  const totalLectures = getTotalLectures(courseData.courseContent);
  const totalDuration = getTotalDuration(courseData.courseContent);
  const totalChapters = courseData.courseContent?.length || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-14 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {courseData.courseTitle}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              {courseData.courseDescription
                ?.replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 220)}
              …
            </p>
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="font-bold text-amber-400 text-sm">
                {rating > 0 ? rating.toFixed(1) : "New"}
              </span>
              <div className="flex gap-0.5">{renderStars(rating)}</div>
              <span className="text-gray-400 text-sm">
                ({courseData.courseRatings.length} ratings)
              </span>
              <span className="text-gray-400 text-sm">
                · {courseData.enrolledStudents.length} students
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Course by{" "}
              <span className="text-blue-400 underline cursor-pointer font-medium">
                Richard James
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-14 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">
            {/* Course Structure */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Course Structure
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                {totalChapters} sections · {totalLectures} lectures ·{" "}
                {totalDuration} total duration
              </p>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {courseData.courseContent?.map((chapter, idx) => (
                  <div
                    key={chapter.chapterId}
                    className={
                      idx < courseData.courseContent.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }
                  >
                    {/* Chapter header */}
                    <button
                      onClick={() => toggleSection(chapter.chapterId)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.down_arrow_icon}
                          alt=""
                          className={`w-4 h-4 transition-transform duration-200 ${openSections[chapter.chapterId] ? "rotate-0" : "-rotate-90"}`}
                        />
                        <span className="font-semibold text-sm text-gray-800">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {chapter.chapterContent.length} lectures ·{" "}
                        {getChapterDuration(chapter.chapterContent)}
                      </span>
                    </button>

                    {/* Lectures list */}
                    {openSections[chapter.chapterId] && (
                      <div className="bg-gray-50/80">
                        {chapter.chapterContent.map((lecture, li) => {
                          const isActive =
                            activePreview?.youtubeId ===
                            getYoutubeId(lecture.lectureUrl);
                          return (
                            <div
                              key={lecture.lectureId}
                              className={`flex items-center justify-between px-5 py-3 pl-[52px] transition-colors
                                ${li < chapter.chapterContent.length - 1 ? "border-b border-gray-100" : ""}
                                ${isActive ? "bg-blue-50" : ""}`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                  src={assets.play_icon}
                                  alt=""
                                  className={`w-4 h-4 shrink-0 ${lecture.isPreviewFree ? "opacity-100" : "opacity-30"}`}
                                />
                                <span
                                  className={`text-sm truncate ${isActive ? "text-blue-700 font-medium" : "text-gray-700"}`}
                                >
                                  {lecture.lectureTitle}
                                </span>

                                {/* Preview clickable button */}
                                {lecture.isPreviewFree && (
                                  <button
                                    onClick={() =>
                                      isActive
                                        ? closePreview()
                                        : handlePreview(lecture)
                                    }
                                    className={`shrink-0 text-[11px] font-semibold border rounded px-2 py-0.5 whitespace-nowrap transition-colors
                                      ${
                                        isActive
                                          ? "bg-blue-600 text-white border-blue-600"
                                          : "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                                      }`}
                                  >
                                    {isActive ? "▶ Playing" : "Preview"}
                                  </button>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                {fmtDuration(lecture.lectureDuration)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Course Description
              </h2>
              <div
                className="text-gray-600 text-sm leading-relaxed
                  [&_h2]:text-gray-800 [&_h2]:font-bold [&_h2]:text-base [&_h2]:mb-2 [&_h2]:mt-4
                  [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              />
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Sticky card ═══════════════════════════ */}
          <div
            id="course-card"
            className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-6"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.10)] bg-white">
              {/* ── VIDEO PLAYER (shown when preview is active) ──────── */}
              {activePreview ? (
                <div className="relative">
                  {/* YouTube embed */}
                  <div
                    className="relative w-full"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      key={activePreview.youtubeId}
                      src={`https://www.youtube.com/embed/${activePreview.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={activePreview.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* Preview label + close */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-blue-400 text-xs font-bold shrink-0">
                        ▶ PREVIEW
                      </span>
                      <span className="text-xs text-gray-300 truncate">
                        {activePreview.title}
                      </span>
                    </div>
                    <button
                      onClick={closePreview}
                      className="text-gray-400 hover:text-white text-lg leading-none shrink-0 ml-2 transition-colors"
                      title="Close preview"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                /* ── THUMBNAIL (default) ─────────────────────────── */
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    // clicking thumbnail opens the first free preview lecture
                    const firstFree = courseData.courseContent
                      ?.flatMap((ch) => ch.chapterContent)
                      .find((l) => l.isPreviewFree);
                    if (firstFree) handlePreview(firstFree);
                  }}
                >
                  <img
                    src={courseData.courseThumbnail}
                    alt={courseData.courseTitle}
                    className="w-full h-[195px] object-cover transition-opacity group-hover:opacity-80"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/640x360/dbeafe/1d4ed8?text=Course";
                    }}
                  />
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[18px] border-transparent border-l-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    Click to preview
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Countdown */}
                <div className="flex items-center gap-2 text-red-500 font-semibold text-[13px] mb-3">
                  <img
                    src={assets.time_left_clock_icon}
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>5 days left at this price!</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[28px] font-extrabold text-gray-900">
                    {currency}
                    {discountedPrice}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {currency}
                    {courseData.coursePrice?.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {courseData.discount}% off
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">{renderStars(rating)}</div>
                    <span className="font-semibold text-gray-700 ml-1 text-[13px]">
                      {rating > 0 ? rating.toFixed(1) : "New"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={assets.time_clock_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span className="text-[13px]">{totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src={assets.lesson_icon} alt="" className="w-4 h-4" />
                    <span className="text-[13px]">{totalLectures} lessons</span>
                  </div>
                </div>

                {/* Enroll button */}
                <button
                  onClick={() => setIsEnrolled(true)}
                  className={`w-full py-3 rounded-lg font-bold text-white text-[15px] transition-all duration-150 active:scale-[0.98] mb-5
                    ${isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isEnrolled ? "✓ Enrolled — Go to Course →" : "Enroll Now"}
                </button>

                {/* What's in the course */}
                <p className="font-bold text-gray-800 text-sm mb-3">
                  What's in the course?
                </p>
                <ul className="space-y-2">
                  {[
                    "Lifetime access with free updates.",
                    "Step-by-step, hands-on project guidance.",
                    "Downloadable resources and source code.",
                    "Quizzes to test your knowledge.",
                    "Certificate of completion.",
                    "Quizzes to test your knowledge.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-gray-600"
                    >
                      <span className="text-blue-500 font-black mt-0.5 leading-none shrink-0">
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Coursedetail;
