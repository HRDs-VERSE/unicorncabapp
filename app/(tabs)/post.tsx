import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import Slider from "@react-native-community/slider";
import useTripAPI from '@/apiHook/useTripAPI';
import { useAuthStore } from '@/store/authStore';
import { Dropdown } from 'react-native-element-dropdown';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import useGooglePlacesAPI from '@/apiHook/useGoogleAPI';
import { v4 as uuidv4 } from 'uuid';
import { useDebounce } from 'use-debounce';

export default function CreateBooking() {
  const { createTrip } = useTripAPI()
  const { fetchDistance, fetchSuggestions } = useGooglePlacesAPI()
  const { user } = useAuthStore()
  const sessionToken = uuidv4();

  const [booking, setBooking] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    duration: 0,
    durationUnit: "hours",
    fare: 0,
    commission: "",
    carType: "sedan" as keyof typeof segmentCar,
    tripType: "one-way",
    carName: "",
    additional: "",
    pickupDate: new Date(),
    pickupTime: new Date(),
  });

  const [fromSuggestions, setFromSuggestions] = useState<any>([]);
  const [toSuggestions, setToSuggestions] = useState<any>([]);

  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [distanceResult, setDistanceResult] = useState<string | null>(null);

  const [debouncedPickup] = useDebounce(booking.pickupLocation, 300);
  const [debouncedDropoff] = useDebounce(booking.dropoffLocation, 300);
  const [carModalVisible, setCarModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  // const [carNameModalVisible, setCarNameModalVisible] = useState(false);
  const [error, setError] = useState('');

  const MIN_PRICE = 249;
  const MAX_PRICE = 9000;

  const handleChange = (field: string, value: string | number) => {
    setBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (text: string | any) => {
    if (text.length <= 300) {
      handleChange('additional', text);
      setError('');
    } else {
      setError(`Cannot exceed ${300} characters`);
    }
  };

  // useEffect(() => {
  //   if (booking.carType && segmentCar[booking.carType as keyof typeof segmentCar]) {
  //     // Automatically update carName to the first car in the selected segment
  //     setBooking((prevBooking) => ({
  //       ...prevBooking,
  //       carName: segmentCar[booking.carType as keyof typeof segmentCar][0],
  //     }));
  //   }
  // }, [booking.carType]); 

  useEffect(() => {
    const fetchPickupSuggestions = async () => {
      if (!debouncedPickup || fromPlace) return;
      const suggestions = await fetchSuggestions(debouncedPickup, sessionToken);
      setFromSuggestions(suggestions);
    };
    fetchPickupSuggestions();
  }, [debouncedPickup]);

  useEffect(() => {
    const fetchDropoffSuggestions = async () => {
      if (!debouncedDropoff || toPlace) return;
      const suggestions = await fetchSuggestions(debouncedDropoff, sessionToken);
      setToSuggestions(suggestions);
    };
    fetchDropoffSuggestions();
  }, [debouncedDropoff]);

  useEffect(() => {
    const getDistance = async () => {
      if (fromPlace && toPlace) {
        const data = await fetchDistance({
          origins: fromPlace,
          destinations: toPlace,
        });

        const element = data?.rows?.[0]?.elements?.[0];
        if (element?.status === 'OK') {
          setDistanceResult(`${element.distance.text} - ${element.duration.text}`);
        } else {
          setDistanceResult('Unable to calculate distance.');
        }
      }
    };
    getDistance();
  }, [fromPlace, toPlace]);

  const handleSuggestionSelect = (
    item: any,
    field: 'pickupLocation' | 'dropoffLocation',
    setPlace: React.Dispatch<React.SetStateAction<string>>,
    clearSuggestions: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    handleChange(field, item.description);
    setPlace(item.description);
    clearSuggestions([]);
  };


  const handleBlur = () => {
    const numericValue = booking.fare || 0;

    if (booking.fare && numericValue < MIN_PRICE) {
      setBooking({ ...booking, fare: MIN_PRICE }); // Set to $249.00
      setError(`Minimum fare limit $${MIN_PRICE}`);
    } else if (booking.fare && numericValue > MAX_PRICE) {
      setBooking({ ...booking, fare: MAX_PRICE }); // Set to $932.00
      setError(`Maximum fare limit $${MAX_PRICE}`);
    } else if (booking.fare === 0 || numericValue === 0) {
      setBooking({ ...booking, fare: MIN_PRICE }); // Set to $249.00 if empty
      setError(`Fare set to minimum $${MIN_PRICE}`);
    } else {
      // Format to 2 decimal places
      setBooking({ ...booking, fare: numericValue });
      setError('');
    }
  };
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setShowDatePicker(Platform.OS === 'ios'); // Keep picker open for iOS
      handleChange("pickupDate", selectedDate.toISOString());
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setShowTimePicker(Platform.OS === 'ios'); // Keep picker open for iOS
      handleChange("pickupTime", selectedTime.toISOString());
    }
  };



  const handleSubmit = async () => {
    if (!booking.pickupLocation || !booking.dropoffLocation || !booking.fare || !booking.duration || !booking.tripType || !booking.carType || !booking.pickupDate || !booking.pickupTime || !booking.fare || !booking.durationUnit || !booking.commission) {
      alert("Please fill in all required fields.");
      return;
    }

    await createTrip(user?._id, booking)

    setBooking({
      pickupLocation: "",
      dropoffLocation: "",
      duration: 0,
      durationUnit: "hours",
      fare: 0,
      commission: "",
      carType: "sedan",
      tripType: "one way",
      carName: "",
      additional: "",
      pickupDate: new Date(),
      pickupTime: new Date(),
    })

  };


  // Convert to hours for processing
  const getDurationInHours = () => {
    if (!booking.duration) return 0;
    const num = Number(booking.duration);
    if (isNaN(num)) return 0;
    return booking.durationUnit === 'days' ? num * 24 : num;
  };

  const renderSuggestion = (
    item: any,
    setInput: any,
    setPlace: any,
    clearSuggestions: any
  ) => (
    <TouchableOpacity
      onPress={() => handleSuggestionSelect(item, setInput, setPlace, clearSuggestions)}
    >
      <Text style={{ padding: 8 }}>{item.description}</Text>
    </TouchableOpacity>
  );


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
    >
      <View className="flex-1 w-full items-center px-6 justify-between py-8">
        <View className='w-full items-start gap-5'>
          <Text className="text-black font-extrabold text-2xl">Create Booking</Text>

          {/* Pickup Location */}
          <View className="w-full flex gap-1">
            <Text className="text-gray-600">Pickup Location</Text>
            <TextInput
              placeholder="Enter pickup location"
              value={booking.pickupLocation}
              onChangeText={(text) => {
                handleChange('pickupLocation', text);
                setFromPlace('');
              }}
              className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]"
            />
            <FlatList
              data={fromSuggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) =>
                renderSuggestion(item, 'pickupLocation', setFromPlace, setFromSuggestions)
              }
            />
          </View>

          {/* Dropoff Location */}
          <View className="w-full flex gap-1 mt-4">
            <Text className="text-gray-600">Dropoff Location</Text>
            <TextInput
              placeholder="Enter dropoff location"
              value={booking.dropoffLocation}
              onChangeText={(text) => {
                handleChange('dropoffLocation', text);
                setToPlace('');
              }}
              className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]"
            />
            <FlatList
              data={toSuggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) =>
                renderSuggestion(item, 'dropoffLocation', setToPlace, setToSuggestions)
              }
            />
          </View>
          <View className="w-full flex gap-1">
            <Text className="text-gray-600">Trip Type</Text>
            <View className="border border-gray-300 bg-white rounded-[8px]">
              <Picker
                selectedValue={booking.tripType}
                onValueChange={(value) => handleChange("tripType", value)}
                itemStyle={{ backgroundColor: "white", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
              >
                <Picker.Item label="One Way" value="one-way" />
                <Picker.Item label="Round" value="round" />
              </Picker>
            </View>
          </View>
          <View className="w-full flex gap-2">
            <Text className="text-gray-600 text-base font-semibold">
              Enter Duration
            </Text>
            <View className="w-full flex-row items-center border justify-between border-gray-300 bg-white rounded-[8px]">
              <TextInput
                className="flex-1 p-3 bg-white text-lg"
                value={String(booking.duration)}
                onChangeText={(value) => handleChange("duration", value)}
                placeholder="Enter a number"
                keyboardType="numeric"
              />
              <View className="border-l border-gray-300 rounded-r-[8px] bg-gray-100">
                <Picker
                  selectedValue={booking.durationUnit}
                  style={{ width: 120 }}
                  onValueChange={(item) => handleChange("durationUnit", item)}
                  itemStyle={{ backgroundColor: "white", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
                >
                  <Picker.Item label="Hours" value="hours" />
                  <Picker.Item label="Days" value="days" />
                </Picker>
              </View>
            </View>
            <Text className="text-gray-600 text-base mt-2">
              Duration in hours: {getDurationInHours()}
            </Text>
          </View>

          {/* Fare */}
          <View className="w-full flex gap-1">
            <Text className="text-gray-600">Fare (Rs)</Text>
            <TextInput
              className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]"
              value={booking.fare !== 0 ? booking.fare.toString() : ""}
              onChangeText={((text) => handleChange("fare", text))}
              onBlur={handleBlur}
              placeholder={`Fare range is ₹${MIN_PRICE} and ₹${MAX_PRICE}`}
              keyboardType="decimal-pad"
            />
            {error ? (
              <Text className="text-red-500 text-sm mt-1">{error}</Text>
            ) : null}

          </View>

          {/* Commission */}
          <View className="w-full flex gap-1">
            <Text className="text-gray-600">Commission (Rs)</Text>
            <TextInput
              placeholder="Enter commission amount"
              value={booking.commission}
              onChangeText={(text) => handleChange("commission", text)}
              keyboardType="numeric"
              className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]"
            />
          </View>

          {/* Pickup Date */}
          {/* Pickup Date */}
          <View className="w-full flex gap-1">
            <Text>Pickup Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]">
              <Text>{booking.pickupDate ? new Date(booking.pickupDate).toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={booking.pickupDate instanceof Date ? booking.pickupDate : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Pickup Time */}
          <View className="w-full flex gap-1">
            <Text>Pickup Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]">
              <Text>{booking.pickupTime ? new Date(booking.pickupTime).toLocaleTimeString() : "Select Time"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={booking.pickupTime instanceof Date ? booking.pickupTime : new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Car Type - Modal Trigger */}
          <View className="w-full flex gap-1">
            <Text className="text-gray-600">Car Type</Text>
            <TouchableOpacity onPress={() => { !carModalVisible ? setCarModalVisible(true) : setCarModalVisible(false) }} className="w-full py-4 border border-gray-300 bg-white px-3 rounded-[8px]">
              <Text className="text-lg">{booking.carType.charAt(0).toUpperCase() + booking.carType.slice(1)}</Text>
            </TouchableOpacity>

            {/* Car Type Modal */}
            <Modal
              isVisible={carModalVisible}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              animationInTiming={500}  // <-- control speed here (ms)
              animationOutTiming={600} // Adjust exit timing for smoother exit
              backdropTransitionInTiming={800}
              backdropTransitionOutTiming={800}
              style={{ justifyContent: 'flex-end', margin: 0 }}
              useNativeDriver={true}
              onModalHide={carModalVisible ? () => setCarModalVisible(false) : undefined} // Close modal on hide
            >
              <View className="flex-1 justify-end">
                <View className="bg-white  p-6 rounded-lg max-h-[50%]">
                  <View className='flex-row justify-between items-center mb-4'>
                    <Text className="text-xl font-bold">Select Car Type</Text>
                    <TouchableOpacity onPress={() => setCarModalVisible(false)}>
                      <Text className="text-red-500 text-lg">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {["sedan", "suv", "mpv", "luxury sedan", "luxury suv", "traveller", "urbania", "bus"].map((type) => (
                      <TouchableOpacity className='bg-white' key={type} onPress={() => { handleChange("carType", type); setCarModalVisible(false); }}>
                        <Text className="text-lg py-2">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
          {/* Car Name */}
          {/* <View className="w-full flex gap-1">
            <Text className="text-gray-600">Car Name</Text>
            <TextInput
              placeholder="Enter car name"
              value={booking.carName}
              onChangeText={(text) => handleChange("carName", text)}
              className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
            />
          </View> */}
          {/* <View className="w-full flex gap-1">
            <Text className="text-gray-600">Car Name</Text>
            <TouchableOpacity
              onPress={() => setCarNameModalVisible(true)}
              className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
            >
              <Text className="text-lg text-gray-800">
                {booking.carName || "Select car name"}
              </Text>
            </TouchableOpacity>

            <Modal visible={carNameModalVisible} animationType="slide" transparent>
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white p-6 rounded-lg max-h-[50%]">
                  <Text className="text-xl font-bold mb-4">Select Car Name</Text>

                  {(segmentCar[booking.carType as keyof typeof segmentCar] || []).map((car) => (
                    <TouchableOpacity
                      key={car}
                      onPress={() => {
                        handleChange("carName", car);
                        setCarNameModalVisible(false);
                      }}
                    >
                      <Text className="text-lg py-2">{car}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => setCarNameModalVisible(false)} className="mt-4">
                    <Text className="text-red-500 text-lg">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View> */}


          {/* Additional Notes */}
          <View className='w-full flex gap-1'>
            <Text className="text-gray-600">Additional Notes</Text>
            <TextInput
              className="w-full border border-gray-300 bg-white text-lg p-3 rounded-[8px]"
              placeholder="Any additional information"
              value={booking.additional}
              onChangeText={handleTextChange}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
              scrollEnabled={true}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-500 text-sm">
                {booking.additional.length}/{300}
              </Text>
              {error ? (
                <Text className="text-red-500 text-sm">{error}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-4 w-full rounded-md items-center mt-[2rem] ${!booking.pickupLocation || !booking.dropoffLocation || !booking.fare ? "bg-neutral-300" : "bg-black"}`}
          disabled={!booking.pickupLocation || !booking.dropoffLocation || !booking.fare}
        >
          <Text className="text-white text-xl">Create Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
}

const segmentCar = {
  "sedan": [
    "Dzire",
    "Etios",
    "Xcent",
    "Amaze"
  ],

  "suv": [
    "Innova Crysta",
    "Scorpio",
    "Ertiga",
    "Creta"
  ],

  "mpv": [
    "Ertiga",
    "Innova",
    "Carens",
    "Marazzo"
  ],

  "luxury suv": [
    "Fortuner",
    "Gloster",
    "Tucson",
    "X1"
  ],

  "luxury sedan": [
    "Camry",
    "Superb",
    "E-Class",
    "A6"
  ],

  "traveller": [
    "Traveller",
    "Urbania",
    "Winger",
    "Mitr",
    "Skyline Pro",
    "Bus"
  ]
};

