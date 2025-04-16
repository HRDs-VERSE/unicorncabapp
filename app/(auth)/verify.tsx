import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

export default function Verify() {
    const { number } = useLocalSearchParams();

    const [code, setCode] = useState<string[]>(["", "", "", ""]); // Store the 4 digits
    const inputs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null)
    ]; // Refs for each input

    const handleChange = (text: string, index: number) => {
        if (/^\d*$/.test(text)) { // Allow only digits
            let newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

            // Move to next input if a digit is entered
            if (text && index < 3) {
                inputs[index + 1].current?.focus();
            }
        }
    };

    const handleBackspace = (text: string, index: number) => {
        if (text === "" && index > 0) {
            inputs[index - 1].current?.focus();
        }
    };

    return (
        <View className="flex-1 items-center bg-white gap-[2rem] px-[1.8rem] justify-between">

            <View className='w-full flex items-start gap-[2rem] pt-[4rem]'>
                <View>
                    <Text className="text-black font-extrabold text-[1.6rem]">An OTP sent to your number</Text>
                    <Text className="text-black font-extrabold text-[1.6rem]">+{number}</Text>
                </View>

                {/* 4 Digit Input Boxes */}
                <View className='flex'>
                    <View className="flex-row justify-center">
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputs[index]}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === "Backspace") {
                                        handleBackspace(digit, index);
                                    }
                                }}
                                keyboardType="number-pad"
                                maxLength={1}
                                className="w-12 border-b-2 border-blue-600 text-center text-[1.6rem] font-bold text-black"
                                placeholder="●"
                                placeholderTextColor="#ccc"
                            />
                        ))}
                    </View>
                    <View>
                        <Text className="text-gray-600 text-[.9rem] mt-6">Didn't receive the code?</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold mt-1">Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <View className='pb-[2rem] w-full'>
                <TouchableOpacity
                    // disabled={code.join("").length !== 4}
                    onPress={() => {
                        // if (number.length === 10) {
                        router.push(`/(auth)/register`);
                        // }
                    }}
                    className={`${code.join("").length !== 4 ? "bg-neutral-300" : "bg-black"} py-4 w-full rounded-md flex items-center`}
                >
                    <Text className="text-white text-[1.2rem]">Verify</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
