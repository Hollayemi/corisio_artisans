// app/auth/PhoneVerify.tsx
// Single OTP verify screen for BOTH user and business.
// Navigates based on `party` and `type` params after success.

import Button from "@/components/form/Button";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import {
    useVerifyOtpMutation,
    useResendOtpMutation,
    AuthParty,
} from "@/redux/authService/authSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated, Keyboard, SafeAreaView, ScrollView,
    Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,
} from "react-native";
import { PageHeader } from "./user/component";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

export default function PhoneVerify() {
    const { phoneNumber, party = "user", type = "login", categories } = useLocalSearchParams<{
        phoneNumber: string;
        party: AuthParty;
        type: "login" | "create-account";
        categories?: string;
    }>();

    const [otp, setOtp]                 = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [countdown, setCountdown]     = useState(RESEND_COUNTDOWN);
    const [counting, setCounting]       = useState(true);
    const [error, setError]             = useState("");
    const inputRefs                     = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
    const shakeAnim                     = useRef(new Animated.Value(0)).current;

    const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

    // Countdown timer
    useEffect(() => {
        if (!counting) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(timer); setCounting(false); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [counting]);

    // Auto-submit
    useEffect(() => {
        if (otp.every((d) => d !== "")) handleVerify(otp.join(""));
    }, [otp]);

    const shake = () =>
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();

    const handleInput = (text: string, i: number) => {
        const digit = text.replace(/\D/g, "").slice(-1);
        const next  = [...otp]; next[i] = digit; setOtp(next); setError("");
        if (digit && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
    };

    const handleKey = (key: string, i: number) => {
        if (key === "Backspace" && !otp[i] && i > 0) {
            const next = [...otp]; next[i - 1] = ""; setOtp(next);
            inputRefs.current[i - 1]?.focus();
        }
    };

    const handleVerify = async (code: string) => {
        if (verifying || code.length !== OTP_LENGTH) return;
        setError("");
        try {
            const res = await verifyOtp({ phoneNumber, otp: code, party: party as AuthParty }).unwrap();

            // ----- Decide where to navigate ----------------------
            if (party === "business") {
                const status = res.data?.store?.onboardingStatus;
                if (type === "login" || status === "verified") {
                    router.replace("/business/home");
                } else {
                    router.push({
                        pathname: "/business/auth/ProfileSetup",
                        params: { categories: categories ?? "" },
                    });
                }
            } else {
                const status = res.data?.user?.onboardingStatus;
                if (type === "login" || status === "profile_complete" || status === "active") {
                    router.replace("/home");
                } else {
                    router.push("/auth/user/ProfileSetup");
                }
            }
        } catch (err: any) {
            shake();
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            const status = err?.status;
            if (status === 401)      setError("Incorrect code. Please try again.");
            else if (status === 410) setError("Code expired. Request a new one.");
            else                     setError(err?.data?.message ?? "Verification failed.");
        }
    };

    const handleResend = async () => {
        if (resending || counting) return;
        try {
            await resendOtp({ phoneNumber, type: "login", party: party as AuthParty }).unwrap();
            setOtp(Array(OTP_LENGTH).fill(""));
            setCountdown(RESEND_COUNTDOWN);
            setCounting(true);
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err?.data?.message ?? "Failed to resend.");
        }
    };

    const maskedPhone = phoneNumber
        ? `${phoneNumber.slice(0, 7)} *** ${phoneNumber.slice(-4)}`
        : "";

    const formatCountdown = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }}  onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1 }}  className="flex-1 bg-white  dark:bg-gray-900">
                {type !== "login" && <ProgressHeader currentStep={2} />}
                <ScrollView className="flex-1 " style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View className="pt-6 ">
                        <PageHeader title="Verify Your Number" subtitle={`Enter the 6-digit code sent to ${maskedPhone}`} />
                        <View className="px-6">
                            {/* OTP boxes */}
                            <Animated.View
                                style={{ transform: [{ translateX: shakeAnim }] }}
                                className="flex-row justify-between mt-4 mb-2"
                            >
                                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                    <TextInput
                                        key={i}
                                        ref={(r) => { inputRefs.current[i] = r; }}
                                        value={otp[i]}
                                        onChangeText={(t) => handleInput(t, i)}
                                        onKeyPress={({ nativeEvent }) => handleKey(nativeEvent.key, i)}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        textContentType="oneTimeCode"
                                        selectTextOnFocus
                                        className={`w-[48px] h-[56px] rounded-2xl border-2 text-center text-[22px] font-bold ${
                                            otp[i]
                                                ? "border-[#2A347E] dark:border-[#FDB415] bg-blue-50 dark:bg-yellow-950 text-[#2A347E] dark:text-[#FDB415]"
                                                : error
                                                ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950 text-red-500"
                                                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                        }`}
                                    />
                                ))}
                            </Animated.View>

                            {error ? (
                                <Text className="text-red-500 dark:text-red-400 text-[13px] text-center mt-2">{error}</Text>
                            ) : null}

                            {/* Resend */}
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-500 dark:text-gray-400 text-[14px]">Didn't receive a code? </Text>
                                {counting ? (
                                    <Text className="text-[14px] font-semibold text-gray-400 dark:text-gray-500">
                                        Resend in {formatCountdown(countdown)}
                                    </Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResend} disabled={resending}>
                                        <Text className="text-[14px] font-semibold text-[#2A347E] dark:text-[#FDB415]">
                                            {resending ? "Sending…" : "Resend OTP"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Manual verify */}
                            <View className="mt-8">
                                <Button
                                    title="Verify"
                                    onPress={() => handleVerify(otp.join(""))}
                                    isLoading={verifying}
                                    loadingText="Verifying…"
                                    disabled={verifying || otp.some((d) => d === "")}
                                />
                            </View>

                            <TouchableOpacity onPress={() => router.back()} className="mt-5 self-center">
                                <Text className="text-[13px] text-gray-500 dark:text-gray-400 text-center">
                                    Wrong number?{" "}
                                    <Text className="text-[#2A347E] dark:text-[#FDB415] font-semibold">Change it</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
