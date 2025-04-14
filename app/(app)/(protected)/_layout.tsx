import { Tabs } from "expo-router";
import React from "react";
import { Feather } from '@expo/vector-icons';

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: isDark ? colors.dark.background : colors.light.background,
					borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
					height: 60,
					paddingBottom: 10,
					paddingTop: 5,
				},
				tabBarActiveTintColor: '#AA8AD2', // MENA purple color
				tabBarInactiveTintColor: isDark ? '#666666' : '#999999',
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
			}}
		>
			<Tabs.Screen 
				name="index" 
				options={{ 
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Feather name="home" size={size} color={color} />
					),
				}} 
			/>
			
			<Tabs.Screen 
				name="routine" 
				options={{ 
					title: "Routine",
					tabBarIcon: ({ color, size }) => (
						<Feather name="calendar" size={size} color={color} />
					),
				}} 
			/>
			
			<Tabs.Screen 
				name="community" 
				options={{ 
					title: "Community",
					tabBarIcon: ({ color, size }) => (
						<Feather name="users" size={size} color={color} />
					),
				}} 
			/>
			
			<Tabs.Screen 
				name="profile" 
				options={{ 
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Feather name="user" size={size} color={color} />
					),
				}} 
			/>
		</Tabs>
	);
}