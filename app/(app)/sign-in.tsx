import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity, Alert, ImageBackground, StatusBar } from "react-native";
import * as z from "zod";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { AuthHeader } from "@/components/ui/auth-header";
import { Body, Small } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { getUserFriendlyErrorMessage } from "@/utils/error-handler";

// Form validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInScreen() {
  const { signIn } = useSupabase();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signIn(data.email, data.password);
      form.reset();
    } catch (error) {
      Alert.alert(
        "Sign In Failed",
        getUserFriendlyErrorMessage(error),
        [{ text: "OK" }]
      );
      console.error("Sign in error:", error);
    }
  }

  return (
    <ImageBackground
      source={require('@/assets/login-bg.png')} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.4)', 'rgba(34, 34, 34, 0.85)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <Animated.View 
            entering={FadeInUp.duration(800)}
            className="flex-1 px-6 py-4"
          >
            <Animated.View entering={FadeIn.delay(300).duration(800)}>
              <AuthHeader
                title="Welcome Back"
                subtitle="Sign in to continue your hair care journey"
                showBackButton
                lightMode
              />
            </Animated.View>

            <View className="mt-8">
              <Form {...form}>
                <View className="space-y-5">
                  <Animated.View entering={FadeInUp.delay(400).duration(800)}>
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
                            placeholder="Enter your password"
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
                  
                  <Animated.View 
                    entering={FadeInUp.delay(700).duration(800)}
                    className="items-end"
                  >
                    <TouchableOpacity
                      onPress={() => router.push("/forgot-password")}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Small className="text-primary font-medium">Forgot password?</Small>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </Form>
            </View>
            
            <Animated.View 
              entering={FadeInUp.delay(800).duration(800)}
              className="mt-auto mb-6 space-y-4"
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={form.formState.isSubmitting}
                onPress={form.handleSubmit(onSubmit)}
                icon="log-in"
              >
                Sign In
              </Button>
              
              <View className="flex-row justify-center items-center">
                <Body color="#fff">Don't have an account?</Body>
                <TouchableOpacity 
                  onPress={() => router.push("/sign-up")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Body className="text-primary font-bold ml-1">Sign Up</Body>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}