import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/config/supabase';
import { useSupabase } from './supabase-provider';

// Define the user hair profile type
export type HairProfile = {
  gender?: string;
  hairType?: string;
  hairLength?: string;
  hairDensity?: string;
  hairTexture?: string;
  scalpCondition?: string;
  hairConcerns?: string[];
  hairGoals?: string[];
  routinePreference?: string;
  productPreference?: string;
};

// Define the context type
type SetupContextType = {
  currentStep: number;
  totalSteps: number;
  hairProfile: HairProfile;
  isLoading: boolean;
  updateProfile: (key: keyof HairProfile, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  saveProfile: () => Promise<void>;
  progress: number;
};

// Create the context with default values
const SetupContext = createContext<SetupContextType>({
  currentStep: 1,
  totalSteps: 7,
  hairProfile: {},
  isLoading: false,
  updateProfile: () => {},
  nextStep: () => {},
  previousStep: () => {},
  goToStep: () => {},
  saveProfile: async () => {},
  progress: 0,
});

// Custom hook to use the setup context
export const useSetup = () => useContext(SetupContext);

// Props for the provider component
type SetupProviderProps = {
  children: React.ReactNode;
  initialStep?: number;
  onComplete?: () => void;
};

export const SetupProvider: React.FC<SetupProviderProps> = ({
  children,
  initialStep = 1,
  onComplete,
}) => {
  const { user } = useSupabase();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [hairProfile, setHairProfile] = useState<HairProfile>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Define the total number of steps in the setup process
  const totalSteps = 7;
  
  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;

  // Check if user exists and try to load their profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('hair_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data) {
          setHairProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  // Update a specific field in the profile
  const updateProfile = (key: keyof HairProfile, value: any) => {
    setHairProfile(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      saveProfile();
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // Save the complete profile to Supabase
  const saveProfile = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('hair_profiles')
        .upsert({
          user_id: user.id,
          ...hairProfile,
          updated_at: new Date(),
        });

      if (error) {
        console.error('Error saving profile:', error);
        return;
      }

      if (onComplete) {
        onComplete();
      } else {
        // Default navigation to the home screen after setup
        router.replace({ pathname: '/(app)/(protected)' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: SetupContextType = {
    currentStep,
    totalSteps,
    hairProfile,
    isLoading,
    updateProfile,
    nextStep,
    previousStep,
    goToStep,
    saveProfile,
    progress,
  };

  return (
    <SetupContext.Provider value={contextValue}>
      {children}
    </SetupContext.Provider>
  );
};