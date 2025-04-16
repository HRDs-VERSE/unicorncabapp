import { router, Stack } from "expo-router";
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";


export default function RootLayout() {

  useEffect(() => {
    router.replace("/(tabs)/profile")
  },[])
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <StatusBar style={"light"} backgroundColor="black" hidden={false} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
