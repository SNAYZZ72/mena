import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, StatusBar, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { OnboardingSlide, OnboardingSlideProps } from "@/components/ui/onboarding-slide";

// Constants
const { width } = Dimensions.get("window");
const COLORS = {
  primary: '#AA8AD2',
  accent: '#8BC34A',
  background: '#F8F9FA',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  dark: '#222222',
};

// Onboarding Data
const slides: (OnboardingSlideProps & { id: string; buttonText?: string; background?: any })[] = [
  {
    id: "1",
    title: "Welcome to MENA",
    description: "Your personal hair care assistant designed to transform your hair journey",
    isLogo: true,
    isFirst: true,
    background: require('@/assets/onboarding-bg-1.png'),
  },
  {
    id: "2",
    title: "Personalized Care",
    description: "Get customized routines and product recommendations based on your unique hair type and texture",
    icon: "user",
    iconType: 'feather',
    background: require('@/assets/onboarding-bg-2.png'),
  },
  {
    id: "3",
    title: "Track Your Progress",
    description: "Document your hair transformation with our visual tracking tools and celebrate your milestones",
    icon: "trending-up",
    iconType: 'feather',
    background: require('@/assets/onboarding-bg-3.png'),
  },
  {
    id: "4",
    title: "Join Our Community",
    description: "Connect with others on similar hair journeys and share tips for achieving your hair goals",
    icon: "users",
    iconType: 'feather',
    buttonText: "Get Started",
    background: require('@/assets/onboarding-bg-4.png'),
  },
];

// Progress Dots Component
const ProgressDots: React.FC<{ count: number; currentIndex: number }> = ({ count, currentIndex }) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: count }).map((_, idx) => (
      <Animated.View
        key={idx}
        entering={FadeIn.delay(300 + idx * 100)}
        style={[
          styles.dot,
          { 
            width: idx === currentIndex ? 24 : 8,
            backgroundColor: idx === currentIndex ? COLORS.accent : 'rgba(255, 255, 255, 0.5)' 
          }
        ]}
      />
    ))}
  </View>
);

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check if onboarding has been completed previously
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem("@mena_has_launched");
        if (status === "true") {
          console.log("Onboarding already completed, redirecting to welcome");
          router.replace("/welcome");
        } else {
          console.log("Starting onboarding flow");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Prevent navigation if already redirecting
  useEffect(() => {
    if (hasCompletedOnboarding) {
      router.replace("/welcome");
    }
  }, [hasCompletedOnboarding]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    }
  };

  const completeOnboarding = async () => {
    if (hasCompletedOnboarding) return;
    
    setHasCompletedOnboarding(true);
    try {
      console.log("Completing onboarding, setting flag");
      await AsyncStorage.setItem("@mena_has_launched", "true");
      router.replace("/welcome");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      router.replace("/welcome");
    }
  };

  const handleSkip = async () => {
    if (hasCompletedOnboarding) return;
    
    setHasCompletedOnboarding(true);
    try {
      console.log("Skipping onboarding, setting flag");
      await AsyncStorage.setItem("@mena_has_launched", "true");
      router.replace("/welcome");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      router.replace("/welcome");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <ImageBackground 
            source={item.background} 
            style={styles.slideBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
              style={styles.gradient}
            >
              <SafeAreaView style={styles.slide}>
                {/* Skip Button */}
                {currentIndex < slides.length - 1 && (
                  <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={handleSkip}
                  >
                    <Text style={styles.skipText}>Skip</Text>
                  </TouchableOpacity>
                )}
                
                <View style={styles.slideContent}>
                  <OnboardingSlide
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    iconType={item.iconType}
                    isLogo={item.isLogo}
                    isFirst={item.isFirst}
                  />
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <ProgressDots count={slides.length} currentIndex={currentIndex} />
        
        <Animated.View 
          entering={SlideInRight.delay(300)} 
          style={styles.buttonContainer}
        >
          <Button
            style={[
              styles.button,
              { backgroundColor: currentIndex === slides.length - 1 ? COLORS.accent : COLORS.primary }
            ]}
            onPress={currentIndex === slides.length - 1 ? completeOnboarding : handleNext}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {currentIndex === slides.length - 1 
                  ? slides[currentIndex].buttonText || "Get Started" 
                  : "Next"}
              </Text>
              {currentIndex < slides.length - 1 && (
                <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              )}
            </View>
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  slideBackground: {
    width,
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  slide: {
    flex: 1,
    position: 'relative',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});