import { supabase } from '@/config/supabase';
import { ApiResponse } from '@/types/api';
import { HairProfile } from '@/types/profile';
import { UserProfile } from '@/types/user';

/**
 * Get the user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data: data as UserProfile, error };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error: error as any };
  }
}

/**
 * Get the hair profile by user ID
 */
export async function getHairProfile(userId: string): Promise<ApiResponse<HairProfile>> {
  try {
    const { data, error } = await supabase
      .from('hair_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    return { data: data as HairProfile, error };
  } catch (error) {
    console.error('Error fetching hair profile:', error);
    return { data: null, error: error as any };
  }
}

/**
 * Save or update a hair profile
 */
export async function saveHairProfile(profile: HairProfile): Promise<ApiResponse<HairProfile>> {
  try {
    const { data, error } = await supabase
      .from('hair_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    return { data: data as HairProfile, error };
  } catch (error) {
    console.error('Error saving hair profile:', error);
    return { data: null, error: error as any };
  }
}

/**
 * Update the user profile
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select()
      .single();
    
    return { data: data as UserProfile, error };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error: error as any };
  }
}

/**
 * Generic function to fetch data from any table
 */
export async function fetchData<T>(
  table: string, 
  query?: {
    select?: string;
    eq?: [string, any][];
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
): Promise<ApiResponse<T[]>> {
  try {
    let queryBuilder = supabase.from(table).select(query?.select || '*');
    
    // Apply filters if provided
    if (query?.eq) {
      query.eq.forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });
    }
    
    // Apply ordering if provided
    if (query?.orderBy) {
      queryBuilder = queryBuilder.order(
        query.orderBy.column, 
        { ascending: query.orderBy.ascending ?? true }
      );
    }
    
    // Apply limit if provided
    if (query?.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }
    
    const { data, error } = await queryBuilder;
    return { data: data as T[], error };
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    return { data: null, error: error as any };
  }
} 