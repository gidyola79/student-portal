export type CourseId = string;

export interface Course {
  id: CourseId;
  title: string;
  code: string;
  lecturer: string;
  progress: number; // 0 to 100
  credits: number;
  grade?: string;
  image: string;
  description: string;
  schedule: string;
  location: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: CourseId;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late';
  score?: number;
  totalPoints: number;
  description: string;
}

export interface GradeItem {
  id: string;
  courseName: string;
  code: string;
  credits: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F';
  score: number; // e.g., 92
  semester: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'assignment' | 'grade' | 'announcement' | 'alert';
  isRead: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatar: string;
  gpa: number;
  targetGpa: number;
  major: string;
  studentId: string;
  joinDate: string;
}
