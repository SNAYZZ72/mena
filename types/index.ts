// Re-export all types from individual files
export * from './auth';

// If files don't exist yet, create empty placeholder exports to fix the errors
// Remove these when the actual files are implemented
export type { UserProfile, Achievement, UserStats } from './user';
export type { 
  HairType, 
  HairLength, 
  HairGoal, 
  HairTexture, 
  HairPorosity, 
  HairDensity, 
  Scalp, 
  ChemicalProcess, 
  HairProfile, 
  HairProfileContextType, 
  HairProfileProviderProps 
} from './profile';
export type { 
  IconName, 
  ButtonVariant, 
  ButtonSize, 
  ButtonProps, 
  InputProps, 
  TextProps 
} from './ui';
export type { 
  ApiResponse, 
  RoutineItem, 
  Product, 
  Post, 
  Comment 
} from './api'; 