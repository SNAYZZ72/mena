import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInScreen() {
  const { signInWithPassword } = useSupabase();
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
      await signInWithPassword(data.email, data.password);
      form.reset();
    } catch (error: any) {
      Alert.alert(
        "Sign In Failed",
        error.message || "Please check your credentials and try again",
        [{ text: "OK" }]
      );
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeInUp.duration(800)}
        style={styles.content}
      >
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to continue your hair care journey"
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
                    placeholder="Enter your password"
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
            
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </Form>
        
        <View style={styles.buttonContainer}>
          <Button
            style={styles.signInButton}
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </Button>
          
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#AA8AD2",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: "#AA8AD2",
    borderRadius: 12,
    paddingVertical: 14,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    color: "#666666",
    fontSize: 14,
  },
  signUpLink: {
    color: "#AA8AD2",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});