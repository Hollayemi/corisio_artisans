import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Pattern, { PhoneNumber } from '../business/auth/component';


export const SocialButton = ({ icon, label, onPress, backgroundColor = "bg-white" }: any) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${backgroundColor} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-6 flex-row items-center justify-center mb-3`}
        >
            <Ionicons name={icon} size={20} color="#4285F4" />
            <Text className="text-gray-700 dark:text-gray-300 font-medium ml-3">
                {label}
            </Text>
        </TouchableOpacity>
    );
};



export const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const { from, ...pages } = useLocalSearchParams<{
        from?: string;
    }>();

    console.log("Login from:", from, "Available pages:", pages);

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#2A347E] dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="w-full h-20 opacity-40 absolute">
                    <Pattern />
                </View>
                <ScrollView
                    className="flex-1 "
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View className="flex-1 justify-end  pt-12 ">
                        <View className="mb-12 px-6">
                            <Text className="text-4xl font-bold text-white dark:text-white mb-4 leading-tight">
                                Welcome Back {from}
                            </Text>
                            <Text className="text-[13px] text-white dark:text-gray-300 leading-relaxed">
                                Changing and easing the way you connect with professional services and order food.
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="bg-white dark:bg-gray-800 rounded-t-3xl py-4 shadow-lg">
                            <PhoneNumber
                                pathname="/auth/PhoneVerify"
                                data={{ from: from || "user", type: "login" }}
                            />
                            <View className="flex-row justify-center pt-4">
                                <Text className="text-gray-600 dark:text-gray-400">
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity onPress={() => router.push({
                                    pathname: from === "user" ? '/auth/PhoneEntry' : '/business/auth/Category',
                                    params: { from: from || "user", type: "login" }
                                })} className="ml-1">
                                    <Text className="!text-yellow-500 dark:text-white font-semibold">
                                        Register
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ height: insets.bottom }} className="bg-white dark:bg-gray-800" />
        </SafeAreaView>
    );
};

export default function App() {
    return <LoginScreen />;
}