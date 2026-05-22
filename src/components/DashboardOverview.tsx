import { usePortalStore } from '../store';
import { 
  Award, 
  BookOpen, 
  CalendarClock, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

export default function DashboardOverview() {
  const { user, courses, assignments, grades, setCurrentView, toggleAssignmentStatus } = usePortalStore();

  if (!user) return null;

  // Calculators
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const finishedAssignmentsCount = assignments.filter((a) => a.status === 'submitted').length;
  const lateAssignments = assignments.filter((a) => a.status === 'late');

  // Greeting based on real time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Recharts high quality chart data (GPA history timeline)
  const gpaTimelineData = [
    { semester: 'Spring 25', gpa: 3.65, classAverage: 3.42 },
    { semester: 'Summer 25', gpa: 3.72, classAverage: 3.45 },
    { semester: 'Fall 25', gpa: 3.78, classAverage: 3.48 },
    { semester: 'Spring 26', gpa: user.gpa, classAverage: 3.52 },
  ];

  // Course progress distribution chart data
  const courseChartData = courses.map(course => ({
    name: course.code,
    title: course.title,
    progress: course.progress,
    credits: course.credits,
  }));

  // Style colors for chart bars
  const chartColors = ['#6366f1', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Dynamic Welcome Heading and Quick Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/10 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-indigo-400 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 pointer-events-none">
              <Activity className="h-3 w-3 animate-pulse" />
              Veritas Sync Online
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold text-white font-poppins tracking-tight pointer-events-none">
              {getGreeting()}, {user.name}!
            </h2>
            <p className="text-sm text-slate-300 pointer-events-none max-w-xl">
              Glad to see you back. Your GPA is steady at <strong className="text-indigo-300 font-semibold">{user.gpa}</strong>. You have <strong className="text-purple-300 font-semibold">{pendingAssignments.length} assignments</strong> pending this week. 
            </p>
          </div>
          
          {/* Quick Date Snapshot Badge Dashboard */}
          <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 dark:border-slate-800 p-3 flex items-center gap-3 self-start md:self-auto">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase">Academic Term</span>
              <span className="text-xs font-semibold text-white leading-none">Spring Session 2026</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Cards - Row of 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* KPI 1: Cumulative Index GPA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/30 dark:border-slate-800/60 shadow-md relative group h-44"
        >
          <div className="absolute top-4 right-4 p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cumulative GPA</span>
            <div className="flex items-baseline gap-2 pt-1">
              <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-poppins">{user.gpa}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ 4.00</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                style={{ width: `${(user.gpa / 4.00) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
              {Math.round((user.gpa / 4) * 100)}%
            </span>
          </div>
        </motion.div>

        {/* KPI 2: Total Registered Courses */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/30 dark:border-slate-800/60 shadow-md relative group h-44"
        >
          <div className="absolute top-4 right-4 p-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Registered Classes</span>
            <div className="flex items-baseline gap-2 pt-1">
              <h3 className="text-4xl font-black text-purple-600 dark:text-purple-400 font-poppins">{courses.length}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Active Modules</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 pointer-events-auto">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              17 Academic Credits
            </span>
            <button 
              id="goto-courses-btn"
              onClick={() => setCurrentView('courses')}
              className="text-purple-600 dark:text-purple-400 hover:underline flex items-center cursor-pointer"
            >
              See Grid
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

        {/* KPI 3: Pending Tasks & Late items */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/30 dark:border-slate-800/60 shadow-md relative group h-44"
        >
          <div className="absolute top-4 right-4 p-2 bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-500/15 text-pink-600 dark:text-pink-400 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pending Deliverables</span>
            <div className="flex items-baseline gap-2.5 pt-1">
              <h3 className="text-4xl font-black text-pink-600 dark:text-pink-400 font-poppins">
                {pendingAssignments.length}
              </h3>
              {lateAssignments.length > 0 && (
                <span className="py-0.5 px-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-extrabold flex items-center gap-1 animate-pulse border border-rose-300/30">
                  <AlertCircle className="h-2.5 w-2.5" />
                  {lateAssignments.length} Late!
                </span>
              )}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 pointer-events-auto">
            <span>{finishedAssignmentsCount} completed pipeline logs</span>
            <button 
              id="goto-assignments-btn"
              onClick={() => setCurrentView('assignments')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center cursor-pointer"
            >
              View Hub
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Visual Analytics Sections (Framer-motion staggered graphs) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3 units: GPA performance Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 glass-panel rounded-3xl p-6 border border-white/30 dark:border-slate-800/60"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                GPA Progression Curve
              </h4>
              <p className="text-xs text-slate-400">Academic quality trends compared to cohort average</p>
            </div>
            
            <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-lg px-2.5 py-1 font-extrabold uppercase">
              Official Transcript
            </span>
          </div>

          <div className="h-72 w-full pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis 
                  dataKey="semester" 
                  stroke="rgba(148, 163, 184, 0.6)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  domain={[3.0, 4.0]} 
                  stroke="rgba(148, 163, 184, 0.6)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'Inter',
                  }} 
                />
                <Area 
                  name="My Index" 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorGpa)" 
                />
                <Area 
                  name="Cohort Average" 
                  type="monotone" 
                  dataKey="classAverage" 
                  stroke="#8b5cf6" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4" 
                  fillOpacity={1} 
                  fill="url(#colorAvg)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right 2 units: Course Progress bar metrics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/30 dark:border-slate-800/60 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="space-y-0.5">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-purple-500" />
                  Module Mastery Index
                </h4>
                <p className="text-xs text-slate-400">Current progress bars per module code</p>
              </div>
            </div>

            <div className="h-56 w-full flex items-end">
              <ResponsiveContainer 
                key={`barchart-courses-${courses.length}-${courses.map(c => `${c.id}-${c.progress}`).join(',')}`}
                width="100%" 
                height="100%"
              >
                <BarChart 
                  data={courseChartData} 
                  margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(148, 163, 184, 0.6)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="rgba(148, 163, 184, 0.6)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar 
                    dataKey="progress" 
                    radius={[8, 8, 0, 0]} 
                    barSize={24}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {courseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center pointer-events-auto">
            <button
              id="goto-calc-btn"
              onClick={() => setCurrentView('grades')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors pointer-events-auto cursor-pointer flex items-center justify-center gap-1.5"
            >
              Analyze Transcript Ledger
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Down section: Next lessons schedule & Urgent Actions checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Urgent Assignments Toggle Dashboard Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel rounded-3xl p-6 border border-white/30 dark:border-slate-800/60"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins">
                Urgent Deliverables
              </h4>
              <p className="text-xs text-slate-400">Click to tag submitted in local telemetry</p>
            </div>
            
            <button
              id="view-all-asg-btn"
              onClick={() => setCurrentView('assignments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center cursor-pointer pointer-events-auto"
            >
              View Hub
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingAssignments.slice(0, 3).map((asg) => (
              <div 
                key={asg.id}
                onClick={() => toggleAssignmentStatus(asg.id)}
                className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/10 flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/20 hover:bg-slate-100/30 transition-all pointer-events-auto group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-5 w-5 shrink-0 rounded-md border-2 border-indigo-500/30 group-hover:border-indigo-500 flex items-center justify-center transition-colors bg-white dark:bg-slate-900 mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500 scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight">
                      {asg.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wide">
                      {asg.courseName}
                    </span>
                  </div>
                </div>
                
                <span className="shrink-0 py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300/10">
                  Due {asg.dueDate}
                </span>
              </div>
            ))}
            
            {pendingAssignments.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                ✨ Zero outstanding materials. Outstanding achievement!
              </div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Class timetable snapshot card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-3xl p-6 border border-white/30 dark:border-slate-800/60"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins text-left">
                Tomorrow's Lectures
              </h4>
              <p className="text-xs text-slate-400 text-left">Location tracker schedule logs</p>
            </div>
            
            <button
              id="view-module-grid-btn"
              onClick={() => setCurrentView('courses')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center cursor-pointer pointer-events-auto"
            >
              See Classes
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {courses.slice(0, 2).map((course, idx) => (
              <div 
                key={course.id}
                className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/10 flex items-center gap-4 text-left pointer-events-auto"
              >
                <div className={`p-2.5 rounded-xl text-xs font-extrabold font-mono shrink-0 shadow-sm ${
                  idx === 0 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' 
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                }`}>
                  {course.code}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate leading-tight">
                    {course.title}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1 shrink-0">
                    <span className="truncate">{course.location}</span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0 text-slate-500 dark:text-slate-400">{course.schedule.split(' ')[1]} {course.schedule.split(' ')[2]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  );
}
