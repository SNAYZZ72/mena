import { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments, SplashScreen } from "expo-router";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	isNewUser: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	onLayoutRootView: () => Promise<void>;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	isNewUser: false,
	signUp: async () => { },
	signInWithPassword: async () => { },
	signOut: async () => { },
	onLayoutRootView: async () => { },
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [appIsReady, setAppIsReady] = useState<boolean>(false);
	const [isNewUser, setIsNewUser] = useState<boolean>(false);

	const signUp = async (email: string, password: string) => {
		const { error, data } = await supabase.auth.signUp({
			email,
			password,
		});
		
		if (error) {
			throw error;
		}
		
		// Mark as a new user if sign up is successful
		if (data?.user) {
			setIsNewUser(true);
		}
	};

	const signInWithPassword = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	};

	useEffect(() => {
		async function prepare() {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				setSession(session);
				setUser(session ? session.user : null);
				
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
				
				setInitialized(true);

				const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
					setSession(session);
					setUser(session ? session.user : null);
					
					// Check for a profile when auth state changes
					if (session?.user) {
						const { data, error } = await supabase
							.from('hair_profiles')
							.select('*')
							.eq('user_id', session.user.id)
							.single();
							
						// If no profile exists, mark as new user
						setIsNewUser(!data && !error);
					} else {
						setIsNewUser(false);
					}
				});

				await new Promise(resolve => setTimeout(resolve, 100));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	useEffect(() => {
		if (!initialized || !appIsReady) return;
	  
		const inProtectedGroup = segments[1] === "(protected)";
		const inSetupGroup = segments[0] === "(app)" && segments[1] === "setup";
		
		// If on launch or onboarding screen, don't redirect automatically
		if (segments[0] === "(app)" && (segments[1] === "launch" || segments[1] === "onboarding")) {
		  return;
		}
	  
		// Handle routing based on auth state and new user status
		if (session) {
			// If authenticated but is a new user, send to setup
			if (isNewUser && !inSetupGroup) {
				router.replace("/(app)/setup" as any);
			} 
			// If authenticated, has a profile, and not in protected area, go to protected
			else if (!isNewUser && !inProtectedGroup && !inSetupGroup) {
				router.replace({ pathname: "/(app)/(protected)" });
			}
		} else if (!session && (inProtectedGroup || inSetupGroup)) {
			// If not authenticated but trying to access protected or setup areas
			router.replace({ pathname: "/(app)/launch" });
		}
	}, [initialized, appIsReady, session, segments, isNewUser]);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!initialized || !appIsReady) {
		return null;
	}

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				isNewUser,
				signUp,
				signInWithPassword,
				signOut,
				onLayoutRootView,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};