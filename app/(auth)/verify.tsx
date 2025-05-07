import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import useUserAPI from '@/apiHook/useUserAPI';
import { useAuthStore } from '@/store/authStore';

export default function Verify() {
    const { verifyUser, initiateRegistration } = useUserAPI();

    const { number } = useLocalSearchParams<{ number: string }>();
    const [code, setCode] = useState<string[]>(["", "", "", ""]);

    const inputs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null)
    ];


    const handleChange = (text: string, index: number) => {
        if (/^\d*$/.test(text)) {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

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

    const handleResendCode = async () => {
        const numberWithPlus = number.startsWith("+") ? number : `+${number.trim()}`;
        const result = await initiateRegistration(numberWithPlus);

        if (result?.success) {
            Alert.alert("Code Resent", "A new verification code has been sent to your number.");
        } else {
            Alert.alert("Resend Failed", result?.message || "Unable to resend code. Please try again.");
        }
    }

    const handleVerify = async () => {
        const otp = code.join("");
        if (otp.length !== 4) return;

        const numberWithPlus = number.startsWith("+") ? number : `+${number.trim()}`;

        const result = await verifyUser({ number: numberWithPlus, verifyCode: otp });

        if (result?.success) {
            const { user } = result;
            if (user) {
                await useAuthStore.getState().setUser(user); 
            }
            router.push(`/(auth)/register`);

        } else {
            Alert.alert("Verification Failed", result?.message || "Invalid or expired code.");
        }
    };

    return (
        <View className="flex-1 items-center bg-white gap-[2rem] px-[1.8rem] justify-between">
            <View className='w-full flex items-start gap-[2rem] pt-[4rem]'>
                <View>
                    <Text className="text-black font-extrabold text-[1.6rem]">An OTP sent to your number</Text>
                    <Text className="text-black font-extrabold text-[1.6rem]">{number}</Text>
                </View>

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
                        <TouchableOpacity onPress={handleResendCode}>
                            <Text className="text-blue-600 font-bold mt-1">Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className='pb-[2rem] w-full'>
                <TouchableOpacity
                    onPress={handleVerify}
                    className={`${code.join("").length !== 4 ? "bg-neutral-300" : "bg-black"} py-4 w-full rounded-md flex items-center`}
                >
                    <Text className="text-white text-[1.2rem]">Verify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
