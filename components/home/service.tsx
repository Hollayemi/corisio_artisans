import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { services } from "@/config/themeConfig";

export const mechanicsData = [
    {
        id: 1,
        name: "AutoCare Pro Workshop",
        mechanicName: "John Smith",
        specialty: "Engine & Transmission",
        experience: "8 years",
        rating: 4.8,
        price: "₦15,000",
        openTime: "8am",
        closeTime: "8pm",
        daysOpen: "Mon - Sat",
        location: "Ikeja, Lagos",
        phone: "+234 801 234 5678",
        distance: "1.2 km away",
        available: true,
    },
    {
        id: 2,
        name: "QuickFix Auto Solutions",
        mechanicName: "Michael Okafor",
        specialty: "Electrical & AC Repair",
        experience: "5 years",
        rating: 4.5,
        price: "₦12,000",
        openTime: "7am",
        closeTime: "9pm",
        daysOpen: "Mon - Sun",
        location: "Victoria Island, Lagos",
        phone: "+234 802 345 6789",
        distance: "2.5 km away",
        available: true,
    },
    {
        id: 3,
        name: "Elite Mechanics Hub",
        mechanicName: "David Adeyemi",
        specialty: "Brakes & Suspension",
        experience: "10 years",
        rating: 4.9,
        price: "₦18,000",
        openTime: "8am",
        closeTime: "7pm",
        daysOpen: "Mon - Fri",
        location: "Lekki Phase 1, Lagos",
        phone: "+234 803 456 7890",
        distance: "4.0 km away",
        available: false,
    },
    {
        id: 4,
        name: "24/7 Mobile Mechanics",
        mechanicName: "Emmanuel Nwachukwu",
        specialty: "General Diagnostics",
        experience: "6 years",
        rating: 4.6,
        price: "₦10,000",
        openTime: "24hrs",
        closeTime: "24hrs",
        daysOpen: "Mon - Sun",
        location: "Gbagada, Lagos",
        phone: "+234 804 567 8901",
        distance: "3.8 km away",
        available: true,
    },
    {
        id: 5,
        name: "Premium Auto Clinic",
        mechanicName: "Abdul Suleiman",
        specialty: "Luxury & Sports Cars",
        experience: "12 years",
        rating: 5.0,
        price: "₦25,000",
        openTime: "9am",
        closeTime: "6pm",
        daysOpen: "Mon - Sat",
        location: "Banana Island, Lagos",
        phone: "+234 805 678 9012",
        distance: "5.5 km away",
        available: true,
    },
];

export default function Service({ image, i, index }: any) {
    console.log(index)
    if (!mechanicsData[i]) return null;
    return (
        <View className="mb-6">
            <View className="w-full h-40 rounded-3xl overflow-hidden relative">
                <Image source={image} className="h-full w-full" />
                <View className={`absolute top-4 left-4 px-3 py-1 rounded-full ${mechanicsData[i].available ? 'bg-green-500' : 'bg-red-500'}`}>
                    <Text className="text-white text-xs font-bold">
                        {mechanicsData[i].available ? 'Available Now' : 'Busy'}
                    </Text>
                </View>

                <View className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs">
                        {mechanicsData[i].distance}
                    </Text>
                </View>

                <TouchableOpacity className="w-12 h-12 bg-white rounded-full absolute bottom-5 right-5 flex justify-center items-center">
                    <IconSymbol name="heart.fill" color="orange" size={20} />
                </TouchableOpacity>
            </View>

            <View className="p-2 mt-2 w-full">
                <Link href={`/user`}>
                    <View className="w-full">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <ThemedText
                                    numberOfLines={1}
                                    className="!font-bold !text-xl"
                                >
                                    {mechanicsData[i].name}
                                </ThemedText>
                            </View>
                            <View className="flex-row items-center">
                                <IconSymbol name="star.fill" color="orange" size={16} />
                                <Text className="!text-sm !text-gray-600 ml-1 font-bold">
                                    {mechanicsData[i].experience}
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row items-center justify-between mt-2">
                            <View>
                                <Text className="!text-base !text-gray-700 mt-1">
                                    {mechanicsData[i].specialty}
                                </Text>

                                <Text numberOfLines={1} className="!text-xs !text-gray-400 mt-1">
                                    Open ({mechanicsData[i].openTime}), Closes ({mechanicsData[i].closeTime}) {mechanicsData[i].daysOpen}
                                </Text>
                            </View>

                            <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full">
                                <Text className="text-white font-bold text-sm">
                                    Book Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Link>
            </View>
        </View>
    );
}

const IcontWithBgText = ({ icon, text }: any) => {
    return (
        <View className="flex-row items-center mb-6">
            <View className="w-14 h-14 rounded-xl !bg-gray-300 dark:!bg-slate-300 flex justify-center items-center ">
                {icon}
            </View>
            <ThemedText
                numberOfLines={2}
                className="!font-semibold !text-xl ml-4 w-4/5"
            >
                {text}
            </ThemedText>
        </View>
    );
};
const IconImageText = ({ text, image, bold }: any) => {
    return (
        <View className="flex-row items-start mb-4">
            <Image source={image} className="w-8 h-8" />
            <ThemedText
                numberOfLines={2}
                className=" !text-xl ml-6 w-4/5 "
            >
                <Text className="font-bold">{bold}</Text>
                {text}
            </ThemedText>
        </View>
    );
};
export const ServiceDescription = () => {
    return (
        <ScrollView className="px-4 py-3">
            <ThemedText numberOfLines={1} className="!font-bold !text-2xl">
                About UniqHemes
            </ThemedText>
            <Text className="leading-9 mt-4 text-[17px] !text-gray-600 dark:!text-slate-300">
                At UniqHemes Laundry and Cleaning Services, we provide
                top-quality laundry and cleaning solutions tailored to meet your
                needs. Whether you need a quick wash, deep stain removal, or
                premium fabric care, we’ve got you covered.
            </Text>

            <View className="mt-7">
                <IcontWithBgText
                    icon={<MaterialIcons name="location-pin" size={25} />}
                    text="Vertinary complex around solitary eatery old Omieran atijo street, Ilesa, Osun"
                />
                <IcontWithBgText
                    icon={<MaterialIcons name="star-border" size={25} />}
                    text="4.0 (62 reviews)"
                />
                <IcontWithBgText
                    icon={<MaterialIcons name="timer" size={25} />}
                    text="8:00 AM – 8:00 PM (Mon-Sat)"
                />
                <ThemedText
                    numberOfLines={1}
                    className="!font-bold !text-2xl !my-4"
                >
                    Services Offered
                </ThemedText>
                <IconImageText
                    image={require("@/assets/images/misc/tick-square.png")}
                    bold="Wash & Fold"
                    text="– Clothes washed, dried, and neatly folded."
                />
                <IconImageText
                    image={require("@/assets/images/misc/tick-square.png")}
                    bold="Ironing & Pressing"
                    text="– Wrinkle-free clothes, ready to wear."
                />
                <IconImageText
                    image={require("@/assets/images/misc/tick-square.png")}
                    bold="Dry Cleaning"
                    text="– Gentle cleaning for delicate fabrics."
                />
                <IconImageText
                    image={require("@/assets/images/misc/tick-square.png")}
                    bold="Bedding & Curtains Cleaning"
                    text="– Fresh and spotless home fabrics."
                />
                <IconImageText
                    image={require("@/assets/images/misc/tick-square.png")}
                    bold="Corporate & Bulk Services"
                    text="– Professional cleaning for offices and hotels."
                />
                <ThemedText
                    numberOfLines={1}
                    className="!font-bold !text-2xl !my-4"
                >
                    Pricing
                </ThemedText>
            </View>
            {/* <Comments /> */}
        </ScrollView>
    );
};


export const Gallery = ({ text, image, bold }: any) => {
    const full = [0, 5]
    return (
        <ScrollView className=" py-3 w-full">
            <View className="flex-row flex-wrap">
                {Object.values(services).map((each: any, i: any) => (
                    <View
                        className={`${full.includes(i) ? "w-full h-44" : "w-1/2 h-52"
                            } p-3`}
                    >
                        <Image source={each} className={"w-full h-full rounded-xl"} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};