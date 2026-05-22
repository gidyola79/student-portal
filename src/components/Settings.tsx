import { useState, FormEvent } from 'react';
import { usePortalStore } from '../store';
import { 
  Settings as SettingsIcon, 
  User, 
  BookOpen, 
  ShieldCheck, 
  Volume2, 
  RefreshCw, 
  Clock, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const { user, updateUser, theme, toggleTheme, addNotification } = usePortalStore();
  const [name, setName] = useState(user?.name || '');
  const [major, setMajor] = useState(user?.major || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [targetGpa, setTargetGpa] = useState(String(user?.targetGpa || 4.0));
  
  const [isSaved, setIsSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!user) return null;

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    
    // Update local store profile properties
    updateUser({
      name,
      major,
      studentId,
      targetGpa: Number(targetGpa) || 4.0,
    });

    // Fire notification alert
    addNotification({
      title: 'Preferences Synchronized',
      type: 'announcement',
      message: 'Your portal configuration preferences and target GPA bounds are updated.',
    });

    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleResetToDefaults = () => {
    setIsResetting(true);
    setTimeout(() => {
      localStorage.removeItem('student_portal_theme');
      setIsResetting(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Navigation Summary & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-505/20 text-indigo-500 rounded-xl shrink-0">
                <SettingsIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-poppins">System Control</h3>
                <p className="text-xs text-slate-400">Portal preferences & meta configurations</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">{user.email}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/25 rounded-2xl border border-slate-200/20 dark:border-slate-800/10 text-xs text-slate-500 space-y-1 font-sans">
                <div className="flex justify-between">
                  <span>Student ID:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{user.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role Access:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>GPA Index:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{user.gpa} / 4.00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reset System Database */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-red-200/20 dark:border-red-500/10 pointer-events-auto text-left space-y-4"
          >
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Maintenance Mode</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Tearing down active state structures resets student schedules, task outcomes, and GPA telemetry to institutional default standards.
            </p>

            <button
              id="reset-state-btn"
              onClick={handleResetToDefaults}
              disabled={isResetting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-505 hover:shadow-lg hover:shadow-rose-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              {isResetting ? 'Reconstituting Telemetry...' : 'Reset Portal Instance'}
            </button>
          </motion.div>
        </div>

        {/* Right Col: Complex Profile Setting Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 text-left pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-poppins">Identity & Scholar Profiles</h3>
              <p className="text-xs text-slate-400">Personalize user attributes reflected inside student cards</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Scholar Full Name</label>
                <input
                  id="settings-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Enrollment Registration ID</label>
                <input
                  id="settings-id-input"
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Major Field of Study</label>
                <input
                  id="settings-major-input"
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Graduation Target GPA Scale</label>
                <input
                  id="settings-gpa-input"
                  type="number"
                  step="0.01"
                  min="2.0"
                  max="4.0"
                  required
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Quick Toggle Controls Grid inside Settings Tab */}
            <div className="pt-6 border-t border-slate-200/40 dark:border-slate-800 mt-4 space-y-4">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Portal Display Preferences</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme mode preference selector key */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/25 border border-slate-200/10 flex items-center justify-between font-sans">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Dark System Appearance</span>
                    <span className="text-[10px] text-slate-400 block dark:text-slate-500">Enable deep dark visual canvas</span>
                  </div>
                  <button
                    id="sett-theme-toggle-btn"
                    type="button"
                    onClick={toggleTheme}
                    className="p-1 px-3 rounded-xl border border-slate-250 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {theme === 'dark' ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Simulated notifications sound toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/25 border border-slate-200/10 flex items-center justify-between font-sans">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Audio Dispatch Synclines</span>
                    <span className="text-[10px] text-slate-400 block dark:text-slate-500">Play audio signals on notifications</span>
                  </div>
                  <div className="p-1 px-3.5 rounded-xl border border-emerald-300/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase leading-none">
                    ONLINE
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800 mt-6 flex justify-end">
              <button
                id="save-preferences-btn"
                type="submit"
                disabled={isSaved}
                className="py-2.5 px-5 rounded-xl text-xs font-extrabold uppercase bg-indigo-600 hover:bg-indigo-505 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer pointer-events-auto"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 text-white font-black" />
                    Synchronized!
                  </>
                ) : (
                  'Synchronize Changes'
                )}
              </button>
            </div>

          </form>
        </motion.div>

      </div>

    </div>
  );
}
