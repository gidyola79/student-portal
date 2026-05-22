import { useState, FormEvent, useEffect, useRef } from 'react';
import { usePortalStore } from '../store';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Calculator, 
  Sparkles, 
  Award, 
  Percent, 
  BookMarked,
  PlusCircle,
  X,
  Download
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { motion, AnimatePresence, animate } from 'motion/react';
import { jsPDF } from 'jspdf';

function AnimatedGPACounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Custom elegant easeOut
      onUpdate: (latest) => {
        setDisplayValue(latest);
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toFixed(2)}</span>;
}

export default function GradesSection() {
  const { grades, user, addGradeItem, deleteGradeItem, getRecalculatedGPA } = usePortalStore();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  
  // Custom interactive simulator state
  const [courseName, setCourseName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [grade, setGrade] = useState<'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F'>('A');
  const [score, setScore] = useState(90);

  if (!user) return null;

  // Grade symbols maps to score index for stats
  const gradeScoreMap: Record<string, number> = {
    'A+': 98, 'A': 94, 'A-': 90,
    'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'F': 40,
  };

  // Radar/Bar visual layout data of academic developments
  const performanceChartData = grades.map((grd) => ({
    subject: grd.code,
    score: grd.score,
    average: gradeScoreMap[grd.grade] - 4, // cohort mockup comparison
  }));

  const handleAddModule = (e: FormEvent) => {
    e.preventDefault();
    if (!courseName || !code) return;

    // Use selected values and trigger compute
    addGradeItem({
      courseName,
      code: code.toUpperCase(),
      credits,
      grade,
      score,
      semester: 'Spring 2026',
    });

    // Reset simulator form
    setCourseName('');
    setCode('');
    setScore(90);
    setIsCalculatorOpen(false);
  };

  // Calculate stats
  const totalCredits = grades.reduce((sum, item) => sum + item.credits, 0);

  const handleExportToPDF = () => {
    // Instantiate jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Theme color palette definition
    const colorPrimary = [79, 70, 229]; // Indigo-600 elegant accent
    const colorSlate900 = [15, 23, 42];  // Slate-900 commanding text
    const colorSlate200 = [226, 232, 240]; // Slate-200 dividers
    const colorSlate600 = [71, 85, 105]; // Slate-600 subtext
    const colorSlate400 = [148, 163, 184]; // Slate-400 footers
    const colorSlate50 = [248, 250, 252];  // Slate-50 background fill

    // 1. Decorative elegant banner strip
    doc.setFillColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.rect(20, 15, 170, 4, 'F');

    // 2. Transcript Heading Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colorSlate900[0], colorSlate900[1], colorSlate900[2]);
    doc.text("Official Academic Transcript", 20, 32);

    // Subtitle annotation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(colorSlate600[0], colorSlate600[1], colorSlate600[2]);
    doc.text("ACADEMIC RECORD & SYSTEM VERIFIED TRANSCRIPT", 20, 37);

    // Divider line below header
    doc.setDrawColor(colorSlate200[0], colorSlate200[1], colorSlate200[2]);
    doc.setLineWidth(0.4);
    doc.line(20, 41, 190, 41);

    // 3. Student Info Profile Section Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.text("I. STUDENT PROFILE RECORD", 20, 48);

    doc.setFontSize(9.5);
    doc.setTextColor(colorSlate900[0], colorSlate900[1], colorSlate900[2]);
    
    // Name Row Left Col
    doc.setFont('helvetica', 'bold');
    doc.text("FullName:", 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(user.name, 48, 55);

    // Student ID
    doc.setFont('helvetica', 'bold');
    doc.text("Student ID:", 20, 61);
    doc.setFont('helvetica', 'normal');
    doc.text(user.studentId, 48, 61);

    // Degree Major
    doc.setFont('helvetica', 'bold');
    doc.text("Degree Major:", 20, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(user.major, 48, 67);

    // Right Column Info
    doc.setFont('helvetica', 'bold');
    doc.text("Email Address:", 110, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(user.email, 138, 55);

    // Admissions Date
    doc.setFont('helvetica', 'bold');
    doc.text("Enrollment Date:", 110, 61);
    doc.setFont('helvetica', 'normal');
    doc.text(user.joinDate, 138, 61);

    // Issued On Date
    doc.setFont('helvetica', 'bold');
    doc.text("Document Date:", 110, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 138, 67);

    // Line separator after profile details
    doc.setDrawColor(colorSlate200[0], colorSlate200[1], colorSlate200[2]);
    doc.line(20, 73, 190, 73);

    // 4. Academic Ledger Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.text("II. COMPLETED MODULE LEDGER", 20, 80);

    // Table Header Accent Fill & Borders
    doc.setFillColor(colorSlate50[0], colorSlate50[1], colorSlate50[2]);
    doc.rect(20, 85, 170, 7.5, 'F');
    doc.line(20, 85, 190, 85);
    doc.line(20, 92.5, 190, 92.5);

    // Text column labels
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colorSlate600[0], colorSlate600[1], colorSlate600[2]);
    doc.text("Code ID", 22, 90);
    doc.text("Module Description / Title", 45, 90);
    doc.text("Credits", 132, 90);
    doc.text("Score", 152, 90);
    doc.text("Grade Scale", 168, 90);

    // Dynamic Module Rows
    let currentY = 99;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    grades.forEach((item, index) => {
      // Row separator
      if (index > 0) {
        doc.setDrawColor(241, 245, 249);
        doc.line(20, currentY - 5, 190, currentY - 5);
      }

      doc.setTextColor(colorSlate900[0], colorSlate900[1], colorSlate900[2]);

      // Code
      doc.setFont('helvetica', 'bold');
      doc.text(item.code, 22, currentY);

      // Description with max width safety truncation limit
      doc.setFont('helvetica', 'normal');
      const maxTitleWidth = 42;
      const displayTitle = item.courseName.length > maxTitleWidth 
        ? item.courseName.substring(0, maxTitleWidth - 3) + "..." 
        : item.courseName;
      doc.text(displayTitle, 45, currentY);

      // Credits & Score percentage values
      doc.text(`${item.credits} Units`, 132, currentY);
      doc.text(`${item.score}%`, 152, currentY);

      // Dynamic scales and conditional highlights for grades
      doc.setFont('helvetica', 'bold');
      if (item.grade.startsWith('A')) {
        doc.setTextColor(16, 185, 129); // green-500 for excellent
      } else if (item.grade.startsWith('B')) {
        doc.setTextColor(79, 70, 229);  // indigo-600 for high profile
      } else {
        doc.setTextColor(239, 68, 68);  // red-500
      }
      doc.text(item.grade, 168, currentY);

      currentY += 8;
    });

    // Separator above summary footer calculations
    doc.setDrawColor(colorSlate200[0], colorSlate200[1], colorSlate200[2]);
    doc.setLineWidth(0.4);
    doc.line(20, currentY, 190, currentY);

    currentY += 5;

    // 5. Standing calculations panel box style
    doc.setFillColor(colorSlate50[0], colorSlate50[1], colorSlate50[2]);
    doc.rect(20, currentY, 170, 20.5, 'F');
    doc.setDrawColor(203, 213, 225); // Slate-300 borders
    doc.rect(20, currentY, 170, 20.5, 'S');

    // Box text metrics values
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colorSlate900[0], colorSlate900[1], colorSlate900[2]);
    doc.text("III. ACADEMIC STANDING STATUS", 24, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(colorSlate600[0], colorSlate600[1], colorSlate600[2]);
    doc.text(`Total Credit Weight Attempted: ${totalCredits} Units`, 24, currentY + 13.5);

    // Large high contrast right aligned GPA Scale
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(79, 70, 229); // Indigo 605
    doc.text(`CUMULATIVE GPA: ${user.gpa.toFixed(2)} / 4.00`, 110, currentY + 11.5);

    // Secure Verification seal bar details in very footer coordinates
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colorSlate400[0], colorSlate400[1], colorSlate400[2]);
    doc.text("VERIFIED SECURE TRANSCRIPT RECORD - ELECTRONIC REGISTRAR SEAL APPLIED", 41, 274);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Document Reference Key: TRNS-SYS-${user.studentId}-${Math.floor(100000 + Math.random() * 900000)}`, 61, 279);

    // Download/Save Document triggered directly
    doc.save(`Transcript_${user.studentId || "Student"}.pdf`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Dynamic Summary GPA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cumulative GPA Index Gauge card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/10 shadow-xl text-white flex flex-col justify-between h-44"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">Cumulative GPA Score</h4>
            <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <motion.span 
                key={user.gpa}
                initial={{ scale: 0.92, filter: "blur(1px)", opacity: 0.8 }}
                animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="text-5xl font-extrabold font-poppins text-white leading-none inline-block font-poppins"
              >
                <AnimatedGPACounter value={user.gpa} />
              </motion.span>
              <span className="text-xs text-slate-400 leading-none">/ 4.00 Max Index</span>
            </div>
            
            {/* Visual Arc-style Linear/Glowing GPA Gauge */}
            <div className="w-full bg-indigo-950/60 border border-indigo-500/10 h-1.5 rounded-full overflow-hidden mt-3 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(user.gpa / 4.0) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 16 }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full shadow-[0_0_8px_rgba(129,140,248,0.6)]" 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Auto-synced with official registrar registries</p>
          </div>
        </motion.div>

        {/* Total Academic Credits registered card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between h-44 text-left"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Credits Completed</h4>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-500">
              <BookMarked className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-poppins text-emerald-600 dark:text-emerald-400 leading-none">
                {totalCredits}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">Accumulated Credits</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((totalCredits / 120) * 100, 100)}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Graduation targets index card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between h-44 text-left"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Target Semester Margin</h4>
            <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-500">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-poppins text-purple-600 dark:text-purple-400 leading-none">
                {user.targetGpa}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">Syllabus Margin Goal</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">0.16 units remaining for Dean List honors</p>
          </div>
        </motion.div>

      </div>

      {/* Report analysis & visual metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3 columns: Interactive Transcript List Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/60 overflow-hidden text-left flex flex-col pointer-events-auto shadow-sm"
        >
          <div className="p-5 border-b border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins">
                Academic Transcript Ledgers
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage, review, and synchronize completed modules</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="export-pdf-btn"
                onClick={handleExportToPDF}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer pointer-events-auto"
              >
                <Download className="h-4 w-4" />
                Export to Transcript PDF
              </button>
              
              <button
                id="calc-simulator-btn"
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 shadow-sm cursor-pointer pointer-events-auto"
              >
                <Calculator className="h-4 w-4" />
                Add Module Simulation
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  <th className="p-4">Module Code / Title</th>
                  <th className="p-4">Value Credits</th>
                  <th className="p-4">Score Index</th>
                  <th className="p-4">Academic Scale</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                <AnimatePresence initial={false}>
                  {grades.map((grd) => (
                    <motion.tr 
                      key={grd.id}
                      layout="position"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -15, transition: { duration: 0.2 } }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{grd.courseName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5 uppercase">{grd.code}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{grd.credits} Weight</td>
                      <td className="p-4 font-mono text-slate-850 dark:text-slate-200 font-semibold">{grd.score}%</td>
                      <td className="p-4">
                        <span className={`py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold leading-none uppercase ${
                          grd.grade.startsWith('A') 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10'
                        }`}>
                          {grd.grade} SCALE
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          id={`delete-grade-btn-${grd.id}`}
                          onClick={() => deleteGradeItem(grd.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer pointer-events-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right 2 columns: Recharts visual breakdown analytics of syllabus scores */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between"
        >
          <div className="space-y-0.5 mb-6 text-left">
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-poppins flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-purple-500" /> Subject Score Breakdown
            </h4>
            <p className="text-xs text-slate-400">Score levels compared to syllabus expectations</p>
          </div>

          <div className="h-60 w-full flex items-end">
            <ResponsiveContainer 
              key={`barchart-grades-${grades.length}-${grades.map(g => `${g.id}-${g.score}`).join(',')}`}
              width="100%" 
              height="100%"
            >
              <BarChart 
                data={performanceChartData} 
                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="subject" 
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
                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar 
                  name="My Score" 
                  dataKey="score" 
                  fill="#6366f1" 
                  radius={[6, 6, 0, 0]} 
                  barSize={16} 
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
                <Bar 
                  name="Class Average" 
                  dataKey="average" 
                  fill="#c084fc" 
                  radius={[6, 6, 0, 0]} 
                  barSize={16} 
                  isAnimationActive={true}
                  animationBegin={100}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 block">UNIVERSITY QUALITY RECONCILIATION GATE</span>
          </div>
        </motion.div>

      </div>

      {/* Calculator Modal Add Simulation */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <>
            <motion.div
              id="calc-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalculatorOpen(false)}
              className="fixed inset-0 bg-slate-950 backdrop-blur-xs z-50 pointer-events-auto cursor-pointer"
            />

            <motion.div
              id="calc-modal-drawer"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:right-6 sm:bottom-6 sm:top-24 w-auto sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl z-50 overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col p-6 pointer-events-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800 mb-5">
                <h3 className="text-sm sm:text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-indigo-600" /> Log Subject Grade Simulation
                </h3>
                <button
                  id="close-calc-modal-btn"
                  onClick={() => setIsCalculatorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddModule} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Module Title Name</label>
                  <input
                    id="sim-course-name"
                    type="text"
                    required
                    placeholder="e.g., Fourier Matrix Calculations..."
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Code Identifier</label>
                    <input
                      id="sim-course-code"
                      type="text"
                      required
                      placeholder="e.g., MAT-492"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Credit Weight</label>
                    <input
                      id="sim-credits"
                      type="number"
                      required
                      min={1}
                      max={5}
                      value={credits}
                      onChange={(e) => setCredits(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Grade Symbol</label>
                    <select
                      id="sim-grade"
                      value={grade}
                      onChange={(e) => {
                        const targetScale = e.target.value as any;
                        setGrade(targetScale);
                        setScore(gradeScoreMap[targetScale]);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                    >
                      <option value="A+">A+ (4.0)</option>
                      <option value="A">A (4.0)</option>
                      <option value="A-">A- (3.7)</option>
                      <option value="B+">B+ (3.3)</option>
                      <option value="B">B (3.0)</option>
                      <option value="B-">B- (2.7)</option>
                      <option value="C+">C+ (2.3)</option>
                      <option value="C">C (2.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Marks Percentage</label>
                    <input
                      id="sim-score"
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    id="cancel-calc-btn"
                    type="button"
                    onClick={() => setIsCalculatorOpen(false)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-calc-btn"
                    type="submit"
                    className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 shadow-md shadow-indigo-500/10 cursor-pointer pointer-events-auto"
                  >
                    Append to Transcript
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
