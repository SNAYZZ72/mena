import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle, 
  withDelay,
  withSpring,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";

export default function LaunchScreen() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  
  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value
  }));
  
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value
  }));

  useEffect(() => {
    // Start animations
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withDelay(400, 
      withSpring(1, { damping: 14, stiffness: 100 })
    );
    textOpacity.value = withDelay(800, 
      withTiming(1, { duration: 800 })
    );
    
    // Check if the app has been launched before
    const checkFirstLaunch = async () => {
      try {
        console.log("Checking if first launch...");
        
        // For testing - You can uncomment this line to clear the has_launched flag
        // await AsyncStorage.removeItem("@mena_has_launched");
        
        const hasLaunched = await AsyncStorage.getItem("@mena_has_launched");
        console.log("Has launched before:", hasLaunched);
        
        // Delay navigation to show the animation
        setTimeout(() => {
          if (hasLaunched === null || hasLaunched !== "true") {
            console.log("First launch, navigating to onboarding");
            router.replace("/onboarding");
          } else {
            console.log("Not first launch, navigating to welcome");
            router.replace("/welcome");
          }
        }, 2500);
      } catch (error) {
        console.error("Error checking first launch:", error);
        setTimeout(() => router.replace("/welcome"), 2500);
      }
    };

    checkFirstLaunch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <Image
            source={require("@/assets/icon.png")}
            style={styles.logo}
          />
        </Animated.View>
        
        <Animated.View style={textStyle}>
          <Text style={styles.title}>MENA</Text>
          <Text style={styles.subtitle}>Your hair care journey begins</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
});