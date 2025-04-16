import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there!', fromMe: false },
    { id: 2, text: 'Hi! How can I help you?', fromMe: true },
  ])

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), text: message, fromMe: true }])
    setMessage('')
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-black">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-white font-bold text-lg">{id}</Text>
          <Text className="text-white text-xs">Online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-2 max-w-[80%] rounded-lg px-4 py-2 ${
              msg.fromMe
                ? 'self-end bg-black'
                : 'self-start bg-gray-200'
            }`}
          >
            <Text className={`${msg.fromMe ? 'text-white' : 'text-black'}`}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 mr-2 border-gray-300"
        />
        <TouchableOpacity onPress={sendMessage} className="bg-black p-2 rounded-full">
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}