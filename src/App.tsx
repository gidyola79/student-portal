import { useEffect } from 'react';
import { usePortalStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import DashboardOverview from './components/DashboardOverview';
import CourseManagement from './components/CourseManagement';
import AssignmentTracker from './components/AssignmentTracker';
import GradesSection from './components/GradesSection';
import AdminDesk from './components/AdminDesk';
import Settings from './components/Settings';

export default function App() {
  const { user, currentView, theme } = usePortalStore();

  // Dynamically sync theme selectors to document.documentElement for Tailwind v4 structure
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // If user is not authorized, render high fidelity glassmorphic login sequence
  if (!user) {
    return (
      <main className="min-h-screen w-full relative flex items-center justify-center">
        <div className="portal-bg-mesh" />
        <LoginRegister />
      </main>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'courses':
        return <CourseManagement />;
      case 'assignments':
        return <AssignmentTracker />;
      case 'grades':
        return <GradesSection />;
      case 'admin':
        return <AdminDesk />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen w-full flex text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Decorative colored grid/glow background meshes */}
      <div className="portal-bg-mesh" />
      
      {/* Sidebar navigation controls for Desktop; mobile bottom navigation tabs */}
      <Sidebar />

      {/* Primary viewport wrapper. Dynamically spacing for floating custom sidebars */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px] bg-white dark:bg-transparent backdrop-blur-md transition-[padding,background-color] duration-300">
        
        {/* Navigation Action header panel */}
        <Navbar />

        {/* View content container pane */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto relative z-10 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
