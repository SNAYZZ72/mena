import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import * as z from "zod";
import Animated, { FadeIn } from "react-native-reanimated";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { AuthHeader } from "@/components/ui/auth-header";
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
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(800)}
        style={styles.content}
      >
        <AuthHeader
          title="Reset Password"
          showBackButton
        />

        {isSubmitted ? (
          <View style={styles.successContainer}>
            <Animated.View entering={FadeIn.delay(300).duration(800)}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent password reset instructions to your email. Please check your inbox.
              </Text>
              
              <Button
                style={[styles.button, styles.backButton]}
                onPress={() => router.push("/sign-in")}
              >
                <Text style={styles.backButtonText}>Back to Sign In</Text>
              </Button>
            </Animated.View>
          </View>
        ) : (
          <>
            <Text style={styles.instructions}>
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </Text>

            <Form {...form}>
              <View style={styles.formContainer}>
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
                      style={styles.input}
                      {...field}
                    />
                  )}
                />
              </View>
            </Form>
            
            <View style={styles.buttonContainer}>
              <Button
                style={[styles.button, styles.resetButton]}
                onPress={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </Button>
            </View>
          </>
        )}
      </Animated.View>
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
    padding: 24,
  },
  instructions: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#F6F6F6",
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  resetButton: {
    backgroundColor: "#AA8AD2",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#AA8AD2",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});