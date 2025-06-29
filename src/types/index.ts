export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  career_goals?: string[];
  current_skills?: string[];
  learning_style?: string;
  experience_level?: string;
  xp: number;
  guild_level: string;
  pathways_completed: number;
  total_hours: number;
  projects_completed: number;
  guild_rank: number;
  evaluation_completed?: boolean;
  evaluation_results?: any;
  evaluation_answers?: Record<number, string>;
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  skills: string[];
  modules: LearningModule[];
  progress?: number;
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'project';
  duration: number;
  completed?: boolean;
  content_url?: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  member_count: number;
  avatar_url?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'skill' | 'progress' | 'social' | 'time';
  requirements: Record<string, any>;
  earned_at?: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  match_percentage: number;
  required_skills: string[];
  missing_skills: string[];
  description: string;
  posted_date: string;
}

export interface OnboardingData {
  career_goals: string[];
  current_skills: string[];
  learning_style: string;
  experience_level: string;
  interests: string[];
}