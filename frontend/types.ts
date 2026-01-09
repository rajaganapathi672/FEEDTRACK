
export enum UserRole {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

export enum Sentiment {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative'
}

export enum FeedbackCategory {
  TEACHING = 'Teaching',
  FACILITIES = 'Facilities',
  EXAMS = 'Exams',
  LABS = 'Labs',
  HOSTEL = 'Hostel',
  OTHERS = 'Others'
}

export interface FeedbackAnalysis {
  category: FeedbackCategory;
  sentiment: Sentiment;
  confidence: number;
  highlights: string[];
  summary: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  studentName: string;
  text: string;
  timestamp: string;
  categoryGroup?: string;
  categoryType?: string;
  analysis: FeedbackAnalysis | null;
}

export interface StaffInsight {
  commonIssues: string[];
  trends: string;
  correctiveActions: string[];
  suggestedResponse: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
