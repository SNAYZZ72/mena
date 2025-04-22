import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity, Alert, ScrollView, ImageBackground, StatusBar } from "react-native";
import * as z from "zod";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { AuthHeader } from "@/components/ui/auth-header";
import { Body } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { getUserFriendlyErrorMessage } from "@/utils/error-handler";

// Form validation schema
const formSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be less than 64 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpScreen() {
  const { signUp } = useSupabase();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password, data.username);
      
      Alert.alert(
        "Verification Email Sent",
        "Please check your email to verify your account",
        [
          {
            text: "OK",
            onPress: () => {
              form.reset();
              router.push("/sign-in");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Sign Up Failed",
        getUserFriendlyErrorMessage(error),
        [{ text: "OK" }]
      );
      console.error("Sign up error:", error);
    }
  }

  return (
    <ImageBackground
      source={require('@/assets/signup-bg.png')} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.4)', 'rgba(34, 34, 34, 0.9)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Animated.View 
              entering={FadeInUp.duration(800)}
              className="flex-1 px-6 py-4"
            >
              <Animated.View entering={FadeIn.delay(300).duration(800)}>
                <AuthHeader
                  title="Create Account"
                  subtitle="Sign up to start your hair care journey"
                  showBackButton
                  lightMode
                />
              </Animated.View>

              <View className="mt-6">
                <Form {...form}>
                  <View className="space-y-4">
                    <Animated.View entering={FadeInUp.delay(400).duration(800)}>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormInput
                            label="Username"
                            placeholder="Enter your username"
                            autoCapitalize="none"
                            autoCorrect={false}
                            icon="user"
                            fullWidth
                            darkMode
                            {...field}
                          />
                        )}
                      />
                    </Animated.View>
                    
                    <Animated.View entering={FadeInUp.delay(500).duration(800)}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormInput
                            label="Email"
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            icon="mail"
                            fullWidth
                            darkMode
                            {...field}
                          />
                        )}
                      />
                    </Animated.View>
                    
                    <Animated.View entering={FadeInUp.delay(600).duration(800)}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <View className="relative">
                            <FormInput
                              label="Password"
                              placeholder="Create a password"
                              autoCapitalize="none"
                              autoCorrect={false}
                              secureTextEntry={!showPassword}
                              icon="lock"
                              fullWidth
                              darkMode
                              {...field}
                            />
                            <TouchableOpacity 
                              className="absolute right-3 top-11"
                              onPress={() => setShowPassword(!showPassword)}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </Animated.View>
                    
                    <Animated.View entering={FadeInUp.delay(700).duration(800)}>
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <View className="relative">
                            <FormInput
                              label="Confirm Password"
                              placeholder="Confirm your password"
                              autoCapitalize="none"
                              autoCorrect={false}
                              secureTextEntry={!showConfirmPassword}
                              icon="lock"
                              fullWidth
                              darkMode
                              {...field}
                            />
                            <TouchableOpacity 
                              className="absolute right-3 top-11"
                              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </Animated.View>
                  </View>
                </Form>
              </View>
              
              <Animated.View 
                entering={FadeInUp.delay(800).duration(800)}
                className="mt-8 mb-4 space-y-4"
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={form.formState.isSubmitting}
                  onPress={form.handleSubmit(onSubmit)}
                  icon="user-plus"
                >
                  Create Account
                </Button>
                
                <View className="flex-row justify-center items-center">
                  <Body color="#fff">Already have an account?</Body>
                  <TouchableOpacity 
                    onPress={() => router.push("/sign-in")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Body className="text-primary font-bold ml-1">Sign In</Body>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}