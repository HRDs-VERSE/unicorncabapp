import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function CreateBooking() {
  const [booking, setBooking] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    duration: "",
    fare: "",
    commission: "",
    carType: "sedan",
    carName: "",
    additional: "",
    pickupDate: new Date(),
    pickupTime: new Date(),
  });

  const [carModalVisible, setCarModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (field: string, value: string) => {
    setBooking((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    if (!booking.pickupLocation || !booking.dropoffLocation || !booking.fare || !booking.carName) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Booking Created:", booking);
    // router.push("/bookings"); // Uncomment to navigate
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
    >
      <View className="flex-1 w-full items-center bg-white px-6 justify-between py-8">
        <View className='w-full items-start gap-6'>
          <Text className="text-black font-extrabold text-2xl">Create Booking</Text>

          {/* Pickup Location */}
          <Text className="text-gray-600">Pickup Location</Text>
          <TextInput
            placeholder="Enter pickup location"
            value={booking.pickupLocation}
            onChangeText={(text) => handleChange("pickupLocation", text)}
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Dropoff Location */}
          <Text className="text-gray-600">Dropoff Location</Text>
          <TextInput
            placeholder="Enter dropoff location"
            value={booking.dropoffLocation}
            onChangeText={(text) => handleChange("dropoffLocation", text)}
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Duration */}
          <Text className="text-gray-600">Duration</Text>
          <TextInput
            placeholder="e.g., 2 hrs"
            value={booking.duration}
            onChangeText={(text) => handleChange("duration", text)}
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Fare */}
          <Text className="text-gray-600">Fare (Rs)</Text>
          <TextInput
            placeholder="Enter fare amount"
            value={booking.fare}
            onChangeText={(text) => handleChange("fare", text)}
            keyboardType="numeric"
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Commission */}
          <Text className="text-gray-600">Commission (Rs)</Text>
          <TextInput
            placeholder="Enter commission amount"
            value={booking.commission}
            onChangeText={(text) => handleChange("commission", text)}
            keyboardType="numeric"
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Pickup Date */}
          {/* Pickup Date */}
          <Text>Pickup Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} className="w-full border border-gray-300 text-lg p-3 rounded-[8px]">
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

          {/* Pickup Time */}
          <Text>Pickup Time</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} className="w-full border border-gray-300 text-lg p-3 rounded-[8px]">
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

          {/* Car Type - Modal Trigger */}
          <Text className="text-gray-600">Car Type</Text>
          <TouchableOpacity onPress={() => setCarModalVisible(true)} className="w-full py-4 border border-gray-300 px-3 rounded-[8px]">
            <Text className="text-lg">{booking.carType.charAt(0).toUpperCase() + booking.carType.slice(1)}</Text>
          </TouchableOpacity>

          {/* Car Type Modal */}
          <Modal visible={carModalVisible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white  p-6 rounded-lg max-h-[50%]">
                <Text className="text-xl font-bold mb-4">Select Car Type</Text>
                {["sedan", "suv", "mpv", "luxury", "luxury suv", "traveller"].map((type) => (
                  <TouchableOpacity key={type} onPress={() => { handleChange("carType", type); setCarModalVisible(false); }}>
                    <Text className="text-lg py-2">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setCarModalVisible(false)} className="mt-4">
                  <Text className="text-red-500 text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Car Name */}
          <Text className="text-gray-600">Car Name</Text>
          <TextInput
            placeholder="Enter car name"
            value={booking.carName}
            onChangeText={(text) => handleChange("carName", text)}
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />

          {/* Additional Notes */}
          <Text className="text-gray-600">Additional Notes</Text>
          <TextInput
            placeholder="Any additional information"
            value={booking.additional}
            onChangeText={(text) => handleChange("additional", text)}
            multiline
            className="w-full border border-gray-300 text-lg p-3 rounded-[8px]"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-4 w-full rounded-md items-center mt-[2rem] ${!booking.pickupLocation || !booking.dropoffLocation || !booking.fare || !booking.carName ? "bg-neutral-300" : "bg-black"}`}
          disabled={!booking.pickupLocation || !booking.dropoffLocation || !booking.fare || !booking.carName}
        >
          <Text className="text-white text-xl">Create Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
