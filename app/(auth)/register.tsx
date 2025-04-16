import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function CompleteProfile() {
    const router  = useRouter()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""
    });

    const [documents, setDocuments] = useState({
        drivingLicense: null as string | null,
        rc: null as string | null,
        insurance: null as string | null,
        addhar: null as string | null,
        pollutionPaper: null as string | null,
        carPhoto: null as string | null,
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const pickDocument = async (type: "drivingLicense" | "rc" | "insurance" | "addhar" | "pollutionPaper" | "carPhoto") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setDocuments({ ...documents, [type]: result.assets[0].uri });
        }
    };

    const handleContinue = () => {
        // if (!formData.fullName || !formData.password) {
        //     Alert.alert("Error", "Please complete all required fields.");
        //     return;
        // }
        router.replace("/(tabs)")
        console.log("Submitting Profile with:", formData, documents);
    };

    return (
        <View className="flex-1 items-center bg-white gap-[2rem] px-[1.8rem] justify-between">
            {/* Header Section */}
            <View className="w-full flex items-start gap-[1rem] pt-[4rem]">
                <View className="flex gap-4">
                    <Text className="text-black font-extrabold text-[1.6rem]">Complete Your Profile</Text>
                    <Text className="text-[.9rem] text-gray-600">
                        You have verified your mobile number. Now, enter your details to continue.
                    </Text>
                </View>

                {/* Full Name Input */}
                <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#aaa"
                    value={formData.fullName}
                    onChangeText={(text) => handleChange("fullName", text)}
                    className="w-full border-b-2 border-neutral-400 text-[1.2rem] text-black p-3"
                />

                {/* Email Input */}
                <TextInput
                    placeholder="Email (Optional)"
                    placeholderTextColor="#aaa"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                    className="w-full border-b-2 border-neutral-400 text-[1.2rem] text-black p-3"
                />

                {/* Password Input */}
                <TextInput
                    placeholder="Create a Password"
                    placeholderTextColor="#aaa"
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                    secureTextEntry
                    className="w-full border-b-2 border-neutral-400 text-[1.2rem] text-black p-3"
                />
            </View>

            {/* Document Uploads */}
            <View className="w-full gap-4">
                {/* Driving License Upload */}
                <TouchableOpacity
                    onPress={() => pickDocument("drivingLicense")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.drivingLicense ? (
                        <Image source={{ uri: documents.drivingLicense }} className="w-24 h-24 rounded-[8px]" />
                    ) : (
                        <Text className="text-gray-600">Upload Driving License <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>

                {/* Car Papers Upload */}
                <TouchableOpacity
                    onPress={() => pickDocument("rc")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.rc ? (
                        <Image source={{ uri: documents.rc }} className="w-24 h-24 rounded-md" />
                    ) : (
                        <Text className="text-gray-600">Upload RC Fitness Certificate <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>

                {/* Insurance Upload */}
                <TouchableOpacity
                    onPress={() => pickDocument("insurance")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.insurance ? (
                        <Image source={{ uri: documents.insurance }} className="w-24 h-24 rounded-md" />
                    ) : (
                        <Text className="text-gray-600">Upload Insurance <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pickDocument("pollutionPaper")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.pollutionPaper ? (
                        <Image source={{ uri: documents.pollutionPaper }} className="w-24 h-24 rounded-md" />
                    ) : (
                        <Text className="text-gray-600">Upload Pollution Paper <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pickDocument("carPhoto")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.carPhoto ? (
                        <Image source={{ uri: documents.carPhoto }} className="w-24 h-24 rounded-md" />
                    ) : (
                        <Text className="text-gray-600">Upload Car front photo <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pickDocument("addhar")}
                    className="w-full p-3 flex items-center bg-neutral-100 rounded-[8px]"
                >
                    {documents.addhar ? (
                        <Image source={{ uri: documents.addhar }} className="w-24 h-24 rounded-md" />
                    ) : (
                        <Text className="text-gray-600">Upload Addhar <Text className="text-red-600 text-[1.4rem]">*</Text></Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <View className="pb-[2rem] w-full">
                <TouchableOpacity
                    onPress={handleContinue}
                    className={`${
                        formData.fullName && formData.password ? "bg-black" : "bg-neutral-300"
                    } py-4 w-full rounded-md flex items-center`}
                    // disabled={!formData.fullName || !formData.password}
                >
                    <Text className="text-white text-[1.2rem]">Onboard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
