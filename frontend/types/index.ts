// TODO: Shared TypeScript types
// Re-export all domain types used across the app

// --- User & Auth ---
export type UserRole = 'student' | 'faculty' | 'admin' | 'contributor' | 'project_leader';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  department: string;
  semester: number;
  rollNumber: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

// --- Forum ---
export interface Post {
  id: string;
  content: string;
  author: User;
  subjectId: string;
  parentId?: string;
  upvotes: number;
  isPinned: boolean;
  createdAt: string;
}

// --- Resource ---
export interface Resource {
  id: string;
  name: string;
  url: string;
  subjectId: string;
  uploadedBy: User;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

// --- Project ---
export interface Project {
  id: string;
  title: string;
  description: string;
  leader: User;
  openRoles: string[];
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
}

// --- Notification ---
export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// TODO: Add more types as models are implemented
