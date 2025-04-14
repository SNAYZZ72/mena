import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { OnboardingSlide, OnboardingSlideProps } from "@/components/ui/onboarding-slide";

// Constants
const { width } = Dimensions.get("window");
const COLORS = {
  primary: '#AA8AD2',
  accent: '#4CAF50',
  background: '#F8F9FA',
  text: '#333333',
};

// Onboarding Data
const slides: (OnboardingSlideProps & { id: string; buttonText?: string })[] = [
  {
    id: "1",
    title: "Welcome to MENA",
    description: "Your personal hair care assistant",
    isLogo: true,
    isFirst: true,
  },
  {
    id: "2",
    title: "Personalized Care",
    description: "Get customized routines based on your unique hair type and goals",
    icon: "user",
    iconType: 'feather',
  },
  {
    id: "3",
    title: "Track Progress",
    description: "Monitor your hair health journey with visual tracking and reminders",
    icon: "trending-up",
    iconType: 'feather',
  },
  {
    id: "4",
    title: "Join the Community",
    description: "Connect with others and share tips for healthier hair",
    icon: "users",
    iconType: 'feather',
    buttonText: "Get Started",
  },
];

// Progress Dots Component
const ProgressDots: React.FC<{ count: number; currentIndex: number }> = ({ count, currentIndex }) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: count }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.dot,
          { backgroundColor: idx === currentIndex ? COLORS.primary : '#D0D0D0' }
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
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

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
          <OnboardingSlide
            title={item.title}
            description={item.description}
            icon={item.icon}
            iconType={item.iconType}
            isLogo={item.isLogo}
            isFirst={item.isFirst}
          />
        )}
      />

      {/* Bottom Navigation */}
      <Animated.View 
        entering={FadeIn} 
        style={styles.bottomContainer}
      >
        <ProgressDots count={slides.length} currentIndex={currentIndex} />
        
        <Button
          style={[
            styles.button,
            { backgroundColor: currentIndex === slides.length - 1 ? COLORS.accent : COLORS.primary }
          ]}
          onPress={currentIndex === slides.length - 1 ? completeOnboarding : handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 
              ? slides[currentIndex].buttonText || "Get Started" 
              : "Next"}
          </Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomContainer: {
    width: "100%",
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});