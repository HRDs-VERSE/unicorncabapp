import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import TripCard from '@/components/TripCard';

export default function index() {
    const trips = [
        {
            pickupLocation: "Delhi",
            dropoffLocation: "Agra",
            pickupDate: new Date(),
            pickupTime: new Date(),
            duration: "4 hrs",
            fare: 4500,
            commission: 200,
            carType: "sedan" as "sedan",
            carName: "Dzire",
            additional: "Toll included",
        },
        {
            pickupLocation: "Chandigarh",
            dropoffLocation: "Manali",
            pickupDate: new Date(),
            pickupTime: new Date(),
            duration: "9 hrs",
            fare: 12000,
            commission: 400,
            carType: "suv" as "suv",
            carName: "Innova Crysta",
        },
        {
            pickupLocation: "Delhi",
            dropoffLocation: "Shimla",
            pickupDate: new Date(),
            pickupTime: new Date(),
            duration: "8 hrs",
            fare: 10000,
            commission: 300,
            carType: "mpv" as "mpv",
            carName: "Ertiga",
            additional: "Driver meal included",
        }
    ];

    return (
        <>
            {/* Header Section */}
            <View className='p-4 bg-black shadow-md mb-2'>
                <View className='flex-row items-center justify-between mb-4'>
                    <Text className='text-white text-[1.6rem] font-bold'>Unicorn Cab</Text>
                    <View className="bg-cyan-100 border-2 border-cyan-300 rounded-[10px] flex-row px-4 py-1 gap-2 backdrop-blur-md shadow-lg">
                        <Text className="font-bold text-cyan-700">20</Text>
                        <Text className="font-semibold text-cyan-700">Ongoing Trip</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View className='flex-row items-center mb-3'>
                    <TextInput
                        className="flex-1 text-black bg-white rounded-l-[2rem] p-3"
                        placeholder="Search by Fare, Location, Car..."
                        placeholderTextColor="gray"
                    />
                    <View className='p-3 bg-white rounded-r-[2rem] flex justify-center items-center'>
                        <Ionicons name="search" size={17} color="black" />
                    </View>
                </View>
                {/* Filter Buttons */}
                <View className='flex-row items-center justify-between'>
                    <TouchableOpacity className='bg-white w-[48%] flex items-center justify-center p-2 rounded-[2rem]'>
                        <Text className='font-semibold text-black'>Select Car Type</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-white w-[48%] flex items-center justify-center p-2 rounded-[2rem]'>
                        <Text className='font-semibold text-black'>Select Trip Type</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Trip Cards */}
            <ScrollView className="p-2" showsVerticalScrollIndicator={false}>
                <View className='flex gap-4'>
                    {trips.map((trip, index) => (
                        <TripCard
                            key={index}
                            pickupLocation={trip.pickupLocation}
                            dropoffLocation={trip.dropoffLocation}
                            pickupDate={trip.pickupDate}
                            pickupTime={trip.pickupTime}
                            duration={trip.duration}
                            fare={trip.fare}
                            commission={trip.commission}
                            carType={trip.carType}
                            carName={trip.carName}
                            additional={trip.additional}
                        />
                    ))}
                </View>
            </ScrollView>
        </>
    );
}
