import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const chatList = [
  {
    id: '1',
    name: 'Jitender Singh',
    lastMessage: 'Your cab is arriving soon.',
    time: '2:45 PM',
  },
  {
    id: '2',
    name: 'Rohit Sharma',
    lastMessage: 'Thanks for the ride!',
    time: '1:15 PM',
  },
  {
    id: '3',
    name: 'Anjali',
    lastMessage: 'Can you pick me up from Sector 21?',
    time: '12:00 PM',
  },
]

export default function Chat() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Chat List */}
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {chatList.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            className="flex-row items-center gap-4 py-4 border-b border-gray-100"
            onPress={() => router.push(`../chat/${chat.id}`)} // Navigate to chat screen with chat ID
          >
            <View className="bg-black w-[3.5rem] h-[3.5rem] rounded-full" />
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-[1.1rem]">{chat.name}</Text>
                <Text className="text-gray-400 text-xs">{chat.time}</Text>
              </View>
              <Text className="text-gray-600" numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
