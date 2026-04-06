import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import UnionHeader from "./components/UnionHeader";

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 5;
const RESEND_SECONDS = 30;

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PhoneVerify() {
    const { phone } = useLocalSearchParams<{ phone: string }>();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(RESEND_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // ── Countdown timer ──────────────────────────────────────────────────────
    useEffect(() => {
        if (countdown <= 0) { setCanResend(true); return; }
        const t = setInterval(() => setCountdown((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [countdown]);

    // ── Shake animation ──────────────────────────────────────────────────────
    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 70, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 70, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 70, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 70, useNativeDriver: true }),
        ]).start();
    };

    // ── Input handlers ────────────────────────────────────────────────────────
    const handleInput = (text: string, index: number) => {
        const digit = text.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        setError("");
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            const next = [...otp];
            next[index - 1] = "";
            setOtp(next);
            inputRefs.current[index - 1]?.focus();
        }
    };

    // ── Verify ────────────────────────────────────────────────────────────────
    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) return;
        setIsVerifying(true);
        try {
            // TODO: call your verify-OTP endpoint
            await new Promise((r) => setTimeout(r, 800)); // simulated
            // Simulated failure demo — remove for real usage:
            if (code === "56500") {
                throw new Error("incorrect");
            }
            router.push({
                pathname: "/union/auth/UserDetails",
                params: { phone },
            });
        } catch {
            shake();
            setError("The OTP you entered is incorrect. Please check and try again");
            setOtp(Array(OTP_LENGTH).fill(""));
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        // TODO: call resend-OTP endpoint
        setOtp(Array(OTP_LENGTH).fill(""));
        setError("");
        setCountdown(RESEND_SECONDS);
        setCanResend(false);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    };

    const padTime = (n: number) => String(n).padStart(2, "0");
    const timeLabel = `${padTime(Math.floor(countdown / 60))}:${padTime(countdown % 60)}`;

    const isError = error.length > 0;
    const allFilled = otp.every((d) => d !== "");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white">
                <UnionHeader currentStep={2} showBack />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-8">
                        {/* Title */}
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            Phone Number Verification
                        </Text>
                        <Text className="text-gray-500 text-[14px] mb-10 leading-5">
                            Please enter the code sent to your register number
                        </Text>

                        {/* OTP label */}
                        <Text className="text-[14px] font-medium text-gray-700 mb-4">
                            OTP
                        </Text>

                        {/* OTP boxes */}
                        <Animated.View
                            style={{ transform: [{ translateX: shakeAnim }] }}
                            className="flex-row justify-between mb-3"
                        >
                            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                <TextInput
                                    key={i}
                                    ref={(r) => { inputRefs.current[i] = r; }}
                                    value={otp[i]}
                                    onChangeText={(t) => handleInput(t, i)}
                                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    selectTextOnFocus
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 10,
                                        borderWidth: 1.5,
                                        textAlign: "center",
                                        fontSize: 22,
                                        fontWeight: "700",
                                        borderColor: isError
                                            ? "#ef4444"
                                            : otp[i]
                                            ? "#2d6a2d"
                                            : "#d1d5db",
                                        backgroundColor: isError
                                            ? "#fef2f2"
                                            : otp[i]
                                            ? "#f0faf0"
                                            : "#f9fafb",
                                        color: isError ? "#ef4444" : "#111827",
                                    }}
                                />
                            ))}
                        </Animated.View>

                        {/* Error message */}
                        {isError && (
                            <Text className="text-red-500 text-[13px] text-center mb-4 leading-5">
                                {error}
                            </Text>
                        )}

                        {/* Resend */}
                        <View className="flex-row justify-center mt-2">
                            <Text className="text-gray-600 text-[13px]">
                                Didn't receive OTP?{"  "}
                            </Text>
                            <Text className="text-gray-600 text-[13px]">click </Text>
                            <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                                <Text
                                    className={`text-[13px] font-bold ${
                                        canResend ? "text-gray-900" : "text-gray-400"
                                    }`}
                                >
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>
                            {!canResend && (
                                <Text className="text-gray-600 text-[13px]">
                                    {" "}in {timeLabel}
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Verify button */}
                <View className="px-6 pb-10 pt-4">
                    <TouchableOpacity
                        onPress={handleVerify}
                        activeOpacity={0.85}
                        disabled={!allFilled || isVerifying}
                        className="rounded-full h-14 items-center justify-center"
                        style={{
                            backgroundColor:
                                allFilled && !isVerifying ? "#2d6a2d" : "#2d6a2d",
                            opacity: allFilled && !isVerifying ? 1 : 0.85,
                        }}
                    >
                        <Text className="text-white text-[16px] font-semibold">
                            {isVerifying ? "Verifying…" : "Verify"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
