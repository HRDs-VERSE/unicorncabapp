import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'

interface SelectTripTypeModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectTripType: (type: TripType | null) => void;
}

type TripType = "round" | "one-way";

export default function SelectTripTypeModal({
  modalVisible,
  setModalVisible,
  selectTripType,
}: SelectTripTypeModalProps) {
  const tripTypes: { type: TripType; label: string }[] = [
    { type: "one-way", label: "One Way" },
    { type: "round", label: "Round Trip" },
  ];

  const handleClear = () => {
    selectTripType(null); // Default to one way or set to null if needed
    setModalVisible(false);
  };

  return (
    <View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-lg p-4 max-h-[40%]">
            <Text className="text-lg font-bold text-center mb-2">Select Trip Type</Text>
            <FlatList
              data={tripTypes}
              keyExtractor={(item) => item.type}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-gray-300"
                  onPress={() => selectTripType(item.type)}
                >
                  <Text className="text-black">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <View className='flex-row justify-between'>
              <TouchableOpacity
                className="p-3 bg-gray-500 mt-2 rounded-lg w-[48%]"
                onPress={handleClear}
              >
                <Text className="text-white text-center font-bold">Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 bg-black mt-2 rounded-lg w-[48%]"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
