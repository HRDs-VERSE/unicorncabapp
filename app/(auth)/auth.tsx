import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import CountryCodeModal from '@/components/CountryCodeModal';
import { router } from 'expo-router';

export default function Auth() {
    const [selectedCode, setSelectedCode] = useState('+91');
    const [modalVisible, setModalVisible] = useState(false);
    const [number, setNumber] = useState('');

    const selectCountryCode = (code: string) => {
        setSelectedCode(code);
        setModalVisible(false);
    };

    const handleNumberChange = (text: string) => {
        if (/^\d*$/.test(text)) {
            if (text.length <= 10) {
                setNumber(text);
            }
        }
    };

    return (
        <>
            <View className="flex-1 items-center bg-white gap-[2rem] px-[1.8rem] justify-between">
                {/* Header Text */}
                <View className='w-full flex items-start gap-[2rem] pt-[4rem]'>
                    <View className="flex gap-4">
                        <View>
                            <Text className="text-black font-extrabold text-[1.6rem]">Enter Phone number for</Text>
                            <Text className="text-black font-extrabold text-[1.6rem]">verification</Text>
                        </View>
                        <Text className="text-[.9rem] text-gray-600">
                            This number will be used for all ride-related communication. You shall receive an SMS with a code for verification.
                        </Text>
                    </View>

                    {/* Phone Input Section */}
                    <View className="w-full flex flex-row items-center border-b-2 border-blue-600">
                        {/* Country Code Selector (Opens Drawer) */}
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert("Currently we only operate in India.");
                                // setModalVisible(true)
                            }}
                            className="p-4 rounded-l-md "
                        >
                            <Text className="text-black text-[1.4rem] font-bold">{selectedCode}</Text>
                        </TouchableOpacity>

                        {/* Phone Number Input */}
                        <TextInput
                            placeholder="Your Number"
                            placeholderTextColor="#aaa"
                            value={number}
                            onChangeText={handleNumberChange}
                            maxLength={10}
                            keyboardType="phone-pad"
                            autoFocus={true}
                            className="flex-1 text-[1.4rem] font-bold text-black p-4"
                        />
                    </View>
                </View>
                <View className='pb-[2rem] w-full'>
                    <TouchableOpacity
                        // disabled={number.length !== 10}
                        onPress={() => {
                            // if (number.length === 10) {
                                router.push(`/(auth)/verify?number=${selectedCode + number}`);
                            // }
                        }}
                        className={`${number.length !== 10 ? "bg-neutral-300" : "bg-black"} py-4 w-full rounded-md flex items-center`}
                    >
                        <Text className="text-white text-[1.2rem]">Next</Text>
                    </TouchableOpacity>

                </View>

                {/* Modal for Country Code Selection */}
            </View>
            <CountryCodeModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectCountryCode={selectCountryCode} />
        </>
    );
}