import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import useUserAPI from '@/apiHook/useUserAPI';
import Modal from 'react-native-modal';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function UserInfoModal({ visible, onClose }: Props) {
    const { user, setUser } = useAuthStore();
    const { updateUserProfile } = useUserAPI();

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');

    const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSave = async () => {
        if (!user?._id) return; // Extra safety

        const updates = {
            fullName,
            email,
            mobileNumber,
        };

        const result = await updateUserProfile(user._id, updates);

        if (result.success) {
            // Update local user too, if needed
            setUser({ ...user, ...updates });

            console.log('Profile Updated Successfully');
            onClose();
        } else {
            console.log('Error Updating Profile:', result.message);
            // Optional: show an alert to user
        }
    };
    
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={500}  // <-- control speed here (ms)
            animationOutTiming={500}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View className="flex-1 justify-end bg-black/10">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="w-full bg-white rounded-[10px] p-6"
                    style={{ height: keyboardOpen ? '65%' : '45%' }} // Increase height when keyboard open
                >
                    {/* Drag handle */}
                    <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

                    <Text className="text-xl font-bold mb-6 text-center">Edit Information</Text>

                    {/* Full Name */}
                    <View className='flex gap-3'>
                        <View>
                            <Text className="text-gray-600 mb-1 font-semibold">Full Name</Text>
                            <TextInput
                                placeholder="Full Name"
                                value={fullName}
                                onChangeText={setFullName}
                                className="border border-gray-300 rounded-md p-3"
                            />
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="text-gray-600 mb-1 font-semibold">Email</Text>
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                className="border border-gray-300 rounded-md p-3"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Mobile Number */}
                        <View>
                            <Text className="text-gray-600 mb-1 font-semibold">Mobile Number</Text>
                            <TextInput
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                className="border border-gray-300 rounded-md p-3"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-neutral-100 py-3 rounded-lg mr-2 items-center"
                        >
                            <Text className="text-black font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="flex-1 bg-black py-3 w-full rounded-lg ml-2 items-center"
                        >
                            <Text className="text-white font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
