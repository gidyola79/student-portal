import { useState, FormEvent } from 'react';
import { usePortalStore } from '../store';
import { 
  SquarePlay, 
  TableProperties, 
  Trash2, 
  Plus, 
  FileText, 
  BadgeCheck, 
  X, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Filter,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment } from '../types';

export default function AssignmentTracker() {
  const { assignments, courses, addAssignment, toggleAssignmentStatus, deleteAssignment } = usePortalStore();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'late'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-05-25');
  const [description, setDescription] = useState('');

  // Filtering assignments
  const filteredAssignments = assignments.filter((asg) => {
    if (statusFilter === 'all') return true;
    return asg.status === statusFilter;
  });

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 inline-flex items-center gap-1 uppercase">
            <CheckCircle className="h-3 w-3" /> Submitted
          </span>
        );
      case 'late':
        return (
          <span className="py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/10 inline-flex items-center gap-1 uppercase animate-pulse">
            Excess Time
          </span>
        );
      default:
        return (
          <span className="py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/10 inline-flex items-center gap-1 uppercase">
            Outstanding
          </span>
        );
    }
  };

  const handleCreateAssignment = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    setIsSubmitting(true);
    const selectedCourseName = courses.find((c) => c.id === courseId)?.title || 'General Module';

    try {
      await addAssignment({
        title,
        courseId,
        courseName: selectedCourseName,
        dueDate,
        status: 'pending',
        totalPoints: 100,
        description,
      });
      
      // Reset State
      setTitle('');
      setDescription('');
      setIsAddOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Hub */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs pointer-events-auto">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pointer-events-none">
            <Filter className="h-3 w-3" /> Filters:
          </span>
          <button
            id="filter-all-btn"
            onClick={() => setStatusFilter('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold cursor-pointer pointer-events-auto select-none ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            All Tracks
          </button>
          <button
            id="filter-pending-btn"
            onClick={() => setStatusFilter('pending')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold cursor-pointer pointer-events-auto select-none ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            Outstanding
          </button>
          <button
            id="filter-submitted-btn"
            onClick={() => setStatusFilter('submitted')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold cursor-pointer pointer-events-auto select-none ${
              statusFilter === 'submitted'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            Submitted
          </button>
          <button
            id="filter-late-btn"
            onClick={() => setStatusFilter('late')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold cursor-pointer pointer-events-auto select-none ${
              statusFilter === 'late'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            Late
          </button>
        </div>

        {/* Right Toggle and Add Action Panel */}
        <div className="flex items-center justify-between md:justify-end gap-3 pointer-events-auto">
          {/* Layout Toggle Card/Table */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
            <button
              id="view-grid-mode-btn"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-50 cursor-pointer ${
                viewMode === 'card' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              <SquarePlay className="h-4 w-4" />
            </button>
            <button
              id="view-table-mode-btn"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-50 cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              <TableProperties className="h-4 w-4" />
            </button>
          </div>

          <button
            id="add-asg-modal-trigger"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 shadow-md shadow-indigo-500/10 cursor-pointer pointer-events-auto"
          >
            <Plus className="h-4 w-4" />
            Log Assignment
          </button>
        </div>
      </div>

      {/* Main Visual Panels Content */}
      <AnimatePresence mode="wait">
        {filteredAssignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-16 text-center bg-white/30 dark:bg-slate-900/10 border border-dashed border-slate-200/50 dark:border-slate-800 rounded-3xl text-slate-400 text-sm"
          >
            📁 Zero track assignments located under selected filters.
          </motion.div>
        ) : viewMode === 'card' ? (
          /* CARD LAYOUT GRID */
          <motion.div
            id="assignment-grid-layout"
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredAssignments.map((asg) => (
              <div
                id={`asg-card-${asg.id}`}
                key={asg.id}
                className="glass-panel rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all text-left relative pointer-events-auto"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="py-0.5 px-2 bg-indigo-50 dark:bg-indigo-950/45 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 rounded-lg uppercase">
                      {asg.courseName}
                    </span>
                    {getStatusBadge(asg.status)}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-poppins mb-2 leading-tight">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {asg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>DUE: {asg.dueDate}</span>
                  </div>

                  {/* Submission and Garbage Action Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`toggle-asg-status-btn-${asg.id}`}
                      onClick={() => toggleAssignmentStatus(asg.id)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer pointer-events-auto transition-colors ${
                        asg.status === 'submitted'
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 hover:text-slate-700'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                      }`}
                    >
                      {asg.status === 'submitted' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    <button
                      id={`delete-asg-btn-${asg.id}`}
                      onClick={() => deleteAssignment(asg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* TABLE LAYOUT MODE */
          <motion.div
            id="assignment-table-layout"
            key="table"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-sm pointer-events-auto"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <th className="p-4">Assignment Topic</th>
                    <th className="p-4">Module Code</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Metric Status</th>
                    <th className="p-4 text-right">Actions Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredAssignments.map((asg) => (
                    <tr
                      id={`asg-row-${asg.id}`}
                      key={asg.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-850 dark:text-slate-200 max-w-xs truncate">
                        {asg.title}
                      </td>
                      <td className="p-4">
                        <span className="py-0.5 px-2 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400 rounded-md">
                          {asg.courseName}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">{asg.dueDate}</td>
                      <td className="p-4">{getStatusBadge(asg.status)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`status-toggle-tab-${asg.id}`}
                            onClick={() => toggleAssignmentStatus(asg.id)}
                            className={`py-1 px-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer ${
                              asg.status === 'submitted'
                                ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                            }`}
                          >
                            Toggle Status
                          </button>
                          <button
                            id={`delete-asg-tab-${asg.id}`}
                            onClick={() => deleteAssignment(asg.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Up Framer-Motion Animated Modal (Add deliverable) */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div
              id="add-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-slate-950 backdrop-blur-xs z-50 pointer-events-auto cursor-pointer"
            />

            <motion.div
              id="add-modal-box"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:right-6 sm:bottom-6 sm:top-24 w-auto sm:w-[440px] bg-white dark:bg-slate-900 rounded-3xl z-50 overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col p-6 pointer-events-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800 mb-5">
                <h3 className="text-lg font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-indigo-600" /> Log Module Assignment
                </h3>
                <button
                  id="close-add-modal-btn"
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                {/* Topic field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Assignment Title/Topic</label>
                  <input
                    id="new-asg-title"
                    type="text"
                    required
                    placeholder="e.g., Fourier Synthesis algorithms..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Course selection dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Target Academic Module</label>
                  <select
                    id="new-asg-course"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Target Due Date</label>
                  <input
                    id="new-asg-date"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Description textbox */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Syllabus Requirements</label>
                  <textarea
                    id="new-asg-desc"
                    rows={3}
                    placeholder="Draft primary goals, resources needed, or deliverables index..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    id="cancel-add-modal-btn"
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-gray-300 cursor-pointer pointer-events-auto"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-add-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 shadow-md shadow-indigo-500/10 cursor-pointer pointer-events-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                        Saving to Ledger...
                      </>
                    ) : (
                      'Save to Log'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
