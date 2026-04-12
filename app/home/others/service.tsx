import { Back } from "@/components/auth/pattern";
import { IconCircle } from "@/components/home";
import { Gallery, ServiceDescription } from "@/components/home/service";
import BookService from "@/components/modal/bookService";
// import BottomModal from "@/components/modal/bottomModal";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, Text } from "react-native";
import { Image, useWindowDimensions, View } from "react-native";

export default function OtherServices() {
    const headImage = 250;
    const { height } = useWindowDimensions();
    const adjustedHeight = height - headImage + 40;
    const initialLayout = Dimensions.get("window").width - 35;

    const [activeTab, setActiveTab] = useState("Service Description");
    const tabOffsetValue = useRef(new Animated.Value(0)).current;

    const handleTabPress = (tabName: any, index: any) => {
        setActiveTab(tabName);
        Animated.spring(tabOffsetValue, {
            toValue: index,
            useNativeDriver: true,
        }).start();
    };
    const [showingModal, setModal] = useState("");
    const modal: any = {
        bookService: <BookService setShowing={setModal} />,
    };

    return (
        <View>
            <View style={{ height: headImage }}>
                <Image
                    source={require("@/assets/images/more/laundry.png")}
                    className={`w-full h-full`}
                />
                <View className="w-full h-full bg-black absolute top-0 left-0 opacity-25"></View>
                <View className="flex absolute top-0 left-0 mt-16 px-3 flex-row justify-between z-50 w-full items-center  mb-8">
                    <Back />
                    <View className="flex flex-row items-center ">
                        <IconCircle
                            onPress={() => {}}
                            iconName="share"
                            className="mr-3"
                        />
                        <IconCircle
                            onPress={() => {}}
                            iconName="favorite"
                            className="mr-3"
                        />
                    </View>
                </View>
            </View>
            <View
                className={`w-full -mt-10 !text-white rounded-[40px] overflow-hidden pt-5`}
                style={{ height: adjustedHeight }}
            >
                <View className="px-4 pb-3">
                    <View className=" flex w-full flex-row items-center justify-between mt-4 pr-5 ">
                        <Image
                            source={require("@/assets/images/user1.png")}
                            className={`w-16 h-16`}
                        />
                        <Text
                            // numberOfLines={2}
                            className="!font-bold !text-3xl ml-4"
                        >
                            Chicken Double Sausage Sharwama
                        </Text>
                    </View>
                </View>
                <View className="flex-1">
                    {/* Top Navigation Bar */}
                    <View className="flex-row mx-4 mb-4 bg-gray-100 dark:bg-slate-700 relative  rounded-full mt-2">
                        <Pressable
                            onPress={() =>
                                handleTabPress("Service Description", 0)
                            }
                            className={`flex-1 p-3 py-4 z-50 rounded-full`}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    activeTab === "Service Description"
                                        ? "text-indigo-800"
                                        : "text-gray-500 dark:text-gray-200"
                                }`}
                            >
                                Service Description
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleTabPress("Gallery", 1)}
                            className={`flex-1 p-3 py-4 z-50 rounded-full `}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    activeTab === "Gallery"
                                        ? "text-indigo-800"
                                        : "text-gray-500 dark:text-gray-200"
                                }`}
                            >
                                Gallery
                            </Text>
                        </Pressable>
                        <Animated.View
                            className="absolute bg-indigo-100 h-full w-1/2 ml-1 rounded-full z-10"
                            style={{
                                transform: [
                                    {
                                        translateX: tabOffsetValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [
                                                -3,
                                                initialLayout / 2,
                                            ],
                                        }),
                                    },
                                ],
                            }}
                        />
                    </View>

                    {/* Animated Indicator */}

                    {/* Content Area */}
                    <View className="flex-1 justify-center items-center">
                        {activeTab === "Service Description" && (
                            <ServiceDescription />
                        )}
                        {activeTab === "Gallery" && <Gallery />}
                    </View>
                </View>
                <ThemedPressable
                    onPress={() => setModal("bookService")}
                    label="Book our Services"
                    className="h-16 rounded-full text-center !text-4xl my-5 mb-7 mx-5"
                />
            </View>

            {/* <BottomModal
                isVisible={Boolean(showingModal)}
                component={modal[showingModal]}
                setShowing={setModal}
            /> */}
        </View>
    );
}
