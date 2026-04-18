import Button from "@/components/form/Button";
import { useSendOtpMutation, AuthParty } from "@/redux/authService/authSlice";
import { normalisePhone } from "@/utils/format";
import { Route, router } from "expo-router";
import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface PhoneNumberInputProps {
    party: AuthParty;
    nextScreen: Route;
    type: "create-account" | "login";
    categories?: string;
}

export function PhoneNumberInput({ party, nextScreen, type, categories }: PhoneNumberInputProps) {
    const [phone, setPhone]     = useState("");
    const [error, setError]     = useState("");
    const inputRef              = useRef<TextInput>(null);
    const [sendOtp, { isLoading }] = useSendOtpMutation();

    const formatDisplay = (digits: string): string => {
        const d = digits.slice(0, 11);
        if (d.length <= 4) return d;
        if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
        return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    };

    const validate = (): boolean => {
        if (phone.replace(/\D/g, "").length < 10) {
            setError("Please enter a valid Nigerian phone number");
            return false;
        }
        setError("");
        return true;
    };

    const handleSend = async () => {
        if (!validate()) return;
        const phoneNumber = normalisePhone(phone);
        try {
            await sendOtp({
                phoneNumber,
                party,
                category: categories ? JSON.parse(categories) : undefined,
            }).unwrap();

            router.push({
                pathname: nextScreen as any,
                params: { phoneNumber, party, type, categories },
            });
        } catch (err: any) {
            const status = err?.status;
            if (status === 429) {
                setError("Too many requests. Try again in 10 minutes.");
            } else {
                setError(err?.data?.message ?? "Could not send OTP. Check your connection.");
            }
        }
    };

    return (
        <View className="px-6 mt-2">
            {/* Phone input */}
            <View
                className={`flex-row items-center border-2 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden ${
                    error ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-700"
                }`}
            >
                <View className="flex-row items-center px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                    <Text className="text-xl mr-1">🇳🇬</Text>
                    <Text className="text-[15px] font-semibold text-gray-700 dark:text-gray-300 ml-1">+234</Text>
                </View>
                <TextInput
                    ref={inputRef}
                    className="flex-1 px-4 py-4 text-[16px] text-gray-900 dark:text-white"
                    placeholder="0XX XXXX XXXX"
                    placeholderTextColor="#9CA3AF"
                    value={formatDisplay(phone)}
                    onChangeText={(t) => { setPhone(t.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                    keyboardType="phone-pad"
                    maxLength={14}
                    returnKeyType="done"
                    onSubmitEditing={handleSend}
                />
            </View>

            {error ? <Text className="text-red-500 dark:text-red-400 text-[12px] mt-2 ml-1">{error}</Text> : null}

            <View className="mt-4 bg-blue-50 dark:bg-blue-950 rounded-xl px-4 py-3 flex-row items-start">
                <Text className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">ℹ️</Text>
                <Text className="text-[13px] text-blue-700 dark:text-blue-300 flex-1 leading-5">
                    A 6-digit code will be sent via SMS. Standard rates may apply.
                </Text>
            </View>

            <View className="mt-8">
                <Button
                    title="Send OTP"
                    onPress={handleSend}
                    isLoading={isLoading}
                    loadingText="Sending…"
                    disabled={phone.replace(/\D/g, "").length < 10 || isLoading}
                />
            </View>
        </View>
    );
}
