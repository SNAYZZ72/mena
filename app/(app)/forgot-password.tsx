import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, Alert } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide."),
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
      Alert.alert("Erreur", error.message || "Une erreur s'est produite");
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
      <View className="flex-1 gap-4 web:m-4">
        <H1 className="self-start">Forgot Password</H1>
        
        {isSubmitted ? (
          <>
            <Muted className="mb-4">
              An email has been sent to the provided address with instructions to reset your password.
            </Muted>
            <Button
              variant="default"
              onPress={() => router.back()}
            >
              <Text>Back to Login</Text>
            </Button>
          </>
        ) : (
          <>
            <Muted className="mb-4">
              Please enter the email address associated with your account to receive a reset link.
            </Muted>

            <Form {...form}>
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormInput
                      label="Email"
                      placeholder="Votre adresse email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      {...field}
                    />
                  )}
                />
              </View>
            </Form>
            
            <View className="flex-row justify-between mt-4">
              <Button
                variant="ghost"
                onPress={() => router.back()}
              >
                <Text>Back</Text>
              </Button>
              
              <Button
                variant="default"
                onPress={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text>Reset</Text>
                )}
              </Button>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}