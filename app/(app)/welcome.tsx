import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity } from "react-native";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1 bg-background p-4">
      <View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
        <Image
          source={require("@/assets/icon.png")}
          className="w-16 h-16 rounded-xl"
        />
        <H1 className="text-center">Welcome to MENA</H1>
		<Muted className="text-center">
		Your personal assistant for customized hair care.
		</Muted>
      </View>
      <View className="flex flex-col gap-y-4 web:m-4">
        <Button
          size="default"
          variant="default"
          onPress={() => {
            router.push("/sign-up");
          }}
        >
          <Text>Sign Up</Text>
        </Button>
        <Button
          size="default"
          variant="secondary"
          onPress={() => {
            router.push("/sign-in");
          }}
        >
          <Text>Sign In</Text>
        </Button>
        <TouchableOpacity
          className="mt-2 self-center"
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-primary">Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}