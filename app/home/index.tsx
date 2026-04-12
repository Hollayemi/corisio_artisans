import {
    HomeCategory,
    HomePattern,
    IconCircle,
    LookingForFood,
    User,
} from "@/components/home";
import Service from "@/components/home/service";
// import BottomModal from "@/components/modal/bottomModal";
import Slider from "@/components/slider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import Search from "./search";
import themeConfig, { services } from "@/config/themeConfig";
import { useUserData } from "@/hooks/useData";
import HomeWrapper from "@/components/wrapper";

export default function Landing() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState(false);
    const { userInfo } = useUserData() as any;
    return (
        <HomeWrapper className="relative" page="home">
            <View className="">
                <View className="px-2 h-64 !relative w-[100%] ml !bg-['#181818'] rounded-b-[20%] overflow-hidden">
                    <HomePattern />
                    <View className="flex flex-row justify-between z-50  w-full items-center mt-16">
                        <User name={`Hi, ${userInfo.fullname}`} theme="dark" />
                        <View className="flex flex-row items-center ">
                            <IconCircle
                                onPress={() => setSearch(true)}
                                fixedBg="dark"
                                icon={
                                    <Image
                                        source={require("@/assets/images/search-normal.png")}
                                        className="w-6 h-6"
                                    />
                                }
                                className="mr-5"
                            />
                            <IconCircle
                                onPress={() => {}}
                                fixedBg="dark"
                                icon={
                                    <Image
                                        source={
                                            themeConfig("dark").notification
                                        }
                                        className="w-6 h-6"
                                    />
                                }
                            />
                            {/* <HomePattern /> */}
                        </View>
                    </View>

                    <ThemedText className="!text-xl !font-bold !text-['#A5A5A5'] !mt-4 ml-4">
                        Promotions Ads
                    </ThemedText>
                </View>
                <Slider
                    itemsPerView={1.1}
                    interval={7000}
                    className="!-mt-32 !-mb-2"
                    // dots
                >
                    <Image
                        source={require("@/assets/images/productOff.png")}
                        className="!w-full h-36 rounded-xl !px-2"
                    />
                    <Image
                        source={require("@/assets/images/slider1.png")}
                        className="!w-full h-36 rounded-xl px-2"
                    />
                    <Image
                        source={require("@/assets/images/slider2.png")}
                        className="!w-full h-36 rounded-xl px-2"
                    />
                </Slider>
            </View>
            <ScrollView className=" z-0 !relative">
                <ThemedView className="px-3">
                    <LookingForFood />
                    <ThemedView className="flex flex-row items-center my-4">
                        <Slider
                            itemsPerView={2.8}
                            interval={7000}
                            className="!h-16"
                        >
                            <HomeCategory
                                icon="all"
                                label="All"
                                selected={filter}
                                setSelected={setFilter}
                            />
                            <HomeCategory
                                icon="hair"
                                label="Hair Salon"
                                selected={filter}
                                setSelected={setFilter}
                            />
                            <HomeCategory
                                icon="barber"
                                label="Barbing"
                                selected={filter}
                                setSelected={setFilter}
                            />
                            <HomeCategory
                                icon="laundry"
                                label="Laundry"
                                selected={filter}
                                setSelected={setFilter}
                            />
                            <HomeCategory
                                icon="food"
                                label="Food"
                                selected={filter}
                                setSelected={setFilter}
                            />
                        </Slider>
                    </ThemedView>
                    <ThemedView>
                        {Object.values(services).map((each: any, i: any) => (
                            <Service image={each} key={i} />
                        ))}
                    </ThemedView>
                </ThemedView>
            </ScrollView>

            {/* {search && (
                <BottomModal
                    isVisible={search}
                    component={<Search close={setSearch} />}
                    setShowing={setSearch}
                />
            )} */}
        </HomeWrapper>
    );
}
