import { create } from 'zustand';
import { Course, Assignment, GradeItem, SystemNotification, UserProfile, CourseId } from './types';
import { mockUserProfile, mockAdminProfile, mockCourses, mockAssignments, mockGrades, mockNotifications } from './mockData';

// Save and restore helper
const getStoredTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('student_portal_theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light'; // Set primary website loading to light background
  }
  return 'light';
};

const getStoredUsers = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('apex_users_database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
  }
  return [
    { email: 'felix.vance@apex.edu', name: 'Felix Vance', password: 'password123', role: 'student' as const },
    { email: 'admin.clara@apex.edu', name: 'Dean Clara Oswald', password: 'adminpassword', role: 'admin' as const },
  ];
};

interface PortalStore {
  user: UserProfile | null;
  courses: Course[];
  assignments: Assignment[];
  grades: GradeItem[];
  notifications: SystemNotification[];
  currentView: 'dashboard' | 'courses' | 'assignments' | 'grades' | 'admin' | 'settings';
  selectedCourseId: CourseId | null;
  theme: 'light' | 'dark';
  usersDatabase: Array<{ email: string; name: string; password?: string; role: 'student' | 'admin' }>;
  isMobileSidebarOpen: boolean;
  
  // Actions
  login: (email: string, name: string, password?: string) => void;
  registerUser: (email: string, name: string, password?: string) => void;
  logout: () => void;
  switchRole: (role: 'student' | 'admin') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setCurrentView: (view: 'dashboard' | 'courses' | 'assignments' | 'grades' | 'admin' | 'settings') => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSelectedCourseId: (id: CourseId | null) => void;
  updateUser: (fields: Partial<UserProfile>) => void;
  
  // Assignment Operations
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<void>;
  toggleAssignmentStatus: (id: string) => void;
  deleteAssignment: (id: string) => void;
  
  // Grade Operations
  addGradeItem: (item: Omit<GradeItem, 'id'>) => void;
  deleteGradeItem: (id: string) => void;
  
  // Notification Operations
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'time' | 'isRead'>) => void;
  
  // Utilities
  getRecalculatedGPA: () => number;
}

const gradePointsMap: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'F': 0.0,
};

export const usePortalStore = create<PortalStore>((set, get) => ({
  user: mockUserProfile,
  courses: mockCourses,
  assignments: mockAssignments,
  grades: mockGrades,
  notifications: mockNotifications,
  currentView: 'dashboard',
  selectedCourseId: null,
  theme: getStoredTheme(),
  usersDatabase: getStoredUsers(),
  isMobileSidebarOpen: false,
  
  login: (email, name, password) => {
    const isDean = email.toLowerCase().includes('admin') || name.toLowerCase().includes('dean');
    const currentDb = get().usersDatabase;
    const foundUser = currentDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    let finalName = name;
    let finalRole: 'student' | 'admin' = isDean ? 'admin' : 'student';

    if (foundUser) {
      finalName = foundUser.name;
      finalRole = foundUser.role;
      if (password && foundUser.password && password !== '********' && foundUser.password !== password) {
        throw new Error("Incorrect password entered for this student profile.");
      }
    } else {
      // Auto-register dynamically
      if (!finalName) {
        const parts = email.split('@')[0].split(/[._+-]+/);
        finalName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
      if (!finalName) {
        finalName = 'Felix Vance';
      }
      get().registerUser(email, finalName, password);
    }

    const templateProfile = finalRole === 'admin' ? mockAdminProfile : mockUserProfile;
    const newUser: UserProfile = {
      ...templateProfile,
      email,
      name: finalName,
      role: finalRole,
      studentId: finalRole === 'admin' ? 'ADM-2026-0428' : 'STU-2026-' + Math.floor(1000 + Math.random() * 9000),
    };
    set({ user: newUser, currentView: finalRole === 'admin' ? 'admin' : 'dashboard' });
  },

  registerUser: (email, name, password) => {
    const isDean = email.toLowerCase().includes('admin') || name.toLowerCase().includes('dean');
    const newUserRecord = {
      email,
      name,
      password: password || 'password123',
      role: (isDean ? 'admin' : 'student') as 'student' | 'admin',
    };
    
    set((state) => {
      const updatedDb = [...state.usersDatabase.filter(u => u.email.toLowerCase() !== email.toLowerCase()), newUserRecord];
      localStorage.setItem('apex_users_database', JSON.stringify(updatedDb));
      return { usersDatabase: updatedDb };
    });
  },
  
  logout: () => {
    set({ user: null, currentView: 'dashboard', selectedCourseId: null });
  },
  
  switchRole: (role) => {
    set((state) => {
      if (!state.user) return {};
      const targetTemplate = role === 'admin' ? mockAdminProfile : mockUserProfile;
      const updatedUser: UserProfile = {
        ...state.user,
        role,
        name: targetTemplate.name,
        avatar: targetTemplate.avatar,
        studentId: targetTemplate.studentId,
        major: targetTemplate.major,
      };
      
      return { 
        user: updatedUser,
        currentView: role === 'admin' ? 'admin' : 'dashboard'
      };
    });
  },
  
  setTheme: (theme) => {
    localStorage.setItem('student_portal_theme', theme);
    set({ theme });
  },
  
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('student_portal_theme', newTheme);
    set({ theme: newTheme });
  },
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  
  setSelectedCourseId: (id) => set({ selectedCourseId: id }),
  
  updateUser: (fields) => set((state) => ({
    user: state.user ? { ...state.user, ...fields } : null
  })),
  
  addAssignment: async (asgData) => {
    // Simulate real API network delays
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newAsg: Assignment = {
      ...asgData,
      id: 'asg_' + Math.floor(Date.now()),
    };
    
    set((state) => {
      const updatedAssignments = [newAsg, ...state.assignments];
      
      // Also trigger a notification for scheduling
      const newNotif: SystemNotification = {
        id: 'not_' + Math.floor(Math.random() * 10000),
        title: 'Assignment Logged',
        message: `Successfully booked "${newAsg.title}" inside tracker platform.`,
        time: 'Just now',
        type: 'assignment',
        isRead: false,
      };
      
      return { 
        assignments: updatedAssignments,
        notifications: [newNotif, ...state.notifications],
      };
    });
  },
  
  toggleAssignmentStatus: (id) => {
    set((state) => {
      const updated = state.assignments.map((asg) => {
        if (asg.id !== id) return asg;
        const nextStatus: Assignment['status'] = 
          asg.status === 'pending' ? 'submitted' : 'pending';
        
        return { 
          ...asg, 
          status: nextStatus,
          score: nextStatus === 'submitted' ? Math.floor(asg.totalPoints * (0.85 + Math.random() * 0.15)) : undefined
        };
      });
      
      const targetAsg = state.assignments.find((a) => a.id === id);
      const isNowLoaded = targetAsg?.status === 'pending';
      const newNotif: SystemNotification = {
        id: 'not_' + Math.floor(Math.random() * 10000),
        title: isNowLoaded ? 'Assignment Completed' : 'Assignment Outstanding',
        message: isNowLoaded 
          ? `You submitted "${targetAsg?.title}" successfully.`
          : `"${targetAsg?.title}" has been moved back to your pending list.`,
        time: 'Just now',
        type: 'assignment',
        isRead: false,
      };
      
      return {
        assignments: updated,
        notifications: [newNotif, ...state.notifications],
      };
    });
  },
  
  deleteAssignment: (id) => {
    set((state) => ({
      assignments: state.assignments.filter((asg) => asg.id !== id),
    }));
  },
  
  addGradeItem: (itemData) => {
    const newItem: GradeItem = {
      ...itemData,
      id: 'grd_' + Math.floor(Date.now()),
    };
    
    set((state) => {
      const updatedGrades = [newItem, ...state.grades];
      
      // Auto-trigger dynamic notification
      const newNotif: SystemNotification = {
        id: 'not_' + Math.floor(Math.random() * 10000),
        title: 'Grades Calculated',
        message: `Registered module "${newItem.courseName}" (${newItem.grade}) to transcript.`,
        time: 'Just now',
        type: 'grade',
        isRead: false,
      };

      const calculatedGPA = Number(get().getRecalculatedGPA().toFixed(2));
      const updatedUser = state.user 
        ? { ...state.user, gpa: calculatedGPA } 
        : null;
      
      return {
        grades: updatedGrades,
        user: updatedUser,
        notifications: [newNotif, ...state.notifications],
      };
    });
  },
  
  deleteGradeItem: (id) => {
    set((state) => {
      const updatedGrades = state.grades.filter((grd) => grd.id !== id);
      
      // Calculate new GPA with remaining items
      let totalQualityPoints = 0;
      let totalCredits = 0;
      updatedGrades.forEach((grd) => {
        const points = gradePointsMap[grd.grade] ?? 4.0;
        totalQualityPoints += points * grd.credits;
        totalCredits += grd.credits;
      });
      
      const calculatedGPA = totalCredits > 0 
        ? Number((totalQualityPoints / totalCredits).toFixed(2)) 
        : 4.0;
        
      const updatedUser = state.user 
        ? { ...state.user, gpa: calculatedGPA } 
        : null;

      return {
        grades: updatedGrades,
        user: updatedUser,
      };
    });
  },
  
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },
  
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },
  
  addNotification: (notifData) => {
    const newNotif: SystemNotification = {
      ...notifData,
      id: 'not_' + Math.floor(Date.now()),
      time: 'Just now',
      isRead: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },
  
  getRecalculatedGPA: () => {
    const state = get();
    if (state.grades.length === 0) return 4.0;
    
    let totalQualityPoints = 0;
    let totalCredits = 0;
    
    state.grades.forEach((grd) => {
      const points = gradePointsMap[grd.grade] ?? 4.0;
      totalQualityPoints += points * grd.credits;
      totalCredits += grd.credits;
    });
    
    return totalCredits > 0 ? (totalQualityPoints / totalCredits) : 4.0;
  },
}));
