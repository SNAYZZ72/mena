import * as React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { Feather } from '@expo/vector-icons';

import { cn } from "@/lib/utils";
import { IconName } from "@/types/ui";

interface InputProps extends TextInputProps {
	icon?: IconName;
	error?: string;
	label?: string;
	fullWidth?: boolean;
	className?: string;
	darkMode?: boolean;
}

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	InputProps
>(({ className, icon, error, label, fullWidth, darkMode = false, ...props }, ref) => {
	const textColor = darkMode ? "#FFFFFF" : "#000000";
	const labelColor = darkMode ? "text-gray-300" : "text-foreground";
	const borderColor = darkMode ? "border-gray-600" : "border-input";
	const iconColor = darkMode ? "#FFFFFF" : "#888888";
	const bgColor = darkMode ? "bg-transparent" : "bg-background";
	
	return (
		<View className={cn("flex flex-col", fullWidth && "w-full")}>
			{label && (
				<Text className={cn("text-sm font-medium mb-1", labelColor)}>
					{label}
				</Text>
			)}
			<View className="relative flex-row items-center">
				{icon && (
					<View className="absolute left-3 z-10">
						<Feather name={icon} size={18} color={iconColor} />
					</View>
				)}
				<TextInput
					ref={ref}
					className={cn(
						`web:flex h-10 native:h-12 rounded-md border ${borderColor} ${bgColor} px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2`,
						props.editable === false && "opacity-50 web:cursor-not-allowed",
						icon && "pl-10",
						error && "border-destructive",
						fullWidth && "w-full",
						className,
					)}
					style={{ color: textColor }}
					placeholderTextColor={darkMode ? "#999999" : "#888888"}
					{...props}
				/>
			</View>
			{error && (
				<Text className="text-xs text-destructive mt-1">
					{error}
				</Text>
			)}
		</View>
	);
});

Input.displayName = "Input";

export { Input };
