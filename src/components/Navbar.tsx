import { useState } from 'react';
import { usePortalStore } from '../store';
import { Bell, Sparkles, LogOut, User, UserCheck, Shield, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationsPanel from './NotificationsPanel';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { currentView, user, logout, switchRole, notifications, isMobileSidebarOpen, setMobileSidebarOpen } = usePortalStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  if (!user) return null;

  // Compute unread alert count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return { main: 'Academic Campus', subtitle: 'Dynamic central monitoring' };
      case 'courses':
        return { main: 'Module Registry', subtitle: 'Active modules and tracking logs' };
      case 'assignments':
        return { main: 'Assignment Hub', subtitle: 'Deadlines and state validation' };
      case 'grades':
        return { main: 'GPA Ledger', subtitle: 'Academic quality transcripts' };
      case 'admin':
        return { main: 'Administrative Desk', subtitle: 'Global academic oversight controls' };
      case 'settings':
        return { main: 'Client Configuration', subtitle: 'System preferences' };
      default:
        return { main: 'Portal Home', subtitle: 'Apex Academy Online' };
    }
  };

  const titleMeta = getViewTitle();

  return (
    <>
      <header className="sticky top-0 w-full glass-navbar z-20 px-4 md:px-8 py-3.5 flex items-center justify-between pointer-events-auto shadow-sm">
        {/* View Heading Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer Toggle Button */}
          <button
            id="mobile-sidebar-hamburger"
            type="button"
            onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer pointer-events-auto mr-1 shrink-0 flex items-center justify-center border border-slate-200/40 dark:border-slate-800/80"
            aria-label="Toggle Navigation Side Panel"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <motion.h1
              key={currentView}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-black font-poppins bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-800 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight leading-none"
            >
              {titleMeta.main}
            </motion.h1>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium font-sans mt-1">
              {titleMeta.subtitle}
            </span>
          </div>
        </div>

        {/* Action Controls Rail */}
        <div className="flex items-center gap-2 relative">
          
          {/* BONUS ROLE SWITCHER (Student <-> Admin Toggle Dropdown) */}
          <div className="relative">
            <button
              id="role-switch-trigger"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-3 py-1.5 md:py-2 rounded-xl text-xs font-semibold bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200/50 dark:border-indigo-500/15 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 transition-colors pointer-events-auto cursor-pointer"
            >
              {user.role === 'admin' ? (
                <Shield className="h-3.5 w-3.5 stroke-[2]" />
              ) : (
                <User className="h-3.5 w-3.5 stroke-[2]" />
              )}
              <span className="hidden sm:inline capitalize">{user.role} View</span>
            </button>
            
            <AnimatePresence>
              {showRoleMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xl overflow-hidden z-50 p-1"
                  >
                    <div className="px-3 py-2 border-b border-rose-100/10 text-[10px] font-mono uppercase text-slate-400">
                      Toggle Portal View Role
                    </div>
                    <button
                      id="role-switch-to-student-btn"
                      onClick={() => {
                        switchRole('student');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl text-xs flex items-center gap-2 cursor-pointer pointer-events-auto font-medium ${
                        user.role === 'student' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/25 dark:bg-indigo-950/25' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Student Identity
                    </button>
                    <button
                      id="role-switch-to-admin-btn"
                      onClick={() => {
                        switchRole('admin');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl text-xs flex items-center gap-2 cursor-pointer pointer-events-auto font-medium ${
                        user.role === 'admin' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/25 dark:bg-indigo-950/25' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Administrator Desk
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme custom toggler */}
          <ThemeToggle />

          {/* Bell Notification Alert with Badge indicator */}
          <motion.button
            id="bell-notif-btn"
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsNotifOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors pointer-events-auto relative cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
            aria-label="System Alerts Hub"
          >
            <Bell className="h-[20px] w-[20px]" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white dark:bg-indigo-500 font-mono text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(99,102,241,0.5)] border-2 border-white dark:border-slate-900"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Small Profile Snapshot (hidden on very small cells, supports sign-out) */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200/50 dark:border-slate-800/80">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-500/10 shrink-0"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Slide-over System Notification panel drawer */}
      <NotificationsPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
