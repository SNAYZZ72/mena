// app/(app)/onboarding.tsx
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { View, FlatList, Dimensions, ListRenderItemInfo, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

// Constants
const { width } = Dimensions.get("window");
const COLORS = {
  primary: '#AA8AD2',     // Purple for content boxes
  accent: '#E0FF4F',      // Yellow-green for buttons
  dark: '#333333',        // Dark text
  light: '#FFFFFF',       // Light text
  background: '#222222',  // Dark background
  brandGreen: '#4CAF50'   // MENA brand green
};

// Types
type IconType = 'feather' | 'material';

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconType?: IconType;
  buttonText?: string;
  isLogo?: boolean;
}

// Data
const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome to",
    description: "MENA",
    isLogo: true,
  },
  {
    id: "2",
    title: "Start Your Journey Towards",
    description: "Healthier & Beautiful Hair",
    icon: "scissors",
    iconType: 'feather'
  },
  {
    id: "3",
    title: "Find Hair Care Tips That Fit",
    description: "Your Lifestyle",
    icon: "book-open",
    iconType: 'feather'
  },
  {
    id: "4",
    title: "A Community For You,",
    description: "Grow Together",
    icon: "users",
    iconType: 'feather',
    buttonText: "Get Started",
  },
];

// Components
const OnboardingIcon: React.FC<{ item: OnboardingItem }> = ({ item }) => {
  if (item.isLogo) {
    return (
      <View className="items-center mb-4">
        <MaterialCommunityIcons 
          name="leaf" 
          size={40} 
          color={COLORS.brandGreen} 
          style={{ marginBottom: 10 }} 
        />
        <H1 className="text-white text-4xl font-extrabold">MENA</H1>
      </View>
    );
  }
  
  if (item.icon) {
    if (item.iconType === 'feather') {
      return <Feather name={item.icon as any} size={36} color={COLORS.light} />;
    }
    
    if (item.iconType === 'material') {
      return <MaterialCommunityIcons name={item.icon as any} size={36} color={COLORS.light} />;
    }
  }
  
  return null;
};

const ProgressDots: React.FC<{ count: number; currentIndex: number }> = ({ count, currentIndex }) => (
  <View className="flex-row justify-center mt-4">
    {Array.from({ length: count }).map((_, idx) => (
      <View
        key={idx}
        className={`h-2 w-2 rounded-full mx-1 ${
          idx === currentIndex ? `bg-[${COLORS.accent}]` : "bg-white opacity-50"
        }`}
      />
    ))}
  </View>
);

const WelcomeScreen: React.FC<{ item: OnboardingItem }> = ({ item }) => (
  <Animated.View 
    entering={FadeIn.duration(800)} 
    className="flex-1 items-center justify-center"
  >
    <Text className="text-white font-bold text-xl mb-2">
      {item.title}
    </Text>
    <OnboardingIcon item={item} />
  </Animated.View>
);

const ContentScreen: React.FC<{ item: OnboardingItem }> = ({ item }) => (
  <Animated.View 
    entering={FadeIn.duration(800)} 
    className="flex-1 justify-center w-full px-8 mt-12"
  >
    <View style={{ backgroundColor: COLORS.primary }} className="py-6 px-4 rounded-lg items-center">
      <OnboardingIcon item={item} />
      <Text className="text-white font-bold text-center text-xl mt-3">
        {item.title}
      </Text>
      <Text className="text-white font-bold text-center text-xl">
        {item.description}
      </Text>
    </View>
  </Animated.View>
);

// Main Component
export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    }
  };

  const handleSkip = () => {
    // Mark that the app has been launched when skipping onboarding
    AsyncStorage.setItem("@mena_has_launched", "true").then(() => {
      router.replace("/welcome");
    }).catch(error => {
      console.error("Error saving launch state:", error);
      router.replace("/welcome");
    });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<OnboardingItem>) => (
    <View style={{ width }} className="relative">
      {/* Dark Background */}
      <View style={styles.background} />

      {/* Content Container */}
      <SafeAreaView className="flex-1 items-center justify-between py-12">
        {/* Skip Button */}
        {index < onboardingData.length - 1 && (
          <TouchableOpacity 
            className="absolute top-12 right-6 z-10"
            onPress={handleSkip}
          >
            <Text className="text-white font-semibold text-base">Skip</Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {index === 0 ? (
          <WelcomeScreen item={item} />
        ) : (
          <ContentScreen item={item} />
        )}

        {/* Navigation */}
        <View className="w-full px-6 mt-4">
          {index === onboardingData.length - 1 ? (
            <Button
              style={{ backgroundColor: COLORS.accent }}
              className="rounded-full"
              onPress={() => {
                // Mark that the app has been launched when completing onboarding
                AsyncStorage.setItem("@mena_has_launched", "true").then(() => {
                  router.replace("/welcome");
                }).catch(error => {
                  console.error("Error saving launch state:", error);
                  router.replace("/welcome");
                });
              }}
            >
              <Text style={{ color: COLORS.dark }} className="font-bold">
                {item.buttonText || "Get Started"}
              </Text>
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: COLORS.accent }}
              className="rounded-full opacity-90"
              onPress={handleNext}
            >
              <Text style={{ color: COLORS.dark }} className="font-bold">Next</Text>
            </Button>
          )}

          <ProgressDots count={onboardingData.length} currentIndex={currentIndex} />
        </View>
      </SafeAreaView>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={onboardingData}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      keyExtractor={(item) => item.id}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    width: width,
    height: '100%',
    position: 'absolute',
    backgroundColor: COLORS.background,
  }
});