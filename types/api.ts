import { PostgrestError } from '@supabase/supabase-js';

export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  day_of_week: number;
  time_of_day: 'morning' | 'afternoon' | 'evening';
  duration_minutes: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image_url?: string;
  ingredients?: string[];
  rating?: number;
  price_range?: 'low' | 'medium' | 'high';
  hair_type_compatibility?: string[];
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_username: string;
  author_avatar?: string;
  content: string;
  image_url?: string;
  likes: number;
  comments: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  has_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  author_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
  has_liked?: boolean;
} 