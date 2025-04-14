import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide."),
  password: z
    .string()
    .min(8, "Veuillez entrer au moins 8 caractères.")
    .max(64, "Veuillez entrer moins de 64 caractères."),
});

export default function SignIn() {
  const { signInWithPassword } = useSupabase();
  const router = useRouter();

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
    } catch (error: Error | any) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
      <View className="flex-1 gap-4 web:m-4">
        <H1 className="self-start">Connexion</H1>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Votre email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Mot de passe"
                  placeholder="Votre mot de passe"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
          </View>
        </Form>
        
        <TouchableOpacity 
          className="self-end mt-2" 
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-primary">Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      
      <Button
        size="default"
        variant="default"
        onPress={form.handleSubmit(onSubmit)}
        disabled={form.formState.isSubmitting}
        className="web:m-4"
      >
        {form.formState.isSubmitting ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text>Se connecter</Text>
        )}
      </Button>
    </SafeAreaView>
  );
}