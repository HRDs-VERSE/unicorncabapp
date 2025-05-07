import { router, Stack, useRouter, useSegments } from "expo-router";
import "./global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Image } from "react-native";

const SPLASH_DELAY_MS = 2000; // Adjust this to control splash screen duration

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments();
  const { initialize, token } = useAuthStore();

  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth store on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initialize();
        // setTimeout(() => setIsReady(true), SPLASH_DELAY_MS);
        setIsInitialized(true)
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };
    
    initAuth();
  }, []);
  
  // Handle route redirection after auth initialization
  useEffect(() => {
    const handleRouting = async () => {
      const segmentGroup = segments[0];
      const isInAuthGroup = segmentGroup === "(auth)";
      const isInTabsGroup = segmentGroup === "(tabs)";
      const isAtRoot = (segments.length as Number) === 0;
      if (token && !isInTabsGroup) {
        router.replace("/(tabs)");
      } else if (!token && !isInAuthGroup && !isAtRoot) {
        router.replace("/");
      }
  
      // Optional splash screen duration
    };
    handleRouting();
  },[token, isInitialized])
  

  // if (!isReady) {
  //   return (
  //     <SafeAreaProvider>
  //       <StatusBar style="light" backgroundColor="black" />
  //       <SafeAreaView className="flex-1 bg-black items-center justify-center">
  //         <Image
  //           source={require("../assets/landing/darklogo.png")}
  //           className="w-[120px] h-[120px] mb-4"
  //           resizeMode="contain"
  //         />
  //       </SafeAreaView>
  //     </SafeAreaProvider>
  //   );
  // }

  // useEffect(() => {
  //   router.push("/(tabs)")
  // },[])
  
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="black" />
      <SafeAreaView className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
