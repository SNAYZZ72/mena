import { cva } from "class-variance-authority";
import * as React from "react";
import { Pressable, ActivityIndicator, Text } from "react-native";
import { Feather } from '@expo/vector-icons';

import { TextClassContext } from "./text";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types/ui";

const buttonVariants = cva(
	"group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				primary: "bg-primary web:hover:opacity-90 active:opacity-90",
				destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
				outline:
					"border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
				ghost:
					"web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				link: "web:underline-offset-4 web:hover:underline web:focus:underline",
			},
			size: {
				md: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8 native:h-14",
				icon: "h-10 w-10",
			},
			fullWidth: {
				true: "w-full",
			}
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

const buttonTextVariants = cva(
	"web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
	{
		variants: {
			variant: {
				primary: "text-primary-foreground",
				destructive: "text-destructive-foreground",
				outline: "group-active:text-accent-foreground",
				secondary:
					"text-secondary-foreground group-active:text-secondary-foreground",
				ghost: "group-active:text-accent-foreground",
				link: "text-primary group-active:underline",
			},
			size: {
				md: "",
				sm: "",
				lg: "native:text-lg",
				icon: "",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	ButtonProps
>(({ 
	className, 
	variant = 'primary', 
	size = 'md',
	icon,
	iconPosition = 'left',
	fullWidth,
	isLoading,
	disabled,
	children,
	...props 
}, ref) => {
	const isDisabled = disabled || isLoading;
	const textStyle = buttonTextVariants({
		variant,
		size,
		className: "web:pointer-events-none",
	});
	
	// Helper to render text content properly
	const renderContent = () => {
		// If already wrapped in a component, return as is
		if (React.isValidElement(children)) {
			return children;
		}
		
		// If it's a string, wrap in Text component
		if (typeof children === 'string') {
			return (
				<Text className={textStyle}>
					{children}
				</Text>
			);
		}
		
		// Otherwise, return as is
		return children;
	};
	
	return (
		<TextClassContext.Provider value={textStyle}>
			<Pressable
				className={cn(
					isDisabled && "opacity-50 web:pointer-events-none",
					buttonVariants({ variant, size, fullWidth, className }),
				)}
				ref={ref}
				disabled={isDisabled}
				{...props}
			>
				{isLoading ? (
					<ActivityIndicator 
						size="small" 
						color={variant === 'outline' || variant === 'ghost' || variant === 'link' ? '#AA8AD2' : '#FFFFFF'} 
					/>
				) : (
					<>
						{icon && iconPosition === 'left' && (
							<Feather 
								name={icon} 
								size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
								color={
									variant === 'outline' || variant === 'ghost' || variant === 'link' 
										? '#AA8AD2' 
										: '#FFFFFF'
								} 
								style={{ marginRight: 8 }}
							/>
						)}
						{renderContent()}
						{icon && iconPosition === 'right' && (
							<Feather 
								name={icon} 
								size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
								color={
									variant === 'outline' || variant === 'ghost' || variant === 'link' 
										? '#AA8AD2' 
										: '#FFFFFF'
								} 
								style={{ marginLeft: 8 }}
							/>
						)}
					</>
				)}
			</Pressable>
		</TextClassContext.Provider>
	);
});

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
