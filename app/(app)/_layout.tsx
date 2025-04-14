import { Stack } from "expo-router";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export const unstable_settings = {
  initialRouteName: "launch",
};

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  
  const headerStyle = {
    backgroundColor:
      colorScheme === "dark"
        ? colors.dark.background
        : colors.light.background,
  };
  
  const headerTintColor =
    colorScheme === "dark"
      ? colors.dark.foreground
      : colors.light.foreground;

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, 
        gestureEnabled: false 
      }}
      initialRouteName="launch"
    >
      <Stack.Screen name="(protected)" />
      
      <Stack.Screen name="launch" />
      
      <Stack.Screen 
        name="onboarding" 
        options={{
          gestureEnabled: false,
        }}
      />
      
      <Stack.Screen name="welcome" />
      
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Inscription",
          headerStyle,
          headerTintColor,
          gestureEnabled: true,
        }}
      />
      
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Connexion",
          headerStyle,
          headerTintColor,
          gestureEnabled: true,
        }}
      />
      
      <Stack.Screen
        name="forgot-password"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Mot de passe oublié",
          headerStyle,
          headerTintColor,
          gestureEnabled: true,
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
  );
}