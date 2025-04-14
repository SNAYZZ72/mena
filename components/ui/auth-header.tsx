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
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
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
          <Feather name="arrow-left" size={24} color="#333333" />
        </TouchableOpacity>
      )}
      
      <View style={styles.titleContainer}>
        <H1 className="text-2xl font-bold" style={styles.title}>{title}</H1>
        {subtitle && (
          <Text className="text-base mt-2" style={styles.subtitle}>{subtitle}</Text>
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
  subtitle: {
    color: "#666666",
  },
});