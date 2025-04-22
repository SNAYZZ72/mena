import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle, 
  withDelay,
  withSpring,
  FadeIn
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#7B4E93', '#AA8AD2', '#C6B5E6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Animated.View style={logoStyle}>
              <Image
                source={require("@/assets/icon.png")}
                style={styles.logo}
              />
            </Animated.View>
            
            <Animated.View style={textStyle}>
              <Text style={styles.title}>MENA</Text>
              <Text style={styles.subtitle}>Your personalized hair care journey</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeIn.delay(1200).duration(800)}
              style={styles.wavesContainer}
            >
              <Image
                source={require("@/assets/waves.png")}
                style={styles.waves}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 24,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.5,
    opacity: 0.9
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    overflow: 'hidden',
  },
  waves: {
    width: '100%',
    height: '100%',
    opacity: 0.4
  }
});