export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  bio?: string;
  location?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date_unlocked?: string;
}

export interface UserStats {
  streak: number;
  points: number;
  level: number;
  completed_tasks: number;
  achievements: Achievement[];
} 