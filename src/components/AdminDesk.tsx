import { useState, FormEvent } from 'react';
import { usePortalStore } from '../store';
import { 
  Shield, 
  Plus, 
  Users, 
  Volume2, 
  Clock, 
  Award, 
  BookOpen, 
  UserCheck, 
  Loader2,
  BellRing
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDesk() {
  const { courses, user, addNotification, currentView } = usePortalStore();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'announcement' | 'alert'>('announcement');

  if (!user || user.role !== 'admin') return null;

  // Mock student roster for admin monitoring
  const mockStudents = [
    { name: 'Edward Adams', email: 'edward.adams@university.edu', gpa: 3.84, progress: '82%', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Clara Oswald', email: 'clara@university.edu', gpa: 4.00, progress: '96%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'John Watson', email: 'watson@university.edu', gpa: 3.42, progress: '58%', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleBroadcast = (e: FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      addNotification({
        title: ` Dean: ${broadcastTitle}`,
        message: broadcastMessage,
        type: broadcastType,
      });

      setBroadcastTitle('');
      setBroadcastMessage('');
      setIsBroadcasting(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Admin Broadcast Notice and Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3: Broadcast Control Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-poppins">
                Institutional Alert Broadcasting
              </h3>
              <p className="text-xs text-slate-400">Push instant warnings or announcements to student feeds</p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Alert Title Header</label>
              <input
                id="broad-title"
                type="text"
                required
                placeholder="e.g., Campus Maintenance Schedules..."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Dispatch Message</label>
              <textarea
                id="broad-message"
                required
                rows={3}
                placeholder="Write specific notification instructions or academic reminders..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="notifType"
                    checked={broadcastType === 'announcement'}
                    onChange={() => setBroadcastType('announcement')}
                    className="accent-indigo-600"
                  />
                  Announcement Notice
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="notifType"
                    checked={broadcastType === 'alert'}
                    onChange={() => setBroadcastType('alert')}
                    className="accent-indigo-600"
                  />
                  Warning Alert
                </label>
              </div>

              <button
                id="broadcast-submit-btn"
                type="submit"
                disabled={isBroadcasting}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 shadow-md shadow-indigo-500/10 cursor-pointer pointer-events-auto"
              >
                {isBroadcasting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    Broadcasting...
                  </>
                ) : (
                  'Push Broadcast Feed'
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right 2: Enrolled Students roster */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 pointer-events-auto flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-500 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-poppins">
                  Enrolled Candidates
                </h3>
                <p className="text-xs text-slate-400">Academic quality cohort rosters</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {mockStudents.map((stu) => (
                <div key={stu.email} className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/20 dark:border-slate-850/20">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={stu.avatar} alt={stu.name} className="h-9 w-9 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{stu.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono truncate">{stu.email}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block font-mono">GPA {stu.gpa}</span>
                    <span className="text-[9px] text-indigo-500 dark:text-indigo-400 block font-mono">Prog: {stu.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 mt-4 text-center">
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Secured Administration Desk Terminal</span>
          </div>
        </motion.div>

      </div>

      {/* Course management and statistics overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 pointer-events-auto text-left"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-poppins">
              Syllabus Tracking & Performance Logs
            </h3>
            <p className="text-xs text-slate-400">Review status and performance averages across logged module structures</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/20 dark:border-slate-850/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 py-0.5 px-2 rounded">
                  {course.code}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {course.credits} Credits Weight
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mb-1">
                {course.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Lecturer: {course.lecturer}
              </p>
              
              <div className="mt-3.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                  <span>Class Syllabus coverage</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-850 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
