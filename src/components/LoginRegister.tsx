import { useState, FormEvent } from 'react';
import { usePortalStore } from '../store';
import { Mail, Lock, User, Sparkles, School, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginRegister() {
  const { login, registerUser } = usePortalStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Fields state
  const [email, setEmail] = useState('felix.vance@apex.edu');
  const [name, setName] = useState('Felix Vance');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Floating label active tracking
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg(null);
    
    // Simulate real network delay for high production fidelity
    setTimeout(() => {
      try {
        if (!isLoginView) {
          // Store new credentials inside simulated client-state database
          registerUser(email, name, password);
          // Auto log in after creating account successfully
          login(email, name, password);
        } else {
          login(email, '', password);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to authenticate. Access denied.");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleQuickDemo = (role: 'student' | 'admin') => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      try {
        if (role === 'admin') {
          login('admin.clara@apex.edu', 'Dean Clara Oswald', 'adminpassword');
        } else {
          login('felix.vance@apex.edu', 'Felix Vance', 'password123');
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      }
      setIsLoading(false);
    }, 700);
  };

  const toggleView = (view: boolean) => {
    setErrorMsg(null);
    setIsLoginView(view);
    setShowPassword(false);
    if (view) {
      setEmail('felix.vance@apex.edu');
      setName('Felix Vance');
      setPassword('password123');
    } else {
      setEmail('');
      setName('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative colored glow background circles for glassmorphism */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 blur-[90px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-600/10 blur-[100px] -z-10 pointer-events-none" />

      {/* Main Glassmorphic Wrapper Centered on Screen */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-white/40 dark:bg-slate-950/35 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        {/* Brand visual header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.25)] text-white mb-4">
            <School className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white tracking-tight leading-none">
            Apex Student Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Authorized Institution Authentication Portal
          </p>
        </div>

        {/* View Selection Toggle Header */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/60 rounded-2xl mb-6 border border-slate-200/20 dark:border-slate-800/10 shrink-0">
          <button
            id="toggle-login-view"
            type="button"
            onClick={() => toggleView(true)}
            className={`py-2 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer pointer-events-auto ${
              isLoginView
                ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Login Credentials
          </button>
          <button
            id="toggle-register-view"
            type="button"
            onClick={() => toggleView(false)}
            className={`py-2 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer pointer-events-auto ${
              !isLoginView
                ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-left"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {/* NAME FIELD (Only shown in register view) */}
            {!isLoginView && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === 'name' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                }`}>
                  <User className="h-4 w-4" />
                </div>
                {/* Floating label logic */}
                <label
                  className={`absolute left-10 transition-all font-medium pointer-events-none duration-250 ${
                    focusedField === 'name' || name
                      ? 'top-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400'
                      : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
                  }`}
                >
                  Full Student Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required={!isLoginView}
                  className="w-full pl-10 pr-4 pt-6 pb-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL FIELD WITH FLOATING LABELS */}
          <div className="relative">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'email' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
            }`}>
              <Mail className="h-4 w-4" />
            </div>
            <label
              className={`absolute left-10 transition-all font-medium pointer-events-none duration-250 ${
                focusedField === 'email' || email
                  ? 'top-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400'
                  : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
              }`}
            >
              Academic Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full pl-10 pr-4 pt-6 pb-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* PASSWORD FIELD WITH FLOATING LABELS & SHOW TOGGLE */}
          <div className="relative">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'password' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
            }`}>
              <Lock className="h-4 w-4" />
            </div>
            <label
              className={`absolute left-10 transition-all font-medium pointer-events-none duration-250 ${
                focusedField === 'password' || password
                  ? 'top-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400'
                  : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
              }`}
            >
              Secure Passcode
            </label>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full pl-10 pr-12 pt-6 pb-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            />
            <button
              id="password-visibility-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer pointer-events-auto flex items-center justify-center p-1 rounded-lg"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* SUBMIT BUTTON WITH RIPPLE/ANIMATED SPINNER */}
          <motion.button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white rounded-2xl cursor-pointer pointer-events-auto shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 animate-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Validating Transcripts...
              </>
            ) : (
              <>
                {isLoginView ? 'Verify Registration' : 'Register Identity'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* DEMO ACCELERATORS SECTION (Allows clicking directly into mock configurations) */}
        <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/60 text-center">
          <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5">
            Instant Demo Bypass Keys
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="bypass-student-btn"
              onClick={() => handleQuickDemo('student')}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl border border-slate-200/55 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer pointer-events-auto flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
              Student View
            </button>
            <button
              id="bypass-admin-btn"
              onClick={() => handleQuickDemo('admin')}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl border border-slate-200/55 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer pointer-events-auto flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3 w-3 text-purple-500 animate-bounce" />
              Admin View
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
