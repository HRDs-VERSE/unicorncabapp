import useAzureAPI from '@/apiHook/useAzureAPI';
import useCarDocumentAPI from '@/apiHook/useCarDocumentAPI';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

interface CarDocumentsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface DocumentState {
    drivingLicense: string[];
    addhar: string[];
    rc: { url: string }[];
    insurance: { url: string }[];
    pollutionPaper: { url: string }[];
    carPhoto: { url: string[] }[];
}

type DocumentType =
  | 'drivingLicense'
  | 'rc'
  | 'insurance'
  | 'addhar'
  | 'pollutionPaper'
  | 'carPhoto';


const CarDocumentsModal: React.FC<CarDocumentsModalProps> = ({ visible, onClose }) => {
    const { getCarDocuments, updateCarDocument } = useCarDocumentAPI();
    const { user } = useAuthStore();
    const { uploadToAzure, deleteFromAzure } = useAzureAPI();

    const [preview, setPreview] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [documentId, setDocumentId] = useState<string>();
    const [documents, setDocuments] = useState<DocumentState>({
        drivingLicense: [],
        addhar: [],
        rc: [],
        insurance: [],
        pollutionPaper: [],
        carPhoto: [],
    });

    const isVerified = user?.isDocumentVerified;

    // Define dynamic colors
    const bgColor = isVerified ? "#d1fae5" : "#fee2e2";     // green or red background
    const borderColor = isVerified ? "#86efac" : "#fca5a5"; // green or red border
    const textColor = isVerified ? "#047857" : "#b91c1c";   // green or red text
    const labelText = isVerified ? "verified" : "unverified";

    const [selectedImage, setSelectedImage] = useState<string | null>(null); // New state for selected image

    useEffect(() => {
        if (visible) {
            fetchCarDocs();
        }
    }, [visible]);

    const fetchCarDocs = async () => {
        try {
            const res = await getCarDocuments(user?._id);
            setDocumentId(res.documents?._id)
            setDocuments({
                drivingLicense: res.documents?.drivingLicense,
                addhar: res.documents?.addhar,
                rc: res.documents?.rc,
                insurance: res.documents?.insurance,
                pollutionPaper: res.documents?.pollutionPaper,
                carPhoto: res.documents?.carPhoto
            });
        } catch (error) {
            console.log('Error fetching car documents:', error);
        }
    };



    useEffect(() => {
        const isValid =
            documents.drivingLicense.length > 0 &&
            documents.addhar.length > 0 &&
            documents.rc.length > 0 &&
            documents.insurance.length > 0 &&
            documents.pollutionPaper.length > 0 &&
            documents.carPhoto.length > 0;
        setIsFormValid(isValid);
    }, [documents]);

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

        const data = await updateCarDocument(user?._id, documents)
    
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
            <Modal
                isVisible={visible}
                onBackdropPress={onClose}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={800}
                style={{ justifyContent: 'flex-end', margin: 0, height: '50%' }}
            >
                <View className="max-h-[50%] bg-white rounded-[10px] p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className='flex-row items-center gap-2'>
                            <Text className="text-lg font-semibold">Car Documents</Text>
                            <View
                                className="flex items-center text-[.8rem] py-1 px-2 rounded-full"
                                style={{
                                    backgroundColor: bgColor,
                                    borderColor: borderColor,
                                    borderWidth: 2,
                                    borderStyle: "solid"
                                }}
                            >
                                <Text
                                    className="rounded-full text-[.7rem]"
                                    style={{
                                        color: textColor,
                                    }}
                                >
                                    {labelText}
                                </Text>
                            </View>

                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-red-500 font-semibold">Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* <Section title="RC" images={documents?.rc?.map((item: any) => item.url)} onImageClick={setSelectedImage} />

                        <Section title="Insurance" images={documents?.insurance?.map((item: any) => item.url)} onImageClick={setSelectedImage} />

                        <Section title="Pollution Paper" images={documents?.pollutionPaper?.map((item: any) => item.url)} onImageClick={setSelectedImage} />

                        {documents?.carPhoto?.length > 0 && (
                            <Section title="Car Photos" images={documents?.carPhoto[0]?.url} onImageClick={setSelectedImage} />
                        )} */}

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
                                    Update Documents
                                  </Text>
                                </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal for displaying selected image in full screen */}
            {selectedImage && (
                <Modal
                    isVisible={!!selectedImage}
                    onBackdropPress={() => setSelectedImage(null)}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    backdropColor=''
                >
                    <View className='bg-black/10'>
                        <TouchableOpacity onPress={() => setSelectedImage(null)}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={{ width: 400, height: 400, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}

            <Modal isVisible={!!preview}>
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
        </>
    );
};

const Section = ({ title, images, onImageClick }: { title: string; images: string[]; onImageClick: (url: string) => void }) => {
    if (!images || images.length === 0) return null;

    return (
        <View className="mb-4">
            <Text className="text-base font-medium mb-2">{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((imgUrl, idx) => (
                    <TouchableOpacity key={idx} onPress={() => onImageClick(imgUrl)}>
                        <Image
                            source={{ uri: imgUrl }}
                            style={{ width: 80, height: 80, resizeMode: 'contain' }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};



export default CarDocumentsModal;
