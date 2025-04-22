import React from 'react';
import { View, Image, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from '@/components/safe-area-view';
import { Body, H1 } from '@/components/ui/typography';

export default function SetupIndexScreen() {
  const router = useRouter();

  // Start the setup process
  const handleStart = () => {
    router.push('/setup/gender');
  };

  return (
    <ImageBackground
      source={require('@/assets/setup-bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.3)', 'rgba(34, 34, 34, 0.9)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <Animated.View 
            entering={FadeIn.duration(800)}
            className="flex-1 px-6 justify-center"
          >
            <View className="items-center mb-8">
              <Animated.View 
                entering={FadeInUp.duration(1000)}
                className="mb-8 rounded-full bg-white/15 p-6 shadow-lg"
              >
                <Image
                  source={require('@/assets/icon.png')}
                  className="w-[130px] h-[130px] rounded-3xl"
                  resizeMode="contain"
                />
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(200).duration(1000)}
                className="items-center mb-8"
              >
                <H1 className="text-white text-4xl font-bold mb-4 text-center">
                  Your Hair Journey Begins Here
                </H1>
                
                <Body className="text-gray-200 text-center leading-6 px-4">
                  Answer a few questions to discover your perfect hair care routine
                  tailored to your unique hair profile.
                </Body>
              </Animated.View>
            </View>
            
            <Animated.View 
              entering={FadeInUp.delay(400).duration(1000)}
              className="mb-10 w-full"
            >
              <View className="bg-primary/20 backdrop-blur-lg border border-primary/30 rounded-2xl p-6 shadow-md">
                <View className="items-center mb-2">
                  <Feather name="award" size={28} color="#AA8AD2" />
                </View>
                <Text className="text-white text-xl font-bold mb-2 text-center">
                  Expert Hair Care Awaits
                </Text>
                <Text className="text-gray-200 text-center">
                  Join thousands of people who have transformed their hair with our personalized recommendations.
                </Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInUp.delay(600).duration(1000)}
              className="w-full items-center"
            >
              <Button 
                variant="primary"
                size="lg"
                fullWidth
                icon="arrow-right"
                onPress={handleStart}
                className="h-14 rounded-xl shadow-lg shadow-primary/40"
              >
                Create Your Hair Profile
              </Button>
              
              <Text className="text-gray-400 mt-4 text-center text-xs">
                Takes less than 2 minutes
              </Text>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}