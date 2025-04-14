import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as z from "zod";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { AuthHeader } from "@/components/ui/auth-header";
import { useSupabase } from "@/context/supabase-provider";

// Form validation schema
const formSchema = z
  .object({
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
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      
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
    } catch (error: any) {
      Alert.alert(
        "Sign Up Failed",
        error.message || "There was a problem creating your account",
        [{ text: "OK" }]
      );
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInUp.duration(800)}
          style={styles.content}
        >
          <AuthHeader
            title="Create Account"
            subtitle="Sign up to start your hair care journey"
            showBackButton
          />

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
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <View style={styles.passwordContainer}>
                    <FormInput
                      label="Password"
                      placeholder="Create a password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      {...field}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666666" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <View style={styles.passwordContainer}>
                    <FormInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.input}
                      {...field}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#666666" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Form>
          
          <View style={styles.buttonContainer}>
            <Button
              style={styles.signUpButton}
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </Button>
            
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/sign-in")}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "#F6F6F6",
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 46, // Adjust based on your input height and label
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  signUpButton: {
    backgroundColor: "#AA8AD2",
    borderRadius: 12,
    paddingVertical: 14,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signInText: {
    color: "#666666",
    fontSize: 14,
  },
  signInLink: {
    color: "#AA8AD2",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});