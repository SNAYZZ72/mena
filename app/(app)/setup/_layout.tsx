import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SetupProvider } from "@/context/setup-provider";

export default function SetupLayout() {
  return (
    <>
      <StatusBar style="light" />
      <SetupProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#222222' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen name="gender" />
          <Stack.Screen name="hair-type" />
          <Stack.Screen name="hair-concerns" />
          <Stack.Screen name="hair-goals" />
          <Stack.Screen name="routine-preferences" />
          <Stack.Screen name="complete" />
        </Stack>
      </SetupProvider>
    </>
  );
}