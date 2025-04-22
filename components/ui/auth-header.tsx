import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';

import { TouchableOpacity } from "react-native";
import { H1 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  lightMode?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  lightMode = false,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={24} color={lightMode ? "#FFFFFF" : "#333333"} />
        </TouchableOpacity>
      )}
      
      <View style={styles.titleContainer}>
        <H1 className={`text-2xl font-bold ${lightMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </H1>
        {subtitle && (
          <Text 
            className={`text-base mt-2 ${lightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: "100%",
  },
  backButton: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "column",
  },
  title: {
    color: "#333333",
  },
  titleLight: {
    color: "#FFFFFF",
  },
  subtitle: {
    color: "#666666",
  },
  subtitleLight: {
    color: "#CCCCCC",
  },
});