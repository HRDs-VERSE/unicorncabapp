import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'

interface CountryCodeModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    selectCountryCode: (code: string) => void;
}

export default function CountryCodeModal({modalVisible, setModalVisible, selectCountryCode}: CountryCodeModalProps) {

    const countryCodes = [
        { code: '+91', country: 'India' },
        { code: '+1', country: 'USA' },
        { code: '+44', country: 'UK' },
        { code: '+61', country: 'Australia' },
        { code: '+81', country: 'Japan' },
        { code: '+49', country: 'Germany' },
        { code: '+33', country: 'France' },
        { code: '+86', country: 'China' },
    ];

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
                        <Text className="text-lg font-bold text-center mb-2">Select Country</Text>
                        <FlatList
                            data={countryCodes}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-300"
                                    onPress={() => selectCountryCode(item.code)}
                                >
                                    <Text className="text-black">{item.code} - {item.country}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            className="p-3 bg-black mt-2 rounded-lg"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-white text-center font-bold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}