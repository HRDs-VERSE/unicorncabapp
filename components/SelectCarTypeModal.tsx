import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'

interface SelectCarTypeModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectCarType: (type: CarType | null) => void; // Allow null to clear
}

type CarType =
  | "sedan"
  | "suv"
  | "mpv"
  | "luxury"
  | "luxury suv"
  | "traveller"
  | "bus"
  | "urbania"

export default function SelectCarTypeModal({
  modalVisible,
  setModalVisible,
  selectCarType,
}: SelectCarTypeModalProps) {
  const carTypes: { type: CarType; label: string }[] = [
    { type: "sedan", label: "Sedan" },
    { type: "suv", label: "SUV" },
    { type: "mpv", label: "MPV" },
    { type: "luxury", label: "Luxury" },
    { type: "luxury suv", label: "Luxury SUV" },
    { type: "traveller", label: "Traveller" },
    { type: "bus", label: "Bus" },
    { type: "urbania", label: "Urbania" },
  ];

  const handleClear = () => {
    selectCarType(null); // Clear selection
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
          <View className="bg-white rounded-t-lg p-4 max-h-[50%]">
            <Text className="text-lg font-bold text-center mb-2">Select Car Type</Text>
            <FlatList
              data={carTypes}
              keyExtractor={(item) => item.type}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-gray-300"
                  onPress={() => selectCarType(item.type)}
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
  );
}
