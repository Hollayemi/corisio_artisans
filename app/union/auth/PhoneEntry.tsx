import { router } from "expo-router";
import React, { useRef, useState } from "react";
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
import UnionHeader from "./components/UnionHeader";

// ─── helpers ─────────────────────────────────────────────────────────────────

const isValidNigerianNumber = (raw: string): boolean => {
    const digits = raw.replace(/\D/g, "");
    // accept 11-digit starting with 0, or 10-digit (without leading 0)
    return /^0[7-9][0-1]\d{8}$/.test(digits) || /^[7-9][0-1]\d{8}$/.test(digits);
};

const formatDisplay = (digits: string): string => {
    const d = digits.slice(0, 11);
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
};

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PhoneEntry() {
    const [phone, setPhone] = useState("");
    const [touched, setTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const digits = phone.replace(/\D/g, "");
    const isValid = isValidNigerianNumber(digits);
    const showError = touched && digits.length >= 5 && !isValid;
    const canSubmit = isValid && !isLoading;

    const handleSend = async () => {
        setTouched(true);
        if (!isValid) return;
        setIsLoading(true);
        try {
            // TODO: call your send-OTP endpoint here
            await new Promise((r) => setTimeout(r, 800)); // simulated delay
            router.push({
                pathname: "/union/auth/PhoneVerify",
                params: { phone: digits },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <UnionHeader currentStep={1} showBack={false} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-8">
                        {/* Title */}
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            Create account
                        </Text>
                        <Text className="text-gray-500 text-[14px] mb-8 leading-5">
                            We'll send a one-time code to verify your number.
                        </Text>

                        {/* Phone label */}
                        <Text className="text-[14px] font-medium text-gray-700 mb-2">
                            Phone Number
                        </Text>

                        {/* Phone input */}
                        <TextInput
                            ref={inputRef}
                            value={formatDisplay(digits)}
                            onChangeText={(t) => {
                                setPhone(t.replace(/\D/g, "").slice(0, 11));
                                setTouched(false);
                            }}
                            onBlur={() => setTouched(true)}
                            keyboardType="phone-pad"
                            placeholder="09037748388"
                            placeholderTextColor="#9CA3AF"
                            maxLength={14}
                            returnKeyType="done"
                            onSubmitEditing={handleSend}
                            className={`rounded-xl px-4 h-14 text-[16px] text-gray-900 border ${
                                showError
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 bg-gray-50"
                            }`}
                        />

                        {/* Inline error */}
                        {showError && (
                            <Text className="text-red-500 text-[13px] mt-1">
                                Invalid Phone Number
                            </Text>
                        )}
                    </View>
                </ScrollView>

                {/* Bottom area */}
                <View className="px-6 pb-8 pt-4">
                    {/* Send Code button */}
                    <TouchableOpacity
                        onPress={handleSend}
                        activeOpacity={0.85}
                        disabled={!canSubmit}
                        className="rounded-full h-14 items-center justify-center mb-4"
                        style={{
                            backgroundColor: canSubmit ? "#2d6a2d" : "#4b4b4b",
                        }}
                    >
                        <Text className="text-white text-[16px] font-semibold">
                            {isLoading ? "Sending…" : "Send Code"}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign-in link */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-500 text-[14px]">
                            Already have account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/union/auth/PhoneEntry")}>
                            <Text className="text-[#2d6a2d] font-semibold text-[14px]">
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
