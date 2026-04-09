import Button from "@/components/form/Button";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import useImageUploader from "@/hooks/useStoreImageUploader";
import { router } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PageHeader, ProfileGuidelines, ProfilePictureUpload } from "./component";
import { Ionicons } from "@expo/vector-icons";

// Screen 4: Set Up Profile Picture
export default function SetUpProfilePictureScreen() {
    const [profileImage, setProfileImage] = useState([]);
    const { handleUpload, localFiles, uploading, setLocalFiles, removeImage } = useImageUploader("gallery", setProfileImage)
    let emptyImageSelector = localFiles.length !== 0 ? 4 - localFiles.length : 4
    if (emptyImageSelector < 0) emptyImageSelector = 0

      const handleRemoveImegeLink = (link: string) => {
        setLocalFiles((prev) => ({
            ...prev,
            images: prev.filter((img) => img !== link),
        }));
    }

    console.log("profileImage=>>>>>>>", profileImage)
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ProgressHeader
                currentStep={5}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="pt-6">
                    <PageHeader
                        title="Set Up Your Business Images"
                        subtitle="Now that your basic details and service availability are set, let’s complete your profile so customers can easily find and book your services."
                    />

                    <View className="px-6 mt-5">

                        {/* Image Preview Grid */}
                        <View className="flex-row flex-wrap">
                            {localFiles?.map((each: string, i) => (
                                <View key={i} className="w-1/2 p-2">
                                    <View className="relative">
                                        <Image
                                            source={{ uri: each }}
                                            className="w-full h-28 rounded-lg bg-gray-200 dark:bg-gray-700"
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleRemoveImegeLink(each)}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                                        >
                                            <Ionicons
                                                name="close"
                                                size={14}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            {Array.from({ length: emptyImageSelector }).map((_, index) => (
                                <View key={index} className="w-1/2 p-1">

                                    {localFiles[index] ? (
                                        <View className="relative">
                                            <Image
                                                source={{ uri: localFiles[index] }}
                                                className="w-full h-28 rounded-lg bg-gray-200 dark:bg-gray-700"
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                                            >
                                                <Ionicons
                                                    name="close"
                                                    size={14}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleUpload(4)}
                                            className="w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center"
                                        >
                                            <Text className="text-gray-400 text-2xl">+</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View className="px-6 pb-6 pt-4">
                <Button
                    title="Continue to Availability Setup"
                    onPress={async () => { router.push({ pathname: "/business/auth/Availability", params: { type: 'registration' } }); }}
                    className="w-full"
                    isLoading={uploading}
                // disabled={!profileImage}
                />
            </View>
        </SafeAreaView>
    );
};