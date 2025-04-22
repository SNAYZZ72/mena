import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSupabase } from './supabase-provider';
import { 
  HairProfile, 
  HairProfileContextType,
  HairProfileProviderProps
} from '@/types/profile';
import { getHairProfile, saveHairProfile } from '@/services/api';
import { getUserFriendlyErrorMessage } from '@/utils/error-handler';

// Create the context with default values
const SetupContext = createContext<HairProfileContextType>({
  profile: null,
  isLoading: false,
  updateProfile: () => {},
  saveProfile: async () => {},
  resetProfile: () => {},
  isComplete: false,
});

// Custom hook to use the setup context
export const useSetup = () => useContext(SetupContext);

export const SetupProvider: React.FC<HairProfileProviderProps> = ({
  children
}) => {
  const { user } = useSupabase();
  const router = useRouter();
  const [profile, setProfile] = useState<HairProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if profile has all required fields
  const isComplete = Boolean(
    profile?.hair_type &&
    profile?.hair_length &&
    profile?.hair_goals?.length &&
    profile?.hair_texture &&
    profile?.hair_porosity &&
    profile?.hair_density &&
    profile?.scalp_condition &&
    profile?.hair_concerns?.length &&
    profile?.age != null
  );

  // Check if user exists and try to load their profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getHairProfile(user.id);
          
        if (response.error) {
          throw response.error;
        }
        
        if (response.data) {
          setProfile(response.data);
        } else {
          // Initialize a new profile with user_id
          setProfile({
            user_id: user.id,
            hair_type: 'straight',
            hair_length: 'medium',
            hair_goals: [],
            hair_texture: 'medium',
            hair_porosity: 'medium',
            hair_density: 'medium',
            scalp_condition: 'normal',
            hair_concerns: ['none'],
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setError(getUserFriendlyErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  // Update a specific field in the profile
  const updateProfile = (key: keyof HairProfile, value: HairProfile[keyof HairProfile]) => {
    if (!profile) return;
    
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  // Reset the profile to initial state
  const resetProfile = () => {
    if (!user) return;
    
    setProfile({
      user_id: user.id,
      hair_type: 'straight',
      hair_length: 'medium',
      hair_goals: [],
      hair_texture: 'medium',
      hair_porosity: 'medium',
      hair_density: 'medium',
      scalp_condition: 'normal',
      hair_concerns: ['none'],
    });
  };

  // Save the profile to Supabase
  const saveProfile = async (): Promise<void> => {
    if (!user || !profile) {
      console.error('No user logged in or profile not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await saveHairProfile(profile);

      if (response.error) {
        throw response.error;
      }

      // Navigate to the home screen after successful save
      router.replace('/');
    } catch (error) {
      console.error('Error:', error);
      setError(getUserFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: HairProfileContextType = {
    profile,
    isLoading,
    updateProfile,
    saveProfile,
    resetProfile,
    isComplete,
  };

  return (
    <SetupContext.Provider value={contextValue}>
      {children}
    </SetupContext.Provider>
  );
};