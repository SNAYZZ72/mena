import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

// Types
type IconType = 'feather' | 'material';

export interface OnboardingSlideProps {
  title: string;
  description: string;
  icon?: string;
  iconType?: IconType;
  isLogo?: boolean;
  primary?: string;
  secondary?: string;
  isFirst?: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ 
  title, 
  description, 
  icon, 
  iconType, 
  isLogo,
  primary = "#AA8AD2",
  secondary = "#FFFFFF",
  isFirst = false,
}) => {
  const { width } = useWindowDimensions();
  
  const renderIcon = () => {
    if (isLogo) {
      return (
        <View className="items-center mb-4">
          <MaterialCommunityIcons 
            name="leaf" 
            size={60} 
            color="#4CAF50" 
            style={{ marginBottom: 10 }} 
          />
        </View>
      );
    }
    
    if (icon) {
      if (iconType === 'feather') {
        return (
          <View style={[styles.iconContainer, { backgroundColor: primary }]}>
            <Feather name={icon as any} size={36} color={secondary} />
          </View>
        );
      }
      
      if (iconType === 'material') {
        return (
          <View style={[styles.iconContainer, { backgroundColor: primary }]}>
            <MaterialCommunityIcons name={icon as any} size={36} color={secondary} />
          </View>
        );
      }
    }
    
    return null;
  };

  if (isFirst) {
    return (
      <Animated.View 
        entering={FadeIn.duration(800)} 
        style={[styles.slide, { width }]}
      >
        <View style={styles.welcomeContent}>
          {renderIcon()}
          <H1 className="text-4xl font-extrabold text-center" style={{ color: "#333333" }}>MENA</H1>
          <Text className="text-lg text-center mt-6">Your personalized hair care journey</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(800)} 
      style={[styles.slide, { width }]}
    >
      <View style={styles.content}>
        {renderIcon()}
        <H1 className="text-xl font-bold text-center mb-2" style={{ color: "#333333" }}>{title}</H1>
        <Text className="text-base text-center" style={{ color: "#666666" }}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});