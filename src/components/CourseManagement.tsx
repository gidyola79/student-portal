import { useState } from 'react';
import { usePortalStore } from '../store';
import { Search, MapPin, Calendar, User, BookOpen, Clock, Tag, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course } from '../types';

export default function CourseManagement() {
  const { courses, selectedCourseId, setSelectedCourseId } = usePortalStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Course filter logic
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs pointer-events-auto">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="search-modules-input"
            type="text"
            placeholder="Search course title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100/50 focus:bg-white dark:bg-slate-800/50 focus:dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200/50 dark:border-slate-700/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 font-medium">
          <span>Active Registry Period: Spring 2026</span>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white/30 dark:bg-slate-900/10 rounded-2xl text-slate-400 text-sm">
          No courses matching "{searchQuery}" could be located inside student ledger.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              id={`course-card-${course.id}`}
              onClick={() => setSelectedCourseId(course.id)}
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel glass-panel-card rounded-2xl overflow-hidden border border-slate-200/55 dark:border-slate-800/60 flex flex-col justify-between cursor-pointer shadow-sm relative pointer-events-auto group"
            >
              <div>
                {/* Module Cover Photo */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent pointer-events-none" />
                  
                  {/* Absolute Badge elements */}
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white dark:bg-indigo-505 font-mono text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-sm uppercase">
                    {course.code}
                  </span>
                  
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] font-mono text-indigo-300 font-bold block leading-none mb-1">LECTURER</span>
                    <span className="text-xs font-semibold text-white block leading-none">{course.lecturer}</span>
                  </div>
                </div>

                {/* Module descriptions */}
                <div className="p-5 text-left space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-poppins leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Progress and bottom footer */}
              <div className="px-5 pb-5 pt-2 text-left space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Syllabus Progress</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>{course.credits} ACADEMIC CREDITS</span>
                  <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    DETAILS →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Detail slide-up modal Backdrop */}
      <AnimatePresence>
        {selectedCourse && (
          <>
            <motion.div
              id="course-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourseId(null)}
              className="fixed inset-0 bg-slate-950 backdrop-blur-xs z-50 pointer-events-auto cursor-pointer"
            />

            <motion.div
              id="course-modal-drawer"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:right-6 sm:bottom-6 sm:top-24 w-auto sm:w-[460px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl z-50 overflow-y-auto shadow-2xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col pointer-events-auto"
            >
              {/* Cover Photo */}
              <div className="h-44 w-full relative shrink-0 bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent pointer-events-none" />
                
                <button
                  id="close-course-modal-btn"
                  onClick={() => setSelectedCourseId(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/40 text-white/80 hover:text-white backdrop-blur-md cursor-pointer pointer-events-auto"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-5 text-left">
                  <span className="py-0.5 px-2 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-md block w-fit mb-1.5 shadow-sm uppercase">
                    {selectedCourse.code}
                  </span>
                  <h3 className="text-md sm:text-lg font-extrabold text-white font-poppins leading-tight">
                    {selectedCourse.title}
                  </h3>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 flex-1 text-left space-y-5">
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Course Syllabus Log
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Metadata items */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
                    <User className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-none">PROFESSOR</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{selectedCourse.lecturer}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-none">LOCATION</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{selectedCourse.location.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-none">SCHEDULE</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{selectedCourse.schedule.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-purple-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-none">TIME</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                        {selectedCourse.schedule.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Detail */}
                <div className="bg-slate-50 dark:bg-slate-800/20 p-4 border border-slate-200/20 dark:border-slate-800/50 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-indigo-500" /> Current Achievement Index
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{selectedCourse.progress}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/40 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{selectedCourse.credits} ACADEMIC CREDITS VALUE</span>
                <button
                  id="modal-close-foot-btn"
                  onClick={() => setSelectedCourseId(null)}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-505 shadow-sm transition-colors cursor-pointer pointer-events-auto"
                >
                  Close Ledger
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
