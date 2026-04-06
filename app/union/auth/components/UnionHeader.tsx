import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StepConfig {
    label: string;
    number: number;
}

const STEPS: StepConfig[] = [
    { label: "Register", number: 1 },
    { label: "Verification", number: 2 },
    { label: "Your Detail", number: 3 },
    { label: "Verification", number: 4 },
];

// ─── StepDot ─────────────────────────────────────────────────────────────────

function StepDot({
    step,
    currentStep,
}: {
    step: StepConfig;
    currentStep: number;
}) {
    const isCompleted = step.number < currentStep;
    const isActive = step.number === currentStep;

    return (
        <View className="items-center">
            <View
                className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
                    isCompleted
                        ? "bg-[#2d6a2d] border-[#2d6a2d]"
                        : isActive
                        ? "bg-white border-[#2d6a2d]"
                        : "bg-white border-gray-300"
                }`}
            >
                {isCompleted ? (
                    <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                    <Text
                        className={`text-xs font-bold ${
                            isActive ? "text-[#2d6a2d]" : "text-gray-400"
                        }`}
                    >
                        {String(step.number).padStart(2, "0")}
                    </Text>
                )}
            </View>
            <Text
                className={`text-[10px] mt-1 font-bold text-center ${
                    isCompleted || isActive ? "text-[#2d6a2d]" : "text-gray-400"
                }`}
                style={{ maxWidth: 52 }}
            >
                {step.label}
            </Text>
        </View>
    );
}

// ─── Connector ───────────────────────────────────────────────────────────────

function Connector({ filled }: { filled: boolean }) {
    return (
        <View className="flex-1 flex-row gap-2 mx-1 mb-4 items-center justify-center">
            <View
                className="w-[4px] h-[4px] rounded-full"
                style={{
                    borderWidth: 0,
                    backgroundColor: filled ? "#2d6a2d" : "#d1d5db",
                    borderStyle: filled ? "solid" : "dashed",
                }}
            />
            <View
                className="w-[4px] h-[4px] rounded-full"
                style={{
                    borderWidth: 0,
                    backgroundColor: filled ? "#2d6a2d" : "#d1d5db",
                    borderStyle: filled ? "solid" : "dashed",
                }}
            />
            <View
                className="w-[4px] h-[4px] rounded-full"
                style={{
                    borderWidth: 0,
                    backgroundColor: filled ? "#2d6a2d" : "#d1d5db",
                    borderStyle: filled ? "solid" : "dashed",
                }}
            />
            <View
                className="w-[4px] h-[4px] rounded-full"
                style={{
                    borderWidth: 0,
                    backgroundColor: filled ? "#2d6a2d" : "#d1d5db",
                    borderStyle: filled ? "solid" : "dashed",
                }}
            />
        
        </View>
    );
}

// ─── UnionHeader ─────────────────────────────────────────────────────────────

interface UnionHeaderProps {
    currentStep: number; // 1-4
    showBack?: boolean;
}

export default function UnionHeader({
    currentStep,
    showBack = true,
}: UnionHeaderProps) {
    return (
        <View className="bg-white pt-8 pb-2 px-5 border-b border-gray-100">
            {/* Top row */}
            <View className="flex-row items-center mb-5">
                {showBack ? (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-8 h-8 items-center justify-center mr-3"
                    >
                        <Ionicons name="arrow-back" size={22} color="#374151" />
                    </TouchableOpacity>
                ) : (
                    <View className="w-8 mr-3" />
                )}
                <View className="flex-1 items-center">
                    <Text className="text-2xl mb-2 font-bold text-gray-900">
                        Union Connect
                    </Text>
                </View>
                <View className="w-8" />
            </View>

            {/* Steps row */}
            <View className="flex-row items-center px-1 pb-1">
                {STEPS.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <StepDot step={step} currentStep={currentStep} />
                        {index < STEPS.length - 1 && (
                            <Connector filled={step.number < currentStep} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
}
