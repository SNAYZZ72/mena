// app/(app)/launch.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LaunchScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // Debug log to see the flow
        console.log("Checking if first launch...");
        
        // Check if this is the first time using the app
        const hasLaunched = await AsyncStorage.getItem("@mena_has_launched");
        console.log("Has launched before:", hasLaunched);
        
        // Short delay to show the launch screen
        setTimeout(() => {
          // Force clear the flag for testing - REMOVE THIS IN PRODUCTION
          // AsyncStorage.removeItem("@mena_has_launched");
          
          if (hasLaunched === null || hasLaunched !== "true") {
            // First use, go to onboarding first
            console.log("First launch, going to onboarding");
            // Navigate to onboarding first, we'll set the flag after onboarding completes
            router.replace("/onboarding");
            // Don't mark as launched yet - we'll do this in onboarding.tsx when user completes or skips
          } else {
            // Already used, go to login screen
            console.log("Not first launch, going to welcome");
            router.replace("/welcome");
          }
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error checking first launch:", error);
        router.replace("/welcome");
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, [router]);

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex flex-1 items-center justify-center">
        <Image
          source={require("@/assets/icon.png")}
          className="w-32 h-32 rounded-xl mb-8"
        />
        <H1 className="text-center mb-8">MENA</H1>
        <Text className="text-center">Your personalized hair care assistant</Text>
        <ActivityIndicator size="large" className="mt-8" />
      </View>
    </SafeAreaView>
  );
}