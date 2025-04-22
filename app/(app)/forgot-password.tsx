import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, Alert, ImageBackground, StatusBar } from "react-native";
import * as z from "zod";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { AuthHeader } from "@/components/ui/auth-header";
import { Body } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";

// Form validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "expo-supabase-starter://reset-password",
      });

      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while processing your request",
        [{ text: "OK" }]
      );
      console.log(error.message);
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
                title="Reset Password"
                subtitle="Get a link to create a new password"
                showBackButton
                lightMode
              />
            </Animated.View>

            {isSubmitted ? (
              <View className="flex-1 justify-center px-4">
                <Animated.View entering={FadeInUp.delay(400).duration(800)}>
                  <View className="bg-black/20 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                    <View className="items-center mb-4">
                      <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-4">
                        <Feather name="mail" size={32} color="#AA8AD2" />
                      </View>
                      <Text className="text-white text-2xl font-bold mb-2">Check Your Email</Text>
                    </View>
                    <Text className="text-gray-300 text-base leading-6 text-center mb-8">
                      We've sent password reset instructions to your email. Please check your inbox.
                    </Text>
                    
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onPress={() => router.push("/sign-in")}
                      icon="arrow-left"
                    >
                      Back to Sign In
                    </Button>
                  </View>
                </Animated.View>
              </View>
            ) : (
              <>
                <Animated.View entering={FadeInUp.delay(400).duration(800)}>
                  <Text className="text-gray-300 text-base leading-6 mt-6 mb-8">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </Text>
                </Animated.View>

                <Form {...form}>
                  <Animated.View entering={FadeInUp.delay(500).duration(800)} className="mb-8">
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
                </Form>
                
                <Animated.View 
                  entering={FadeInUp.delay(600).duration(800)}
                  className="mt-auto mb-6 space-y-4"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={form.formState.isSubmitting}
                    onPress={form.handleSubmit(onSubmit)}
                    icon="send"
                  >
                    Send Reset Link
                  </Button>
                  
                  <View className="flex-row justify-center items-center">
                    <Body color="#fff">Remember your password?</Body>
                    <Button
                      variant="link"
                      onPress={() => router.push("/sign-in")}
                    >
                      <Text className="text-primary font-bold ml-1">Sign In</Text>
                    </Button>
                  </View>
                </Animated.View>
              </>
            )}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}