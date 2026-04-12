import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { ReactElement } from "react";
import { Link } from "expo-router";
import { Back } from "../auth/pattern";
import { useUserData } from "@/hooks/useData";
import { MaterialIcons } from "@expo/vector-icons";

export function HomePattern() {
    return (
        <View className="absolute z-10">
            <Image
                source={require("@/assets/images/gradient/home.png")}
                className="absolute -top-10 left-16 w-80 h-80"
            />
        </View>
    );
}
export type UserLocationProp = {
    name: string;
    back?: boolean;
    theme?: "dark" | "light";
};
export function User({ back, name, theme }: UserLocationProp) {
    const { openMenu } = useUserData() as any;
    return (
        <View className="flex flex-row items-center">
            {!back ? (
                <TouchableOpacity onPress={() => openMenu(true, 1)}>
                    <Image
                        source={require("@/assets/images/user1.png")}
                        className="w-14 h-14 rounded-full"
                    />
                </TouchableOpacity>
            ) : (
                <Back />
            )}
            <View className="ml-2.5">
                <Text className="!text-xl !text-gray-400">
                    {name}
                </Text>
                <View className="flex flex-row items-center">
                    <IconSymbol name="mappin.circle" color="red" size={18} />
                    <Text
                        className={`!font-bold ml-2 ${
                            theme === "dark" && "!text-white"
                        } !text-xl mr-1`}
                    >
                        Benin
                    </Text>
                    <IconSymbol name="chevron.down" color="white" size={15} />
                </View>
            </View>
        </View>
    );
}

export type IconCircleProps = {
    onPress: () => void;
    fixedBg?: "varies" | "dark" | "light";
    iconName?: keyof typeof MaterialIcons.glyphMap; // Ensure it's a valid icon name
    icon?: ReactElement;
    className?: string;
    size?: number;
};

export function IconCircle({
    onPress,
    fixedBg = "varies",
    icon,
    iconName,
    className,
    size = 12,
}: IconCircleProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`
                w-${size} h-${size} rounded-full flex items-center justify-center 
                border 
                ${
                    ["varies", "light"].includes(fixedBg)
                        ? "border-gray-300 bg-gray-200/60"
                        : "border-gray-600 bg-gray-700/60 "
                }
                ${
                    fixedBg === "varies" &&
                    "dark:border-gray-600 dark:bg-gray-700/60 "
                }
                backdrop-blur-3xl active:opacity-60 ${className}
            `}
        >
            {iconName ? (
                <MaterialIcons
                    name={iconName}
                    className="!text-gray-700 dark:!text-gray-200"
                    size={20}
                />
            ) : (
                icon && icon
            )}
        </Pressable>
    );
}

export function LookingForFood() {
    return (
        <View className="relative">
            <View className="w-full h-20 rounded-3xl !bg-['#FDB415'] shadow"></View>
            <Link
                href="/user"
                className="w-11/12 h-14 absolute top-3.5 left-4 z-20"
            >
                <Image
                    source={require("@/assets/images/to-food/frame-2.png")}
                    className="w-full h-full "
                />
            </Link>
            <Image
                source={require("@/assets/images/to-food/line.png")}
                className="w-11/12 h-16 absolute top-3 left-3"
            />
            <Image
                source={require("@/assets/images/to-food/flame.png")}
                className="w-5 h-5  absolute top-2 left-1/2 !ml-10"
            />
        </View>
    );
}
export type HomeCategory = {
    icon: string;
    label: string;
    selected: string;
    setSelected: any;
};
export function HomeCategory({
    icon,
    label,
    setSelected,
    selected,
}: HomeCategory) {
    const icons: any = {
        all: require("@/assets/images/misc/all-components.png"),
        food: require("@/assets/images/misc/food-component.png"),
        hair: require("@/assets/images/misc/hair-component.png"),
        barber: require("@/assets/images/misc/barber-component.png"),
        laundry: require("@/assets/images/misc/laundry-component.png"),
    };
    const isSelected = selected === label;
    const { isLight } = useUserData() as any;

    return (
        <Pressable
            onPress={() => setSelected(label)}
            className={`w-36 h-14 rounded-full  ${
                isSelected
                    ? "!bg-['#FFE9B8']  !border-['#FDB415']"
                    : ` border border-gray-300 dark:border-gray-600 `
            } justify-left flex flex-row justify-center !items-center px-3`}
        >
            <Image source={icons[icon]} className="!w-8 !h-8" />
            <Text
                className={`!text-xl ml-2 w-fit text-gray-500 dark:text-gray-200 ${
                    isSelected && "!text-black"
                }`}
            >
                {label}
            </Text>
        </Pressable>
    );
}

export function UnusedCoupons() {
    return (
        <View className="w-full border border-orange-500  mb-4 overflow-hidden relative h-20 rounded-full bg-[#2A347E] flex flex-row justify-between items-center px-3">
            <View className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-black">
                <Image source={require("@/assets/images/misc/coupon.png")} />
            </View>
            <Text className="text-white text-xl w-52">
                You still have unused food and food dekivery coupons
            </Text>
            <Pressable className="w-24 h-12 rounded-full bg-white z-50 outline-none !text-blue-500 flex items-center justify-center border-2 border-black">
                <Text className="font-bold text-[16px] text-[#2A347E]">
                    Use now
                </Text>
            </Pressable>
            <Image
                source={require("@/assets/images/misc/line1.png")}
                className="w-40 h-20 absolute top-0 !right-20 "
            />
        </View>
    );
}
