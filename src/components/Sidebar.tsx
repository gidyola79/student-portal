import { useState } from 'react';
import { usePortalStore } from '../store';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarRange, 
  GraduationCap, 
  ShieldAlert, 
  Settings, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar() {
  const { currentView, setCurrentView, user, logout, isMobileSidebarOpen, setMobileSidebarOpen } = usePortalStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: CalendarRange },
    { id: 'grades', label: 'Grades & GPA', icon: GraduationCap },
    ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin Desk', icon: ShieldAlert }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <motion.aside
        id="desktop-sidebar"
        animate={{ width: isCollapsed ? 76 : 240 }}
        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
        className="hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-30 overflow-hidden"
      >
        {/* University Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 h-[72px] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.25)] flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-poppins uppercase">
                  Apex Academy
                </span>
                <span className="text-[10px] font-mono text-slate-400">Veritas Virtualis</span>
              </motion.div>
            )}
          </div>
          
          {/* Collapse Trigger Button */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Profiles preview when expanded */}
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 mx-4 my-4 bg-white/60 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/10 rounded-2xl flex items-center gap-3 overflow-hidden shrink-0"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{user.role}</span>
            </div>
          </motion.div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 space-y-1.5 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group pointer-events-auto cursor-pointer relative ${
                  isActive
                    ? 'bg-white text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-500 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    className="truncate font-sans"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs py-1 px-2.5 rounded-lg shadow-lg font-medium transition-transform delay-75 origin-left pointer-events-none z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Log out */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/80 shrink-0">
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className={`w-full flex items-center justify-start gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors pointer-events-auto cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!isCollapsed && <span className="font-semibold">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation (Visible on responsive touch layout) */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 glass-navbar shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-40 border-t border-slate-200/50 dark:border-slate-800/80 px-4 py-1.5 flex justify-around items-center"
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              id={`mobile-nav-item-${item.id}`}
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex flex-col items-center gap-1.5 py-1.5 px-3.5 rounded-xl transition-all cursor-pointer pointer-events-auto min-h-[44px] justify-center ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 scale-105 font-bold font-sans' 
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-wide">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        
        {/* Mobile Settings Button */}
        <button
          id="mobile-settings-btn"
          onClick={() => setCurrentView(user.role === 'admin' ? 'admin' : 'settings')}
          className={`flex flex-col items-center gap-1.5 py-1.5 px-3.5 rounded-xl transition-all cursor-pointer pointer-events-auto min-h-[44px] justify-center ${
            currentView === 'settings' || currentView === 'admin'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-wide">
            {user.role === 'admin' ? 'Admin' : 'Settings'}
          </span>
        </button>
      </nav>

      {/* Mobile Sidebar overlay/drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop shadow overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/15 dark:bg-slate-950/40 backdrop-blur-xs z-50 pointer-events-auto cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white/80 dark:bg-slate-950 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-50 flex flex-col border-r border-slate-200/50 dark:border-slate-800/80 pointer-events-auto"
            >
              {/* Header with Close state */}
              <div className="p-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 h-[72px] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl text-white">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold font-poppins text-slate-800 dark:text-white uppercase tracking-tight">
                      Apex Academy
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Veritas Virtualis</span>
                  </div>
                </div>

                {/* Close Button Trigger */}
                <button
                  id="mobile-sidebar-close-btn"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer pointer-events-auto transition-colors flex items-center justify-center"
                  aria-label="Close Side Deck"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="p-4 mx-4 my-4 bg-white/60 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/10 rounded-2xl flex items-center gap-3 overflow-hidden shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">{user.role}</span>
                </div>
              </div>

              {/* Navigation Items (auto-closes upon navigation!) */}
              <nav className="flex-1 px-4 space-y-1.5 py-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      id={`mobile-drawer-item-${item.id}`}
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as any);
                        setMobileSidebarOpen(false); // Automatically close the sidebar after selection!
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer pointer-events-auto ${
                        isActive
                          ? 'bg-white dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-500 font-bold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] shrink-0 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`} />
                      <span className="font-sans">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer Sign Out */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-900 shrink-0">
                <button
                  id="mobile-drawer-logout-btn"
                  onClick={() => {
                    logout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors pointer-events-auto cursor-pointer border border-rose-200/20"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
