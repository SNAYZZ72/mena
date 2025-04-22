import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1, Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function CompleteScreen() {
  const router = useRouter();
  const { profile, saveProfile, isLoading } = useSetup();
  
  // Calculate progress percentage - since this is the complete screen, we set it to 100%
  const progress = useMemo(() => {
    return 100; // At the complete screen, progress is 100%
  }, []);

  // Handle finish button press
  const handleFinish = async () => {
    console.log('Saving profile and completing setup');
    await saveProfile();
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Summarize selected preferences in a user-friendly way
  const getHairTypeLabel = () => {
    if (!profile?.hair_type) return 'Not specified';
    
    switch (profile?.hair_type) {
      case 'straight': return 'Straight';
      case 'wavy': return 'Wavy';
      case 'curly': return 'Curly';
      case 'coily': return 'Coily/Kinky';
      default: return 'Not specified';
    }
  };

  const getHairGoals = () => {
    if (!profile?.hair_goals || profile.hair_goals.length === 0) return 'None specified';
    
    return profile.hair_goals.map((goal: string) => 
      goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ')
    ).join(', ');
  };

  const getHairConcerns = () => {
    if (!profile?.hair_concerns || profile.hair_concerns.length === 0) return 'None specified';
    
    return profile.hair_concerns.map((concern: string) => 
      concern === 'none' ? 'None' : concern.charAt(0).toUpperCase() + concern.slice(1).replace('_', ' ')
    ).join(', ');
  };

  return (
    <ImageBackground
      source={require('@/assets/complete-bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.2)', 'rgba(34, 34, 34, 0.92)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1">
            {/* Progress Bar */}
            <View className="px-5 pt-4">
              <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                <Animated.View 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
            
            {/* Header */}
            <View className="px-5 pt-4 flex-row items-center">
              <TouchableOpacity 
                onPress={handleBack} 
                className="flex-row items-center"
              >
                <Feather name="chevron-left" size={24} color="#FFFFFF" />
                <Text className="text-white ml-1">Back</Text>
              </TouchableOpacity>
            </View>
            
            {/* Content */}
            <ScrollView 
              className="flex-1"
              contentContainerClassName="px-6 pb-10"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View 
                entering={FadeInUp.duration(800)}
                className="items-center mt-8 mb-10"
              >
                <View className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 items-center justify-center mb-8 shadow-lg shadow-green-500/30">
                  <Feather name="check" size={56} color="#FFFFFF" />
                </View>
                <H1 className="text-white text-4xl font-bold mb-3 text-center">
                  Your Hair Profile is Ready!
                </H1>
                <Body className="text-gray-200 text-center px-4">
                  We've created your personalized hair care plan based on your unique profile.
                </Body>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInDown.delay(400).duration(800)}
                className="mb-8"
              >
                <BlurView intensity={30} tint="dark" className="overflow-hidden rounded-2xl border border-white/20">
                  <View className="bg-white/10 p-6">
                    <View className="flex-row items-center mb-5">
                      <Feather name="user" size={20} color="#AA8AD2" style={{ marginRight: 8 }} />
                      <Text className="text-primary font-bold text-xl">
                        Your Hair Profile
                      </Text>
                    </View>
                    
                    <View className="mb-5 border-b border-white/15 pb-4">
                      <Text className="text-gray-400 mb-2 text-sm">Hair Type</Text>
                      <View className="flex-row items-center">
                        <Feather name={profile?.hair_type === 'straight' ? 'align-center' : 
                                  profile?.hair_type === 'wavy' ? 'trending-up' : 
                                  profile?.hair_type === 'curly' ? 'refresh-cw' : 'rotate-cw'} 
                                  size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{getHairTypeLabel()}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-5 border-b border-white/15 pb-4">
                      <Text className="text-gray-400 mb-2 text-sm">Age</Text>
                      <View className="flex-row items-center">
                        <Feather name="calendar" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{profile?.age ? `${profile.age} years` : 'Not specified'}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-5 border-b border-white/15 pb-4">
                      <Text className="text-gray-400 mb-2 text-sm">Top Concerns</Text>
                      <View className="flex-row items-center">
                        <Feather name="alert-circle" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{getHairConcerns()}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-5 border-b border-white/15 pb-4">
                      <Text className="text-gray-400 mb-2 text-sm">Main Goals</Text>
                      <View className="flex-row items-center">
                        <Feather name="target" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{getHairGoals()}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-5 border-b border-white/15 pb-4">
                      <Text className="text-gray-400 mb-2 text-sm">Routine Preference</Text>
                      <View className="flex-row items-center">
                        <Feather name="clock" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{profile?.routine_preference || 'Not specified'}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-1">
                      <Text className="text-gray-400 mb-2 text-sm">Product Preference</Text>
                      <View className="flex-row items-center">
                        <Feather name="shopping-bag" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text className="text-white text-lg font-medium">{profile?.product_preference || 'Not specified'}</Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInDown.delay(800).duration(800)}
                className="mb-8"
              >
                <View className="bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-lg border border-primary/30 rounded-2xl p-6 shadow-lg">
                  <View className="items-center mb-3">
                    <Feather name="calendar" size={28} color="#AA8AD2" />
                  </View>
                  <Text className="text-white text-xl font-bold mb-3 text-center">
                    Your Hair Transformation Starts Today
                  </Text>
                  <Text className="text-gray-200 text-center leading-5">
                    Follow your personalized routine to achieve your hair goals. 
                    Track your progress and see visible results in just a few weeks!
                  </Text>
                </View>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInDown.delay(1200).duration(800)}
                className="mt-4"
              >
                <Button 
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  icon="activity"
                  onPress={handleFinish}
                  className="h-14 rounded-xl shadow-lg shadow-primary/40"
                >
                  Start My Hair Journey
                </Button>
                
                <Text className="text-gray-400 mt-4 text-center text-xs">
                  Your profile can be updated anytime from settings
                </Text>
              </Animated.View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}