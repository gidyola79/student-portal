import { Sun, Moon } from 'lucide-react';
import { usePortalStore } from '../store';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = usePortalStore();

  return (
    <motion.button
      id="theme-toggler-btn"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className="p-2 ml-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors pointer-events-auto flex items-center justify-center cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      aria-label="Toggle Theme Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theme === 'dark' ? (
          <Sun className="h-[20px] w-[20px] text-amber-400" />
        ) : (
          <Moon className="h-[20px] w-[20px] text-indigo-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
