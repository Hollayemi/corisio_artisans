import { Image, ScrollView, Text, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
// import { Comments } from "./restaurant";
import { services } from "@/config/themeConfig";

export default function Service({ image }: any) {
    return (
        <ThemedView className="mb-8">
            <View className="w-full h-32 rounded-3xl overflow-hidden relative">
                <Image source={image} className="h-full w-full " />
                <ThemedView className="w-12 h-12 !bg-white rounded-full absolute bottom-5 right-5 flex justify-center items-center">
                    <IconSymbol name="heart.fill" color="orange" />
                </ThemedView>
            </View>
            <View className="p-2">
                <Link href="/user">
                    <ThemedText
                        numberOfLines={1}
                        className="!font-bold !text-2xl"
                    >
                        Chicken Double Sausage Sharwama
                    </ThemedText>
                </Link>
                <Text numberOfLines={1} className="!text-lg !text-gray-400">
                    Open (8am), Closes (7pm) Mon - Sat
                </Text>

                <View className="flex flex-row items-center justify-between mt-2">
                    <ThemedText className="!font-bold !text-2xl">
                        ₦2,600
                    </ThemedText>
                    <View className="flex flex-row items-center">
                        <IconSymbol name="star.fill" color="orange" size={18} />
                        <Text className="!text-lg !text-gray-400 ml-2">
                            4.0
                        </Text>
                    </View>
                </View>
            </View>
        </ThemedView>
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
                        className={`${
                            full.includes(i) ? "w-full h-44" : "w-1/2 h-52"
                        } p-3`}
                    >
                        <Image source={each} className={"w-full h-full rounded-xl"} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};