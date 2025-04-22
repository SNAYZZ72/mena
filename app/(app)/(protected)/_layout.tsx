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
				tabBarShowLabel: true,
				tabBarStyle: {
					position: 'absolute',
					bottom: 16,
					left: 16,
					right: 16,
					elevation: 5,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					backgroundColor: isDark ? colors.dark.background : colors.light.background,
					borderRadius: 30,
					height: 60,
					borderTopWidth: 0,
					paddingHorizontal: 20,
				},
				tabBarItemStyle: {
					borderRadius: 20,
					marginVertical: 8,
				},
				tabBarActiveTintColor: '#AA8AD2',
				tabBarInactiveTintColor: isDark ? '#666666' : '#999999',
				tabBarActiveBackgroundColor: 'rgba(170,138,210,0.1)',
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