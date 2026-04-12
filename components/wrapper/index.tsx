import {
    Animated,
    Image,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    ViewProps,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconCircle } from "../home";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUserData } from "@/hooks/useData";
import themeConfig from "@/config/themeConfig";
// className = "absolute !left-0 !z-50 !bottom-[40px] w-full !h-20  !bg-red-500";
export function BottomTab({
    page,
    close,
}: {
    page: string;
    close: () => void;
}) {
    const router = useRouter();
    return (
        <View className=" flex justify-between !px-6  pt-4  !z-50  w-full">
            <TouchableOpacity
                onPress={() => {
                    router.push("/user");
                    close();
                }}
                className="flex-row items-center my-4"
            >
                <Ionicons
                    name="home-outline"
                    color={page === "home" ? "orange" : "white"}
                    size={20}
                />
                <Text
                    style={{ color: page === "home" ? "orange" : "white" }}
                    className="text-[16px] !font-bold ml-3"
                >
                    Home
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push("/user");
                    close();
                }}
                className="flex-row items-center my-4"
            >
                <Ionicons
                    name="fast-food-outline"
                    color={page === "food" ? "orange" : "white"}
                    size={20}
                />
                <Text
                    style={{ color: page === "food" ? "orange" : "white" }}
                    className="text-[16px] !font-bold ml-3"
                >
                    Food Court
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push("/user");
                    close();
                }}
                className="flex-row items-center my-4"
            >
                <MaterialIcons
                    name="accessible"
                    color={page === "order" ? "orange" : "white"}
                    size={20}
                />
                <Text
                    style={{ color: page === "order" ? "orange" : "white" }}
                    className="text-[16px] !font-bold ml-3"
                >
                    Orders / Bookings
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push("/user");
                    close();
                }}
                className="flex-row items-center my-4"
            >
                <Ionicons
                    name="cart-outline"
                    color={page === "cart" ? "orange" : "white"}
                    size={20}
                />
                <Text
                    style={{ color: page === "cart" ? "orange" : "white" }}
                    className="text-[16px] !font-bold ml-3"
                >
                    Cart
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push("/user");
                    close();
                }}
                className="flex-row items-center my-4"
            >
                <Ionicons
                    name="person-outline"
                    color={page === "profile" ? "orange" : "white"}
                    size={20}
                />
                <Text
                    style={{ color: page === "profile" ? "orange" : "white" }}
                    className="text-[16px] !font-bold ml-3"
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export type WrapperProps = ViewProps & {
    page: "home" | "order" | "cart" | "profile";
};

export default function HomeWrapper({ children, page }: WrapperProps) {
    const { menuValueOffset, openMenu, userInfo, bodyHeight, marginTopValue } =
        useUserData() as any;

    const { height, width } = useWindowDimensions();
    const deductFromHeight = themeConfig("light").deductFromHeight;
    const adjustedHeight = height - deductFromHeight;
    const dropShadow = {
        shadowColor: "#b0b7ec", // White shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // Adjust for visibility
        shadowRadius: 7, // More blur
        elevation: 5, // Required for Android
    };
    const closeMenu = () => openMenu(true, 0);
    return (
        <View className=" ">
            <LinearGradient
                colors={["#8392ff", "#28306d"]} // Define your gradient colors
                start={{ x: 0, y: 0 }} // Gradient start point (top-left)
                end={{ x: 0, y: 1 }} // Gradient end point (bottom-right)
            >
                <Image
                    source={require("@/assets/images/gradient/menu.png")}
                    style={{ width }}
                    className="absolute top-20 left-0 h-80"
                />

                <View
                    style={{ position: "absolute", top: 80, left: 36 }}
                    className="absolute z-50"
                >
                    <IconCircle
                        size={16}
                        iconName="close"
                        onPress={() => openMenu(true, 0)}
                    />
                </View>
                <View className="absolute h-screen flex justify-start !top-40">
                    <BottomTab close={closeMenu} page={page} />
                </View>
                <View className="flex-row items-center absolute bottom-0 mb-10 ml-6">
                    <Image
                        source={require("@/assets/images/user1.png")}
                        className={` w-12 h-12 rounded-full`}
                    />
                    <Text className="!font-bold !text-white  !text-2xl ml-2">
                        {userInfo.fullname}
                    </Text>
                </View>
                <View className=" h-screen w-full relative !z-10">
                    <View className="">
                        <View
                            style={{
                                height: adjustedHeight - 50,
                                marginTop: deductFromHeight / 2 + 25,
                                left: width - 140,
                                borderRadius: 40,
                                backgroundColor: "#8390F0",
                                ...dropShadow,
                            }}
                            className="w-32 z-50  "
                        ></View>
                        <View
                            style={{
                                height: adjustedHeight - 100,
                                marginTop: deductFromHeight / 2 + 50,
                                left: width - 170,
                                borderRadius: 40,
                                backgroundColor: "#8390F0",
                                ...dropShadow,
                            }}
                            className="bg-black w-36 absolute  "
                        ></View>
                    </View>
                </View>
            </LinearGradient>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateX: menuValueOffset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, width - 100],
                            }),
                        },
                    ],
                    height: bodyHeight || adjustedHeight,
                    marginTop: marginTopValue,
                    // left: width - 100,
                    borderRadius: 40,
                    overflow: "hidden",
                    ...dropShadow,
                    position: "absolute",
                }}
            >
                <View className="h-screen bg-white w-full">
                    {children}
                </View>
            </Animated.View>

            {/* <Text>lmc;skl;djlkhsdf</Text>
            <View className="!shadow !shadow-gray-400">
                <BottomTab page={page} />
            </View> */}
        </View>
    );
}
