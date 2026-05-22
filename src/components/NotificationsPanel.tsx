import { usePortalStore } from '../store';
import { X, Award, AlertTriangle, BookOpen, Volume2, CheckCheck, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotifIcon = (type: string) => {
  switch (type) {
    case 'assignment':
      return <BookOpen className="h-4 w-4 text-indigo-500" />;
    case 'grade':
      return <Award className="h-4 w-4 text-emerald-500" />;
    case 'announcement':
      return <Volume2 className="h-4 w-4 text-purple-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
};

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePortalStore();

  const playNotifSound = () => {
    try {
      // Gentle notification sound using web audio API to avoid missing file dependencies
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.31);
    } catch (e) {
      console.log('Audio Context muted or blocked by permissions');
    }
  };

  const handleClearAll = () => {
    playNotifSound();
    markAllNotificationsRead();
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            id="notif-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-940 backdrop-blur-sm z-50 pointer-events-auto cursor-pointer"
          />

          {/* Slide-out Drawer */}
          <motion.div
            id="notif-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/80 shadow-2xl z-50 flex flex-col pointer-events-auto"
          >
            {/* Header section */}
            <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-poppins">
                  System Alerts
                  {hasUnread && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">University alert dispatcher</p>
              </div>
              
              <div className="flex items-center gap-2">
                {hasUnread && (
                  <button
                    id="mark-all-read-btn"
                    onClick={handleClearAll}
                    className="flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors pointer-events-auto cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Read All
                  </button>
                )}
                
                <button
                  id="close-notif-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 pointer-events-auto cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
                  <p className="text-sm">No notifications available</p>
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <motion.div
                    id={`notif-card-${notif.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 rounded-2xl flex gap-3 cursor-pointer transition-all duration-200 ${
                      notif.isRead
                        ? 'bg-slate-50/65 dark:bg-slate-800/40 opacity-75 hover:opacity-100 border border-transparent'
                        : 'bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-100/45 dark:border-indigo-500/10 shadow-[0_2px_12px_rgba(99,102,241,0.03)]'
                    }`}
                  >
                    <div className={`p-2 h-fit rounded-xl ${
                      notif.isRead
                        ? 'bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-indigo-100 dark:bg-indigo-950/60 ring-4 ring-indigo-50 dark:ring-indigo-950/30'
                    }`}>
                      {getNotifIcon(notif.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-sm font-semibold pointer-events-none ${
                          notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pointer-events-none">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block pointer-events-none">
                        {notif.time}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-200/50 dark:border-slate-800/80 text-center">
              <span className="text-xs font-mono text-slate-400">Secured University Telemetry Node</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
