import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { IconCircle } from "../home";

export function ModalTitle({
    title,
    close,
}: {
    title: string;
    close?: () => void;
}) {
    return (
        <View className="flex-row justify-center py-5 relative ">
            <ThemedText className="!text-2xl font-bold">{title}</ThemedText>
            {close && (
                <IconCircle
                    onPress={close}
                    size={8}
                    iconName="close"
                    className="absolute right-6 top-5"
                />
            )}
        </View>
    );
}

export const CountdownTimer = ({ minutes = 30, seconds = 12 }) => {
    const [time, setTime] = useState(minutes * 60 + seconds);

    useEffect(() => {
        if (time <= 0) return;

        const timer = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min} : ${sec < 10 ? "0" : ""}${sec}s`;
    };

    return (
        <View className="bg-orange-100 w-28 px-4 py-2 rounded-full">
            <Text className="text-orange-500 text-2xl font-semibold">
                {formatTime(time)}
            </Text>
        </View>
    );
};

export const PaymentSummary = ({ label, value, coloredValue }: any) => {
    return (
        <View className={`flex-row justify-between mb-8 mt-5}`}>
            <ThemedText
                className={`text-gray-600 dark:!text-gray-400 !text-2xl `}
            >
                {label}
            </ThemedText>
            <ThemedText
                className={`font-bold !text-2xl dark:!text-gray-400 ${
                    coloredValue && "!text-orange-500"
                }`}
            >
                {value}
            </ThemedText>
        </View>
    );
};
