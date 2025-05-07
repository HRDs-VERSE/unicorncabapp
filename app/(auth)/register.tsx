import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native';
import useUserAPI from '@/apiHook/useUserAPI';
import useAzureAPI from '@/apiHook/useAzureAPI';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

type DocumentType =
  | 'drivingLicense'
  | 'rc'
  | 'insurance'
  | 'addhar'
  | 'pollutionPaper'
  | 'carPhoto';

interface DocumentState {
  drivingLicense: string[];
  addhar: string[];
  rc: { url: string }[];
  insurance: { url: string }[];
  pollutionPaper: { url: string }[];
  carPhoto: { url: string[] }[];
}

export default function CarDocumentsScreen() {
  const { auth } = useUserAPI()
  const { uploadToAzure, deleteFromAzure } = useAzureAPI();

  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "work"
  });

  const [documents, setDocuments] = useState<DocumentState>({
    drivingLicense: [],
    addhar: [],
    rc: [],
    insurance: [],
    pollutionPaper: [],
    carPhoto: [],
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    const isValid =
      formData.fullName.trim() !== "" &&
      formData.password.trim() !== "" &&
      documents.drivingLicense.length > 0 &&
      documents.addhar.length > 0 &&
      documents.rc.length > 0 &&
      documents.insurance.length > 0 &&
      documents.pollutionPaper.length > 0 &&
      documents.carPhoto.length > 0;
    setIsFormValid(isValid);
  }, [formData, documents]);

  const pickImage = async (type: DocumentType, carIndex?: number, multiple = false) => {
    // Set multiple to true for drivingLicense and addhar, they can have front and back images
    if (type === 'drivingLicense' || type === 'addhar') {
      multiple = true;
    }
    // For rc, insurance, and pollutionPaper, we always set multiple to false
    else if (['rc', 'insurance', 'pollutionPaper'].includes(type)) {
      multiple = false;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiple,
      allowsEditing: !multiple, // Only allow editing for single image selection
      quality: 1,
      base64: true,
      // Remove base64: true to avoid large payloads
    });

    if (!result.canceled) {
      const assets = result.assets;

      const imageUrls = await Promise.all(
        assets.map(async (asset) => {
          if (!asset.base64) {
            console.log("Asset base64 data is missing");
            return;
          }
          const base64 = `data:image/jpeg;base64,${asset.base64}`
          const uploadResult = await uploadToAzure(base64, "cardocument");

          // Return the URL from Azure if upload was successful
          return uploadResult?.url || '';
        })
      );

      // Filter out any failed uploads
      const successfulUrls = imageUrls.filter((url: string) => url !== '');

      setDocuments((prev) => {
        const updated = { ...prev };

        if (type === 'drivingLicense' || type === 'addhar') {
          // For license and addhar, we can have multiple images (front/back)
          // Limit to max 2 images for these documents
          const currentImages = [...updated[type]];
          const newImages = [...currentImages, ...successfulUrls];
          // Only keep the most recent 2 images if more are selected
          updated[type] = newImages.slice(-2);
        } else if (typeof carIndex === 'number') {
          if (type === 'carPhoto') {
            // For carPhoto, we allow multiple images per car
            if (!updated.carPhoto[carIndex]) {
              updated.carPhoto[carIndex] = { url: [] };
            }
            updated.carPhoto[carIndex].url.push(...successfulUrls);
          } else {
            // For rc, insurance, pollutionPaper - only allow one image per car
            // Make sure we have the array for this car index
            while (updated[type].length <= carIndex) {
              updated[type].push({ url: '' });
            }

            // Just update the URL of the existing object
            updated[type][carIndex] = { url: successfulUrls[0] || '' };
          }
        }

        return updated;
      });
    }
  };

  const removeDocument = (type: DocumentType, index?: number, carIndex?: number) => {
    setDocuments((prev) => {
      const updated = { ...prev };

      if (type === 'drivingLicense' || type === 'addhar') {
        const urlToDelete = updated[type][index!];
        if (urlToDelete) {
          deleteFromAzure(urlToDelete); // 🔥 Call delete
        }

        updated[type] = updated[type].filter((_, i) => i !== index);
      } else if (typeof carIndex === 'number') {
        if (type === 'carPhoto') {
          const photoArray = updated.carPhoto[carIndex]?.url;

          if (photoArray && photoArray.length > index!) {
            const urlToDelete = photoArray[index!];
            if (urlToDelete) {
              deleteFromAzure(urlToDelete); // 🔥 Call delete
            }

            photoArray.splice(index!, 1);
          }
        } else {
          const doc = updated[type][carIndex];
          if (doc?.url) {
            deleteFromAzure(doc.url); // 🔥 Call delete
          }

          updated[type][carIndex] = { url: '' };
        }
      }

      return updated;
    });
  };

  const handleRemoveCar = (carIndex: number) => {
    setDocuments((prev) => {
      const updated = { ...prev };

      // 🔥 Delete RC document if URL exists
      const rcDoc = updated.rc[carIndex];
      if (rcDoc?.url) deleteFromAzure(rcDoc.url);

      // 🔥 Delete Insurance document if URL exists
      const insuranceDoc = updated.insurance[carIndex];
      if (insuranceDoc?.url) deleteFromAzure(insuranceDoc.url);

      // 🔥 Delete Pollution Paper document if URL exists
      const pollutionDoc = updated.pollutionPaper[carIndex];
      if (pollutionDoc?.url) deleteFromAzure(pollutionDoc.url);

      // 🔥 Delete all Car Photos
      const carPhotos = updated.carPhoto[carIndex]?.url || [];
      carPhotos.forEach((photoUrl) => {
        if (photoUrl) deleteFromAzure(photoUrl);
      });

      // 💥 Now remove the car data from state
      updated.rc = updated.rc.filter((_, i) => i !== carIndex);
      updated.insurance = updated.insurance.filter((_, i) => i !== carIndex);
      updated.pollutionPaper = updated.pollutionPaper.filter((_, i) => i !== carIndex);
      updated.carPhoto = updated.carPhoto.filter((_, i) => i !== carIndex);

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (documents.drivingLicense.length === 0 || documents.addhar.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Required Documents',
        text2: 'Please upload Driving License and Aadhar Card.',
      });
      return;
    }

    // Check if all cars have required documents
    const missingDocs = documents.rc.findIndex(doc => !doc.url) !== -1 ||
      documents.insurance.findIndex(doc => !doc.url) !== -1 ||
      documents.pollutionPaper.findIndex(doc => !doc.url) !== -1 ||
      documents.carPhoto.findIndex(photos => !photos.url.length) !== -1;

    if (documents.addhar.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Missing Complete Addhar',
        text2: 'Please insure Addhar have both side photos',
      });
      return;
    }
    if (documents.drivingLicense.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Missing Complete Driving License',
        text2: 'Please insure Driving License have both side photos',
      });
      return;
    }
    if (missingDocs) {
      Toast.show({
        type: 'error',
        text1: 'Missing Car Documents',
        text2: 'Please ensure all cars have RC, insurance, pollution papers and photos.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Documents Submitted!',
      text2: 'Your documents have been uploaded successfully.',
    });

    const user = useAuthStore.getState().user;

    const carDocs = {
      userId: user?._id,
      ...documents
    }

    const data = await auth(formData, carDocs, user?._id)


    if (data?.success) {
      await useAuthStore.getState().setUser(data.user);
      await useAuthStore.getState().setToken(data.token);
      router.push(`/(auth)/register`);

    }

  };

  const renderImageItem = (
    uri: string,
    type: DocumentType,
    index: number,
    carIndex?: number
  ) => (
    <Pressable key={index} onPress={() => setPreview(uri)} className="relative mr-3">
      <Image source={{ uri }} className="w-28 h-28 rounded-lg border border-gray-300" />
      <TouchableOpacity
        onPress={() => removeDocument(type, index, carIndex)}
        className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
    </Pressable>
  );

  const renderMultiSection = (
    title: string,
    type: 'drivingLicense' | 'addhar'
  ) => (
    <View className="mb-6 bg-white p-5 rounded-2xl shadow-md">
      <Text className="text-xl font-semibold text-gray-800 mb-3">{title}</Text>

      {documents[type].length > 0 ? (
        <View className="flex-row mb-3">
          {documents[type].map((uri, index) => renderImageItem(uri, type, index))}
        </View>
      ) : (
        <Text className="text-gray-500 italic mb-3">No {title.toLowerCase()} uploaded.</Text>
      )}

      {/* Only show add button if less than 2 images */}
      {documents[type].length < 2 && (
        <TouchableOpacity
          onPress={() => pickImage(type)}
          className="flex-row items-center bg-black px-4 py-2 rounded-xl shadow-sm active:scale-[0.98]"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white ml-2 font-semibold">
            {documents[type].length === 0 ? `Add ${title}` : `Add ${title} Back Side`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Show hint text */}
      {documents[type].length === 1 && (
        <Text className="text-gray-500 text-sm mt-2">
          Please add the back side of your {title.toLowerCase()} document.
        </Text>
      )}
    </View>
  );

  const renderCarSection = (index: number) => {
    const rcDoc = documents.rc[index]?.url || '';
    const insuranceDoc = documents.insurance[index]?.url || '';
    const pollutionDoc = documents.pollutionPaper[index]?.url || '';
    const photoItems = documents.carPhoto[index]?.url || [];

    return (
      <View key={index} className="mb-6 bg-white p-5 rounded-2xl shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">Car {index + 1}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveCar(index)}
            className="bg-red-500 px-3 py-1 rounded-lg shadow-sm active:scale-[0.98]"
          >
            <Text className="text-white font-semibold">Remove Car</Text>
          </TouchableOpacity>
        </View>

        {/* Single Document Types */}
        {[
          { title: 'RC Document', doc: rcDoc, type: 'rc' },
          { title: 'Insurance Document', doc: insuranceDoc, type: 'insurance' },
          { title: 'Pollution Paper', doc: pollutionDoc, type: 'pollutionPaper' },
        ].map(({ title, doc, type }) => (
          <View key={type} className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">{title}</Text>
            {doc ? (
              renderImageItem(doc, type as DocumentType, 0, index)
            ) : (
              <Text className="text-gray-500 italic mb-2">No {title.toLowerCase()} uploaded.</Text>
            )}
            <TouchableOpacity
              onPress={() => pickImage(type as DocumentType, index, false)}
              className="flex-row items-center bg-black px-4 py-2 rounded-xl shadow-sm active:scale-[0.98] mt-2"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold">Add {title}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Car Photos - Multiple allowed */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">Car Photos</Text>
          {photoItems.length > 0 ? (
            <FlatList
              data={photoItems}
              horizontal
              keyExtractor={(_, i) => `carPhoto-${index}-${i}`}
              renderItem={({ item, index: idx }) =>
                renderImageItem(item, 'carPhoto', idx, index)
              }
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text className="text-gray-500 italic mb-2">No car photos uploaded.</Text>
          )}
          <TouchableOpacity
            onPress={() => pickImage('carPhoto', index, true)}
            className="flex-row items-center bg-black px-4 py-2 rounded-xl shadow-sm active:scale-[0.98] mt-2"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Add Car Photos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleAddCar = () => {
    setDocuments((prev) => ({
      ...prev,
      rc: [...prev.rc, { url: '' }],
      insurance: [...prev.insurance, { url: '' }],
      pollutionPaper: [...prev.pollutionPaper, { url: '' }],
      carPhoto: [...prev.carPhoto, { url: [] }],
    }));
  };

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100 p-4">
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
        <Text className="text-2xl font-bold mb-6 text-gray-900 mt-6">Car Documents</Text>

        {/* Universal sections - now with multiple image support */}
        {renderMultiSection('Driving License', 'drivingLicense')}
        {renderMultiSection('Aadhar Card', 'addhar')}

        {/* Dynamic Cars */}
        {documents.rc.map((_, index) => renderCarSection(index))}

        <TouchableOpacity
          onPress={handleAddCar}
          className="bg-black py-3 rounded-xl mb-4 items-center active:scale-[0.98]"
        >
          <Text className="text-white text-base font-bold">Add Car</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid}
          className={`py-4 rounded-xl mt-6 mb-8 items-center active:scale-[0.98] ${!isFormValid ? "bg-neutral-300" : "bg-black"}`}
        >
          <Text className={`text-lg font-bold ${!isFormValid ? "text-gray-600" : "text-white"}`}>
            Submit Documents
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={!!preview} transparent animationType="fade">
        <View className="flex-1 bg-black/90 justify-center items-center px-6">
          <TouchableOpacity onPress={() => setPreview(null)} className="absolute top-10 right-6">
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
          {preview && (
            <Image
              source={{ uri: preview }}
              className="w-full h-[80%] rounded-xl border border-white"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <Toast />
    </>
  );
}