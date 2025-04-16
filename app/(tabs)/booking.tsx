import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import TripCard from '@/components/TripCard';

export default function Booking() {
  const [selectedStatus, setSelectedStatus] = useState('Pending'); // Default selected status

  const statuses = ['Pending', 'Ongoing', 'Completed', 'Cancelled'];

  return (
    <>
      <View className="p-4 bg-black shadow-md mb-2 flex gap-[2rem]">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-[1.6rem] font-bold">Unicorn Cab</Text>
        </View>
        <View className="flex gap-3">
          <Text className='text-white text-[1.2rem] font-semibold'>Choose Trip State</Text>
          <View className="flex-row items-center justify-between">
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                className={`border-2 flex items-center justify-center px-2 py-1 rounded-[2rem] ${selectedStatus === status
                    ? 'bg-cyan-100 border-cyan-700' // Selected (Cyan)
                    : 'bg-white border-neutral-300' // Not selected (Gray)
                  }`}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  className={`font-semibold ${selectedStatus === status ? 'text-cyan-700' : 'text-gray-700'
                    }`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <ScrollView
        className='p-2 flex-1 gap-2'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
      >
        <View className='flex-1 gap-2 w-full'>
          <TripCard pickupLocation={'something'} dropoffLocation={'manali'} duration={'4 Days'} fare={24000} commission={1000} carType={"sedan"} carName={'M5 cs'} additional='something something' pickupDate={new Date()} pickupTime={new Date()} />
          <TripCard pickupLocation={'something'} dropoffLocation={'manali'} duration={'4 Days'} fare={24000} commission={1000} carType={"sedan"} carName={'M5 cs'} additional='something something' pickupDate={new Date()} pickupTime={new Date()} />
          <TripCard pickupLocation={'something'} dropoffLocation={'manali'} duration={'4 Days'} fare={24000} commission={1000} carType={"sedan"} carName={'M5 cs'} additional='something something' pickupDate={new Date()} pickupTime={new Date()} />
          <TripCard pickupLocation={'something'} dropoffLocation={'manali'} duration={'4 Days'} fare={24000} commission={1000} carType={"sedan"} carName={'M5 cs'} additional='something something' pickupDate={new Date()} pickupTime={new Date()} />
        </View>
      </ScrollView>
    </>
  );
}
