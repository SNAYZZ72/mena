export type HairType = 'straight' | 'wavy' | 'curly' | 'coily' | 'mixed';
export type HairLength = 'short' | 'medium' | 'long' | 'extra-long';
export type HairGoal = 'growth' | 'strength' | 'moisture' | 'definition' | 'repair' | 'volume' | 'scalp' | 'frizz' | 'color' | 'shine';
export type HairTexture = 'fine' | 'medium' | 'coarse';
export type HairPorosity = 'low' | 'medium' | 'high';
export type HairDensity = 'low' | 'medium' | 'high';
export type Scalp = 'normal' | 'dry' | 'oily' | 'itchy' | 'flaky';
export type ChemicalProcess = 'color' | 'relaxer' | 'perm' | 'bleach' | 'none';

export interface HairProfile {
  id?: string;
  user_id: string;
  hair_type: HairType;
  hair_length: HairLength;
  hair_goals: HairGoal[];
  hair_texture: HairTexture;
  hair_porosity: HairPorosity;
  hair_density: HairDensity;
  scalp_condition: Scalp;
  hair_concerns: ChemicalProcess[];
  age?: number;
  routine_preference?: string;
  product_preference?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HairProfileContextType {
  profile: HairProfile | null;
  isLoading: boolean;
  updateProfile: (key: keyof HairProfile, value: HairProfile[keyof HairProfile]) => void;
  saveProfile: () => Promise<void>;
  resetProfile: () => void;
  isComplete: boolean;
}

export interface HairProfileProviderProps {
  children: React.ReactNode;
} 