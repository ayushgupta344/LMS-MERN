import React, { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

// ── Fallback icons (replace with your assets if available) ────────────
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// ── Toolbar config ────────────────────────────────────────────────────
const TOOLBAR = [
  { cmd: "bold",                label: "B",      style: "font-bold" },
  { cmd: "italic",              label: "I",      style: "italic" },
  { cmd: "underline",           label: "U",      style: "underline" },
  { cmd: "insertUnorderedList", label: "• List", style: "" },
  { cmd: "insertOrderedList",   label: "1. List",style: "" },
  { cmd: "justifyLeft",         label: "⬅",     style: "" },
  { cmd: "justifyCenter",       label: "⬛",     style: "" },
  { cmd: "justifyRight",        label: "➡",     style: "" },
];

const Addcourse = () => {
  const [form, setForm] = useState({ title: "", heading: "", price: "", discount: 0 });
  const [thumbnail, setThumbnail]   = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [chapters, setChapters]     = useState([]);
  const [adding, setAdding]         = useState(false);
  const [newChapter, setNewChapter] = useState({ title: "", lectures: [] });
  const [newLec, setNewLec]         = useState({ title: "", duration: "", url: "", free: false });
  const [isEmpty, setIsEmpty]       = useState(true); // for placeholder

  const descRef   = useRef(null);
  const savedSel  = useRef(null); // save selection before toolbar click

  // ── Save selection so toolbar clicks don't lose caret ────────────────
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSel.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // ── Restore selection into the contentEditable ───────────────────────
  const restoreSelection = () => {
    const el = descRef.current;
    if (!el) return;
    el.focus();
    if (savedSel.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSel.current);
    }
  };

  // ── Execute rich-text command ─────────────────────────────────────────
  const execCmd = useCallback((cmd) => {
    restoreSelection();
    document.execCommand(cmd, false, null);
    descRef.current?.focus();
    savedSel.current = null;
  }, []);

  // ── Track empty state for placeholder ───────────────────────────────
  const handleInput = () => {
    const text = descRef.current?.innerText?.trim();
    setIsEmpty(!text);
  };

  // ── Thumbnail ─────────────────────────────────────────────────────────
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  // ── Lecture helpers ───────────────────────────────────────────────────
  const addLecture = () => {
    if (!newLec.title.trim())    return toast.error("Lecture title required");
    if (!newLec.duration)        return toast.error("Lecture duration required");
    setNewChapter((p) => ({
      ...p,
      lectures: [...p.lectures, { ...newLec, id: Date.now() }],
    }));
    setNewLec({ title: "", duration: "", url: "", free: false });
  };

  const removeLecture = (id) =>
    setNewChapter((p) => ({ ...p, lectures: p.lectures.filter((l) => l.id !== id) }));

  // ── Chapter helpers ───────────────────────────────────────────────────
  const saveChapter = () => {
    if (!newChapter.title.trim())    return toast.error("Chapter title required");
    if (!newChapter.lectures.length) return toast.error("Add at least one lecture");
    setChapters((p) => [...p, { ...newChapter, id: Date.now() }]);
    setNewChapter({ title: "", lectures: [] });
    setAdding(false);
  };

  const cancelChapter = () => {
    setAdding(false);
    setNewChapter({ title: "", lectures: [] });
    setNewLec({ title: "", duration: "", url: "", free: false });
  };

  const removeChapter = (id) => setChapters((p) => p.filter((c) => c.id !== id));

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const description = descRef.current?.innerHTML?.trim();

    if (!form.title.trim())   return toast.error("Course title required");
    if (!form.price)          return toast.error("Course price required");
    if (!description || descRef.current?.innerText?.trim() === "")
                              return toast.error("Course description required");
    if (!thumbnail)           return toast.error("Please upload a thumbnail");
    if (!chapters.length)     return toast.error("Add at least one chapter");

    const courseData = { ...form, description, thumbnail, chapters };
    console.log("✅ Course Data:", courseData);
    toast.success("Course added successfully!");

    // Reset
    setForm({ title: "", heading: "", price: "", discount: 0 });
    setThumbnail(null);
    setThumbPreview(null);
    setChapters([]);
    setIsEmpty(true);
    if (descRef.current) descRef.current.innerHTML = "";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Add New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Course Heading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Course Heading
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={form.heading}
            onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* ── Rich-text Description ─────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Course Description <span className="text-red-500">*</span>
          </label>

          {/* Toolbar */}
          <div className="flex gap-1 flex-wrap border border-gray-300 rounded-t-lg px-2 py-1.5 bg-gray-50">
            {TOOLBAR.map(({ cmd, label, style }) => (
              <button
                key={cmd}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur on editor
                  saveSelection();
                  execCmd(cmd);
                }}
                className={`px-2.5 py-1 text-xs rounded hover:bg-blue-100 hover:text-blue-700
                  text-gray-700 transition font-medium select-none ${style}`}
                title={cmd}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="relative">
            <div
              ref={descRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onBlur={saveSelection}
              className="w-full min-h-[140px] border border-gray-300 border-t-0 rounded-b-lg
                px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:border-transparent transition
                [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5
                [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic
                [&_u]:underline"
            />
            {/* Placeholder */}
            {isEmpty && (
              <span className="absolute top-3 left-4 text-sm text-gray-400 pointer-events-none select-none">
                Write your course description here…
              </span>
            )}
          </div>
        </div>

        {/* Price + Thumbnail row */}
        <div className="flex flex-wrap gap-8 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Course Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-36 border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                text-gray-800 placeholder-gray-400 focus:outline-none
                focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Course Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
                <div className={`w-12 h-12 rounded-lg border-2 border-dashed flex items-center
                  justify-center transition
                  ${thumbPreview ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}>
                  <UploadIcon />
                </div>
              </label>
              {thumbPreview && (
                <div className="relative">
                  <img
                    src={thumbPreview}
                    alt="thumbnail"
                    className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => { setThumbnail(null); setThumbPreview(null); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white
                      rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Course Content ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Course Content <span className="text-red-500">*</span>
            </label>
            {!adding && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600
                  hover:text-blue-800 border border-blue-200 hover:border-blue-400
                  bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                + Add Chapter
              </button>
            )}
          </div>

          {/* Saved chapters */}
          {chapters.length > 0 && (
            <div className="space-y-3 mb-4">
              {chapters.map((ch, ci) => (
                <div key={ch.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">CH {ci + 1}</span>
                      <span className="text-sm font-semibold text-gray-700">{ch.title}</span>
                      <span className="text-xs text-gray-400">
                        ({ch.lectures.length} lecture{ch.lectures.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChapter(ch.id)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none transition"
                    >
                      ✕
                    </button>
                  </div>
                  {ch.lectures.map((l, li) => (
                    <div
                      key={l.id}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm
                        ${li < ch.lectures.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <PlayIcon />
                      <span className="flex-1 text-gray-700 truncate">{l.title}</span>
                      {l.free && (
                        <span className="text-[10px] bg-green-50 text-green-600 border
                          border-green-100 px-2 py-0.5 rounded font-semibold">
                          Free
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{l.duration} min</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Add chapter form */}
          {adding && (
            <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50/30 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Getting Started"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Lectures list */}
              {newChapter.lectures.length > 0 && (
                <div className="space-y-1.5">
                  {newChapter.lectures.map((l) => (
                    <div key={l.id}
                      className="flex items-center gap-3 bg-white border border-gray-200
                        rounded-lg px-3 py-2">
                      <PlayIcon />
                      <span className="flex-1 text-sm text-gray-700 truncate">{l.title}</span>
                      {l.free && (
                        <span className="text-[10px] bg-green-50 text-green-600 border
                          border-green-100 px-1.5 py-0.5 rounded font-semibold">
                          Free
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{l.duration}m</span>
                      <button
                        type="button"
                        onClick={() => removeLecture(l.id)}
                        className="text-red-400 hover:text-red-600 text-sm leading-none transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add lecture inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr_auto_auto] gap-2 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    placeholder="Lecture name"
                    value={newLec.title}
                    onChange={(e) => setNewLec((p) => ({ ...p, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mins</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={newLec.duration}
                    onChange={(e) => setNewLec((p) => ({ ...p, duration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtu.be/..."
                    value={newLec.url}
                    onChange={(e) => setNewLec((p) => ({ ...p, url: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-5">
                  <input
                    id="free-lec"
                    type="checkbox"
                    checked={newLec.free}
                    onChange={(e) => setNewLec((p) => ({ ...p, free: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="free-lec" className="text-xs font-semibold text-gray-600 cursor-pointer">
                    Free
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addLecture}
                  className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                    text-xs font-bold rounded-lg transition"
                >
                  + Add
                </button>
              </div>

              {/* Chapter actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={saveChapter}
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white
                    text-sm font-semibold rounded-lg transition"
                >
                  Save Chapter
                </button>
                <button
                  type="button"
                  onClick={cancelChapter}
                  className="px-5 py-2 border border-gray-300 hover:bg-gray-100
                    text-gray-600 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={form.discount || ""}
            onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
            className="w-36 border border-gray-300 rounded-lg px-4 py-2.5 text-sm
              text-gray-800 placeholder-gray-400 focus:outline-none
              focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-10 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold
            rounded-lg transition active:scale-95 text-sm tracking-wide"
        >
          ADD COURSE
        </button>
      </form>
    </div>
  );
};

export default Addcourse;
