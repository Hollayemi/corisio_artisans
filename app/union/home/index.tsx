import { SafeAreaView, Text, View } from "react-native";

export default function UnionHome() {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <View className="items-center px-8">
                <Text style={{ fontSize: 48 }}>✅</Text>
                <Text className="text-2xl font-bold text-[#2d6a2d] mt-4 text-center">
                    Welcome to Union Connect
                </Text>
                <Text className="text-gray-500 text-center mt-3 leading-6">
                    Your membership is active. Pay your daily ticket and access all union benefits.
                </Text>
            </View>
        </SafeAreaView>
    );
}
