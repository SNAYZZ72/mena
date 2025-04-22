import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { TextProps } from '@/types/ui';

const textVariants = cva('text-foreground font-normal', {
	variants: {
		variant: {
			h1: 'text-4xl font-bold',
			h2: 'text-3xl font-bold',
			h3: 'text-2xl font-semibold',
			h4: 'text-xl font-semibold',
			h5: 'text-lg font-medium',
			body: 'text-base',
			label: 'text-sm font-medium',
			small: 'text-sm',
			caption: 'text-xs',
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold', 
			bold: 'font-bold',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
	},
	defaultVariants: {
		variant: 'body',
		weight: 'normal',
		align: 'left',
	},
});

export const H1: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="h1" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const H2: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="h2" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const H3: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="h3" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const H4: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="h4" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const H5: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="h5" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const Body: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="body" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const Label: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight = 'medium',
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="label" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const Small: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="small" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

export const Caption: React.FC<Omit<TextProps, 'variant'> & { style?: any }> = ({ 
	children, 
	color,
	weight,
	align,
	className,
	style,
	...props 
}) => (
	<Text 
		variant="caption" 
		color={color} 
		weight={weight} 
		align={align} 
		className={className}
		style={style}
		{...props}
	>
		{children}
	</Text>
);

const Text: React.FC<TextProps & React.ComponentPropsWithoutRef<typeof RNText>> = ({ 
	variant = 'body',
	color,
	weight,
	align,
	className,
	children,
	...props
}) => {
	const textStyles = textVariants({ 
		variant, 
		weight, 
		align, 
		className 
	});
	
	const customStyles: TextStyle = {};
	
	if (color) {
		customStyles.color = color;
	}
	
	return (
		<RNText 
			className={cn(textStyles)}
			style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
			{...props}
		>
			{children}
		</RNText>
	);
};

export default Text;
