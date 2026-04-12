import { RoundedTextInput } from "@/components/form/TextInput";
import { IconCircle } from "@/components/home";
import Service from "@/components/home/service";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, useWindowDimensions, View } from "react-native";

export type Props = {
    close: any;
};
export default function Search({ close }: Props) {
    const { height } = useWindowDimensions();
    const adjustedHeight = height - 120;
    return (
        <ThemedView
            darkColor="#000"
            lightColor="#fff"
            className="w-full !rounded-t-3xl overflow-hidden"
            style={{ height: adjustedHeight }}
        >
            <View className="flex flex-row justify-between h-14 px-5 items-center">
                <Pressable
                    onPress={() => close(false)}
                    className="rounded-full flex justify-center w-8 h-8 bg-gray-400 items-center"
                >
                    <MaterialIcons name="close" color="white" size={18} />
                </Pressable>
                <ThemedText className="!text-2xl  !font-bold">
                    Search
                </ThemedText>
                <Pressable
                    onPress={() => close(false)}
                    className="rounded-full flex justify-center  items-center"
                >
                    <Image
                        source={require("@/assets/images/misc/filter.png")}
                        className="w-6 h-6"
                    />
                </Pressable>
            </View>
            <View className="px-2">
                <RoundedTextInput
                    placeholder="Search Categories"
                    className="mb-2 !h-12"
                />
            </View>
            <ScrollView className="mb-20 h-80 z-0 !relative  px-5">
                <ThemedView>
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                    <Service />
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}
