import { Link, router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-between pb-[1rem] bg-white gap-[2rem]">
      <Image
        source={require("../assets/landing/landing.png")}
        className="w-full h-[35rem]"
      />
      <View className="w-full flex items-center gap-[2rem] px-[1.8rem]">
        <View className="w-full flex items-start">
          <Text className="text-black font-extrabold text-[1.4rem]">Explore new ways to earn</Text>
          <Text className="text-black font-extrabold text-[1.4rem]">with Unicorn Cab</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("./(auth)/auth")} className="bg-black py-4 w-full rounded-md flex items-center">
          <Text className="text-white">Continue with Phone Number</Text>
        </TouchableOpacity>
        <Text className="text-[.8rem] text-gray-400">By continuing, you agree that you have read and accept our T&Cs and Privacy Policy</Text>
      </View>
    </View>
  );
}
