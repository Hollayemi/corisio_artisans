import { Image, Pressable, Text, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserData } from "@/hooks/useData";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";

export type Props = {};

export default function Pattern({}: Props) {
    return (
        <ThemedView className="relative opacity-100">
            <Image
                source={require("@/assets/images/gradient/auth1.png")}
                className="!absolute -top-20 left-0"
            />
            <Image
                source={require("@/assets/images/gradient/auth2.png")}
                className="!absolute -top-10 left-0"
            />
        </ThemedView>
    );
}

export function Back({
    label,
    labelClass,
}: {
    label?: string;
    labelClass?: string;
}) {
    const router = useRouter();

    return (
        <View className="flex-row items-center ">
            <Pressable
                onPress={() => router.back()}
                style={[]}
                className={`
                w-14 h-14 rounded-full flex items-center justify-center 
                bg-gray-200/60 dark:bg-gray-700/60 
                border border-gray-300 dark:border-gray-600 
                backdrop-blur-3xl active:opacity-60
            `}
            >
                <MaterialIcons
                    name="arrow-back"
                    className="!text-gray-700 dark:!text-gray-200 "
                    size={20}
                />
            </Pressable>

            {label && (
                <ThemedText className={` ml-5 font-bold text-2xl ${labelClass}`}>
                    {label}
                </ThemedText>
            )}
        </View>
    );
}
