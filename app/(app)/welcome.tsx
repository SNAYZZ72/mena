import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section with Logo and Title */}
      <Animated.View 
        entering={FadeInUp.delay(300).duration(800)}
        style={styles.topSection}
      >
        <Image
          source={require("@/assets/icon.png")}
          style={styles.logo}
        />
        <H1 style={styles.title}>Welcome to MENA</H1>
        <Text style={styles.subtitle}>
          Your personal assistant for customized hair care
        </Text>
      </Animated.View>

      {/* Bottom Section with Buttons */}
      <Animated.View 
        entering={FadeInUp.delay(600).duration(800)}
        style={styles.bottomSection}
      >
        <Button
          style={styles.signUpButton}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </Button>
        
        <Button
          style={styles.signInButton}
          variant="secondary"
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Button>
        
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    maxWidth: "80%",
  },
  bottomSection: {
    width: "100%",
    marginBottom: 24,
  },
  signUpButton: {
    backgroundColor: "#AA8AD2",
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 14,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 14,
  },
  signInButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: "center",
    padding: 8,
  },
  forgotPasswordText: {
    color: "#AA8AD2",
    fontSize: 14,
    fontWeight: "500",
  },
});