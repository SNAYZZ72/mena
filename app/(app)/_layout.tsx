import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export const unstable_settings = {
  // Using initialRouteName ensures we always start with the launch screen
  initialRouteName: "launch",
};

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === "dark";
  
  const headerStyle = {
    backgroundColor: isDark ? colors.dark.background : colors.light.background,
  };
  
  const headerTintColor = isDark ? colors.dark.foreground : colors.light.foreground;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack 
        initialRouteName="launch"
        screenOptions={{ 
          headerShown: false, 
          gestureEnabled: false,
          contentStyle: { backgroundColor: isDark ? colors.dark.background : colors.light.background }
        }}
      >
        {/* Protected screens */}
        <Stack.Screen name="(protected)" />
        
        {/* Launch screen - This is the entry point */}
        <Stack.Screen 
          name="launch" 
          options={{ 
            animation: 'none',
            // Prevent gesture navigation
            gestureEnabled: false
          }} 
        />
        
        {/* Onboarding */}
        <Stack.Screen 
          name="onboarding" 
          options={{
            gestureEnabled: false,
            animation: 'fade',
            // Prevent going back to launch screen
            headerBackVisible: false
          }}
        />
        
        {/* Welcome screen */}
        <Stack.Screen 
          name="welcome" 
          options={{
            animation: 'fade',
            // Prevent going back to launch/onboarding
            headerBackVisible: false,
            gestureEnabled: false
          }}
        />
        
        {/* Auth screens */}
        <Stack.Screen
          name="sign-in"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="sign-up"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="forgot-password"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* Setup screens */}
        <Stack.Screen
          name="setup"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Modal",
            headerStyle,
            headerTintColor,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  );
}