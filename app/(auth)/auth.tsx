import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import CountryCodeModal from '@/components/CountryCodeModal';
import { router } from 'expo-router';
import useUserAPI from '@/apiHook/useUserAPI';
import { useAuthStore } from '@/store/authStore';

export default function Auth() {
    const { initiateRegistration } = useUserAPI();

    const [selectedCode, setSelectedCode] = useState('+91');
    const [modalVisible, setModalVisible] = useState(false);
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false); // Toggle for login/register

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

    const handleNext = async () => {
        if (number.length !== 10) return;
        let result;
        const fullNumber = `${selectedCode}${number}`;

        if (isLogin) {
            result = await initiateRegistration(fullNumber, password);
            await useAuthStore.getState().setUser(result.user);
            await useAuthStore.getState().setToken(result.token);
        } else {
            result = await initiateRegistration(fullNumber);

        }
        if (result?.success) {
            if (isLogin) {
                router.push(`/(tabs)`);
                return;
            }
            router.push(`/(auth)/verify?number=${fullNumber}`);
        } else {
            Alert.alert("Registration Error", result?.message || "Something went wrong.");
        }
    };

    return (
        <>
            <View className="flex-1 items-center bg-white gap-[2rem] px-[1.8rem] justify-between">
                <View className='w-full flex items-start gap-[1rem] pt-[4rem]'>
                    <View className="flex gap-4">
                        <View>
                            <Text className="text-black font-extrabold text-[1.6rem]">
                                {isLogin ? "Login with your number" : "Enter Phone number for"}
                            </Text>
                            {!isLogin && (
                                <Text className="text-black font-extrabold text-[1.6rem]">
                                    verification
                                </Text>
                            )}
                        </View>
                        {!isLogin && (
                            <Text className="text-[.9rem] text-gray-600">
                                This number will be used for all ride-related communication. You shall receive an SMS with a code for verification.
                            </Text>
                        )}
                    </View>

                    <View className="w-full flex flex-row items-center border-b-2 border-blue-600">
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert("Currently we only operate in India.");
                                // setModalVisible(true)
                            }}
                            className="p-4 rounded-l-md"
                        >
                            <Text className="text-black text-[1.4rem] font-bold">{selectedCode}</Text>
                        </TouchableOpacity>

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

                    {isLogin && (
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="w-full text-[1.4rem] font-bold text-black border-b-2 border-blue-600 p-4"
                        />
                    )}

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text className="text-blue-600 mt-2">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className='pb-[2rem] w-full'>
                    <TouchableOpacity
                        onPress={handleNext}
                        className={`${number.length !== 10 ? "bg-neutral-300" : "bg-black"} py-4 w-full rounded-md flex items-center`}
                    >
                        <Text className="text-white text-[1.2rem]">{isLogin ? "Login" : "Next"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CountryCodeModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                selectCountryCode={selectCountryCode}
            />
        </>
    );
}
