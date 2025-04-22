import { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments, SplashScreen } from "expo-router";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { supabase } from "@/config/supabase";
import { AuthContextType, AuthProviderProps, AuthState } from "@/types/auth";

SplashScreen.preventAutoHideAsync();

// Extended AuthContextType with additional app-specific properties
interface SupabaseContextProps extends AuthContextType {
	isNewUser: boolean;
	onLayoutRootView: () => Promise<void>;
}

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	isLoading: false,
	isAuthenticated: false,
	isNewUser: false,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
	resetPassword: async () => {},
	updatePassword: async () => {},
	onLayoutRootView: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: AuthProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		session: null,
		isLoading: true
	});
	const [isNewUser, setIsNewUser] = useState<boolean>(false);
	const [appIsReady, setAppIsReady] = useState<boolean>(false);

	const signUp = async (email: string, password: string, username: string): Promise<void> => {
		try {
			setAuthState(prev => ({ ...prev, isLoading: true }));
			
			const { error, data } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username
					}
				}
			});
			
			if (error) {
				throw error;
			}
			
			// Mark as a new user if sign up is successful
			if (data?.user) {
				setIsNewUser(true);
			}
		} catch (error) {
			console.error('Sign up error:', error);
			throw error;
		} finally {
			setAuthState(prev => ({ ...prev, isLoading: false }));
		}
	};

	const signIn = async (email: string, password: string): Promise<void> => {
		try {
			setAuthState(prev => ({ ...prev, isLoading: true }));
			
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			
			if (error) {
				throw error;
			}
		} catch (error) {
			console.error('Sign in error:', error);
			throw error;
		} finally {
			setAuthState(prev => ({ ...prev, isLoading: false }));
		}
	};

	const signOut = async (): Promise<void> => {
		try {
			setAuthState(prev => ({ ...prev, isLoading: true }));
			
			const { error } = await supabase.auth.signOut();
			
			if (error) {
				throw error;
			}
		} catch (error) {
			console.error('Sign out error:', error);
			throw error;
		} finally {
			setAuthState(prev => ({ ...prev, isLoading: false }));
		}
	};
	
	const resetPassword = async (email: string): Promise<void> => {
		try {
			setAuthState(prev => ({ ...prev, isLoading: true }));
			
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});
			
			if (error) {
				throw error;
			}
		} catch (error) {
			console.error('Reset password error:', error);
			throw error;
		} finally {
			setAuthState(prev => ({ ...prev, isLoading: false }));
		}
	};
	
	const updatePassword = async (password: string): Promise<void> => {
		try {
			setAuthState(prev => ({ ...prev, isLoading: true }));
			
			const { error } = await supabase.auth.updateUser({
				password,
			});
			
			if (error) {
				throw error;
			}
		} catch (error) {
			console.error('Update password error:', error);
			throw error;
		} finally {
			setAuthState(prev => ({ ...prev, isLoading: false }));
		}
	};

	useEffect(() => {
		async function prepare() {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				setAuthState({
					session,
					user: session?.user || null,
					isLoading: false
				});
				
				// Check if this is a new user by looking for a profile
				if (session?.user) {
					const { data, error } = await supabase
						.from('hair_profiles')
						.select('*')
						.eq('user_id', session.user.id)
						.maybeSingle();
						
					// If no profile exists, mark as new user
					setIsNewUser(!data);
				}

				const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
					setAuthState({
						session,
						user: session?.user || null,
						isLoading: false
					});
					
					// Check for a profile when auth state changes
					if (session?.user) {
						const { data, error } = await supabase
							.from('hair_profiles')
							.select('*')
							.eq('user_id', session.user.id)
							.maybeSingle();
							
						// If no profile exists, mark as new user
						setIsNewUser(!data);
					} else {
						setIsNewUser(false);
					}
				});

				// Small delay to ensure everything is loaded
				await new Promise(resolve => setTimeout(resolve, 100));
				
				return () => {
					subscription.unsubscribe();
				};
			} catch (e) {
				console.error('Auth initialization error:', e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	useEffect(() => {
		if (authState.isLoading || !appIsReady) return;
	  
		const inProtectedGroup = segments[1] === "(protected)";
		const inSetupGroup = segments[0] === "(app)" && segments[1] === "setup";
		
		// If on launch or onboarding screen, don't redirect automatically
		if (segments[0] === "(app)" && (segments[1] === "launch" || segments[1] === "onboarding")) {
			return;
		}
	  
		// Handle routing based on auth state and new user status
		if (authState.session) {
			// If authenticated but is a new user and not already in setup or protected, send to setup
			if (isNewUser && !inSetupGroup && !inProtectedGroup) {
				router.replace("/(app)/setup");
			} 
			// If authenticated, has a profile, and not in protected area, go to protected
			else if (!isNewUser && !inProtectedGroup && !inSetupGroup) {
				router.replace("/(app)/(protected)");
			}
		} else if (!authState.session && (inProtectedGroup || inSetupGroup)) {
			// If not authenticated but trying to access protected or setup areas
			router.replace("/(app)/launch");
		}
	}, [authState.isLoading, appIsReady, authState.session, segments, isNewUser, router]);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	// Don't render until we're ready
	if (authState.isLoading || !appIsReady) {
		return null;
	}

	const isAuthenticated = Boolean(authState.session);

	return (
		<SupabaseContext.Provider
			value={{
				...authState,
				isAuthenticated,
				isNewUser,
				signUp,
				signIn,
				signOut,
				resetPassword,
				updatePassword,
				onLayoutRootView,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};