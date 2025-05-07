import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import TripCard from '@/components/TripCard';
import useTripAPI from '@/apiHook/useTripAPI';
import { useAuthStore } from '@/store/authStore';

export default function Booking() {
  const { getAllTripsWithFilters } = useTripAPI();
  const { user } = useAuthStore();

  const statuses = ['Pending', 'Ongoing', 'Completed', 'Cancelled'];
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [trips, setTrips] = useState();
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    if (!user?._id) return;
    setLoading(true);
    const response = await getAllTripsWithFilters({
      vendorId: user._id,
      tripStatus: selectedStatus.toLocaleLowerCase(),
    });
    

    if (response?.success) {
      setTrips(response.trips);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchTrips();
  }, [selectedStatus]);

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
                  ? 'bg-cyan-100 border-cyan-700'
                  : 'bg-white border-neutral-300'
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

      {loading ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 4 }}
          renderItem={({ item }) => (
            <TripCard
              pickupLocation={item.pickupLocation}
              dropoffLocation={item.dropoffLocation}
              pickupDate={new Date(item.pickupDate)}
              pickupTime={new Date(item.pickupTime)}
              duration={item.duration}
              fare={item.fare}
              status={item.status}
              tripType={item.tripType}
              commission={item.commission}
              carType={item.carType}
              carName={item.carName}
              additional={item.additional}
            />
          )}
          ListEmptyComponent={
            <Text className="text-center mt-10 text-gray-500">No trips found.</Text>
          }
        />
      )}
    </>
  );
}
