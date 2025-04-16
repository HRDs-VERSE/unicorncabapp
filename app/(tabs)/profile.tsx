import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
// import * as Clipboard from 'expo-clipboard';

export const StarRating = ({ rating = 5 }) => {
  const maxStars = 5;

  return (
    <View className="flex-row items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const isActive = i < Math.floor(rating);
        return (
          <Ionicons
            key={i}
            name="star"
            size={12}
            color={isActive ? "#f4b400" : "#d1d5db"} // gray-300 for inactive
          />
        );
      })}
      <Text className="font-extrabold text-[0.9rem] text-black">{rating.toFixed(1)}</Text>
    </View>
  );
};

const MenuItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View className="p-3 flex-row justify-between items-center">
    <View className="flex-row items-center gap-2">
      {icon}
      <Text className="font-bold">{text}</Text>
    </View>
    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
  </View>
);

const ReviewCard = ({ name, review }: { name: string; review: string }) => (
  <View className="bg-white shadow-md p-4 rounded-[10px] mb-2">
    <View className="flex-row items-center gap-4">
      <View className="bg-black rounded-full w-[3rem] h-[3rem]" />
      <View className="flex gap-1">
        <Text className="font-medium">{name}</Text>
        <StarRating rating={4.9} />
        <Text className="text-xs text-gray-500">2 days ago</Text>
      </View>
    </View>
    <View className="py-3">
      <Text className="font-medium text-gray-700">
        {review}
      </Text>
    </View>
  </View>
);

export default function Profile() {
  // const handleCopy = async () => {
  //   await Clipboard.setStringAsync('JIT12345');
  //   Alert.alert('Copied', 'Cab ID copied to clipboard!');
  // };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-4 bg-white min-h-screen flex gap-4">
        {/* Profile Header */}
        <View className="flex gap-4">
          <View className="flex-row items-center gap-4">
            <View className="bg-black rounded-full w-[6rem] h-[6rem]" />
            <View className="flex gap-1">
              <Text className="font-bold text-[1.4rem]">Jitender Singh</Text>   
              <TouchableOpacity >
                <View className="flex-row items-center gap-1">
                  <Feather name="copy" size={14} />
                  <Text className="text-[1rem] text-blue-600 font-semibold">Copy ID</Text>
                </View>
              </TouchableOpacity>
              <StarRating rating={4.9} />
            </View>
          </View>

          <TouchableOpacity className="bg-black py-3 w-full rounded-full flex items-center">
            <Text className="text-white text-[1.2rem]">Get Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View className="bg-white shadow-md p-2 rounded-[10px]">
          <MenuItem icon={<Feather name="user" size={18} />} text="Your Information" />
          <MenuItem icon={<Feather name="truck" size={18} />} text="Manage Vehicles" />
          <MenuItem icon={<Feather name="credit-card" size={18} />} text="Transaction" />
        </View>

        {/* Reviews */}
        <Text className="font-bold text-[1.2rem] mt-4">Reviews</Text>
        <ReviewCard
          name="Jitender Singh"
          review="I had a wonderful experience with Unicorn Cab. I booked a car from Delhi to Spiti, and the driver was very punctual. He had great knowledge of navigation, and the car quality was excellent. Thanks, Unicorn Cab!"
        />
        <ReviewCard
          name="Jitender Singh"
          review="Amazing trip again! The vehicle was clean, the driver was courteous, and the overall journey was smooth. Highly recommended."
        />
      </View>
    </ScrollView>
  );
}
