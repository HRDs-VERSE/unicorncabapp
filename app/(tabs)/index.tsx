import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import TripCard from '@/components/TripCard';
import SelectCarTypeModal from '@/components/SelectCarTypeModal';
import SelectTripTypeModal from '@/components/SelectTripTypeModal';
import useTripAPI from '@/apiHook/useTripAPI';

type CarType = "sedan" | "suv" | "mpv" | "luxury" | "luxury suv" | "traveller" | "bus" | "urbania";
type TripType = "round" | "one-way";

export default function Index() {
    const { getAllTripsWithFilters } = useTripAPI();

    const [trips, setTrips] = useState<any[]>([]);
    const [carTypeModalVisible, setCarTypeModalVisible] = useState(false);
    const [tripTypeModalVisible, setTripTypeModalVisible] = useState(false);
    const [selectedCarType, setSelectedCarType] = useState<CarType | null>(null);
    const [selectedTripType, setSelectedTripType] = useState<TripType | null>(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchTrips = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        try {
            const response = await getAllTripsWithFilters({
                tripType: selectedTripType || undefined,
                carType: selectedCarType || undefined,
                page: reset ? 1 : page,
        });


            const newTrips = response.trips || [];
            if (reset) {
                setTrips(newTrips);
                setPage(2);
            } else {
                setTrips(prev => [...prev, ...newTrips]);
                setPage(prev => prev + 1);
            }

            setHasMore(newTrips.length === 10); // If less than limit, no more data
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips(true);
    }, [selectedCarType, selectedTripType]);

    return (
        <>
            {/* Modals */}
            <SelectCarTypeModal
                modalVisible={carTypeModalVisible}
                setModalVisible={setCarTypeModalVisible}
                selectCarType={(type) => {
                    setSelectedCarType(type);
                    setCarTypeModalVisible(false);
                }}
            />
            <SelectTripTypeModal
                modalVisible={tripTypeModalVisible}
                setModalVisible={setTripTypeModalVisible}
                selectTripType={(type) => {
                    setSelectedTripType(type);
                    setTripTypeModalVisible(false);
                }}
            />

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
                        placeholder="Search for location.."
                        placeholderTextColor="gray"
                    />
                    <View className='p-3 bg-white rounded-r-[2rem] flex justify-center items-center'>
                        <Ionicons name="search" size={17} color="black" />
                    </View>
                </View>

                {/* Filter Buttons */}
                <View className='flex-row items-center justify-between'>
                    <TouchableOpacity
                        className='bg-white w-[48%] flex items-center justify-center p-2 rounded-[2rem]'
                        onPress={() => setCarTypeModalVisible(true)}
                    >
                        <Text className='font-semibold text-black'>
                            {selectedCarType ? `Car: ${selectedCarType}` : "Select Car Type"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-white w-[48%] flex items-center justify-center p-2 rounded-[2rem]'
                        onPress={() => setTripTypeModalVisible(true)}
                    >
                        <Text className='font-semibold text-black'>
                            {selectedTripType ? `Trip: ${selectedTripType}` : "Select Trip Type"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Trip List */}
            {trips.length !== 0 && !loading &&
                <FlatList
                    contentContainerStyle={{ padding: 8 }}
                    data={trips}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TripCard
                            pickupLocation={item.pickupLocation}
                            dropoffLocation={item.dropoffLocation}
                            pickupDate={item.pickupDate}
                            pickupTime={item.pickupTime}
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
                    onEndReached={() => fetchTrips()}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator size="small" color="gray" /> : null}
                />
            }
        </>
    );
}
