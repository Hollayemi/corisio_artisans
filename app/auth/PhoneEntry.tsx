import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PageHeader, PhoneNumber } from "../business/auth/component";

// Strip non-digits, remove leading zero, prepend +234
type from = "user" | "business";
export default function PhoneEntry() {
    const { categories, from } = useLocalSearchParams<{ categories: string, from:from  }>();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ProgressHeader currentStep={2} />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-6">
                        <PageHeader
                            title="What's Your Number?"
                            subtitle={`We'll send a one-time code to verify your ${from === "user" ? "account" : "store"}. No spam.`}
                        />
                        <PhoneNumber pathname="/auth/PhoneVerify" data={{categories: categories ?? {}, type:"create-account", from }} />

                        <View className="mt-6 flex-row justify-center">
                            <Text className="text-gray-500 dark:text-gray-400">
                                Already registered?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/auth/Login")}>
                                <Text className="text-yellow-500 dark:text-yellow-400 font-semibold">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
